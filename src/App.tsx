import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  SensorReading, 
  ActiveTab, 
  ProtectionState, 
  AlertLogItem 
} from './types';
import { 
  hessSimulationService, 
  evaluateSystemStatus 
} from './services/simulationService';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ChartsView } from './components/ChartsView';
import { PowerSharingView } from './components/PowerSharingView';
import { PredictionView } from './components/PredictionView';
import { ProtectionView } from './components/ProtectionView';
import { TechStackView } from './components/TechStackView';
import { BenefitsView } from './components/BenefitsView';
import { AboutView } from './components/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [reading, setReading] = useState<SensorReading>(() => hessSimulationService.getLatestReading());
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const [driveMode, setDriveMode] = useState<
    'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise'
  >('urban-commute');

  const [protections, setProtections] = useState<ProtectionState>({
    reversePolarity: 'Active',
    overvoltage: 'Active',
    undervoltage: 'Active',
    overtemperature: 'Active',
  });

  const [alertLogs, setAlertLogs] = useState<AlertLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      severity: 'info',
      title: 'HESS Supervisory Loop Initialized',
      message: 'STM32 primary controller synchronized with INA226 and ACS712 sensor buses.',
      automaticAction: 'Baseline calibration verified',
    },
  ]);

  // Handle telemetry subscription
  useEffect(() => {
    const unsubscribe = hessSimulationService.subscribe((newReading) => {
      if (!isPausedRef.current) {
        setReading(newReading);
        setHistory((prev) => {
          const updated = [...prev, newReading];
          // Keep up to 100 data points (well over the required 60 rolling points)
          return updated.slice(-100);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDriveModeChange = (
    mode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise'
  ) => {
    setDriveMode(mode);
    hessSimulationService.setDriveCycleMode(mode);

    let modeName = 'Urban Commute';
    if (mode === 'aggressive-acceleration') modeName = 'Peak Surge Acceleration';
    if (mode === 'regenerative-braking') modeName = 'Regenerative Braking';
    if (mode === 'highway-cruise') modeName = 'Highway Cruise';

    setAlertLogs((prev) => [
      {
        id: `mode-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        severity: 'info',
        title: `Drive Cycle Updated: ${modeName}`,
        message: `Traction power profile switched to ${modeName}. Adaptive algorithm re-evaluating baseline impedance.`,
        automaticAction: 'Dynamic split envelope updated',
      },
      ...prev,
    ]);
  };

  // Interactive Fault Toggling (for demo purposes)
  const handleToggleFault = useCallback((faultType: keyof ProtectionState) => {
    setProtections((prev) => {
      const currentlyTripped = prev[faultType] === 'Tripped';
      const nextStatus = currentlyTripped ? 'Active' : 'Tripped';
      const isTripping = !currentlyTripped;

      hessSimulationService.injectFault(faultType, isTripping);

      // Log alert
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      let title = '';
      let msg = '';
      let action = '';

      if (faultType === 'overvoltage') {
        title = isTripping ? 'FAULT: Overvoltage Triggered (> 4.25V)' : 'Overvoltage Fault Cleared';
        msg = isTripping 
          ? 'Battery terminal voltage exceeded 4.25V limit. Immediate risk of cell electrolyte decomposition.'
          : 'Battery terminal voltage stabilized below nominal threshold.';
        action = isTripping 
          ? 'Overvoltage detected — load shifted to supercapacitor, battery relay disconnected'
          : 'Battery relay re-engaged into adaptive power loop';
      } else if (faultType === 'undervoltage') {
        title = isTripping ? 'FAULT: Undervoltage Triggered (< 3.30V)' : 'Undervoltage Fault Cleared';
        msg = isTripping 
          ? 'Cell voltage depleted below 3.30V. Prevented deep discharge copper dissolution.'
          : 'Cell voltage recovered above 3.45V nominal baseline.';
        action = isTripping 
          ? 'Traction motor torque throttled; emergency regenerative trickle charge enabled'
          : 'Normal drive limits restored';
      } else if (faultType === 'reversePolarity') {
        title = isTripping ? 'FAULT: Reverse Polarity Interlock Tripped' : 'Reverse Polarity Cleared';
        msg = isTripping 
          ? 'Negative differential potential detected across terminal bus.'
          : 'Correct terminal polarity confirmed.';
        action = isTripping 
          ? 'Solid-state MOSFET gate isolated in 45µs; hardware disconnected'
          : 'MOSFET gate restored to conducting state';
      }

      setAlertLogs((currentLogs) => [
        {
          id: `fault-${Date.now()}`,
          timestamp: timeStr,
          severity: isTripping ? 'critical' : 'info',
          title,
          message: msg,
          automaticAction: action,
        },
        ...currentLogs,
      ]);

      return {
        ...prev,
        [faultType]: nextStatus,
      };
    });
  }, []);

  const handleResetAllFaults = useCallback(() => {
    setProtections({
      reversePolarity: 'Active',
      overvoltage: 'Active',
      undervoltage: 'Active',
      overtemperature: 'Active',
    });

    hessSimulationService.injectFault('overvoltage', false);
    hessSimulationService.injectFault('undervoltage', false);
    hessSimulationService.injectFault('reversePolarity', false);

    setAlertLogs((prev) => [
      {
        id: `reset-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        severity: 'info',
        title: 'Master Interlocks Reset',
        message: 'All safety flags cleared by operator. Closed-loop telemetry normal.',
        automaticAction: 'Resumed standard adaptive power sharing',
      },
      ...prev,
    ]);
  }, []);

  const handleClearLogs = () => {
    setAlertLogs([]);
  };

  const handleClearHistory = () => {
    setHistory([reading]);
  };

  const status = evaluateSystemStatus(reading, protections);
  const activeAlertCount = Object.values(protections).filter((p) => p === 'Tripped').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-[#0a2540] selection:text-white">
      {/* Official Government Top Header */}
      <Header
        reading={reading}
        statusLevel={status.level}
        statusReason={status.reason}
        driveMode={driveMode}
        onDriveModeChange={handleDriveModeChange}
      />

      {/* Body Layout: Desktop Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          statusLevel={status.level}
          activeAlertCount={activeAlertCount}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              reading={reading}
              statusLevel={status.level}
              statusReason={status.reason}
              protections={protections}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'charts' && (
            <ChartsView
              history={history}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'power-sharing' && (
            <PowerSharingView
              reading={reading}
              onDriveModeChange={handleDriveModeChange}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionView
              reading={reading}
              history={history}
            />
          )}

          {activeTab === 'protection' && (
            <ProtectionView
              protections={protections}
              onToggleFault={handleToggleFault}
              onResetAllFaults={handleResetAllFaults}
              alertLogs={alertLogs}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === 'tech-stack' && <TechStackView />}

          {activeTab === 'benefits' && <BenefitsView />}

          {activeTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Official Gov / Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px]">
            <span className="font-semibold text-[#0a2540]">EnergySync HESS</span>
            <span className="text-slate-300">•</span>
            <span>National Energy Research Portal</span>
            <span className="text-slate-300">•</span>
            <span>Project WePOWER</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-mono">UN SDG: 7, 11, 13</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            STM32 Telemetry Engine • Loop: 0.5 Hz • Institutional System Bus
          </div>
        </div>
      </footer>
    </div>
  );
}
