import React from 'react';
import { 
  BatteryCharging, 
  Zap, 
  Thermometer, 
  Gauge, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { SensorReading, SystemStatusLevel, ProtectionState } from '../types';

interface DashboardViewProps {
  reading: SensorReading;
  statusLevel: SystemStatusLevel;
  statusReason: string;
  protections: ProtectionState;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reading,
  statusLevel,
  statusReason,
  protections,
  onNavigateTab,
}) => {
  const isDischarging = reading.batteryCurrent >= 0;
  const isSupercapDischarging = reading.supercapCurrent >= 0;

  // Energy Available calculation (nominal 3.7V 5Ah cell ~18.5 Wh)
  const energyAvailableWh = ((18.5 * reading.stateOfCharge) / 100).toFixed(1);

  // Instantaneous power
  const instantBatteryWatts = (reading.batteryVoltage * Math.abs(reading.batteryCurrent)).toFixed(1);
  const instantSupercapWatts = (reading.supercapVoltage * Math.abs(reading.supercapCurrent)).toFixed(1);

  const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <div className="space-y-5">
      {/* Top Section: Clear Hierarchy */}
      <div className="bg-white border border-slate-200 rounded-md p-4 lg:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              SYSTEM OVERVIEW
            </div>
            <h2 className="text-xl font-bold text-[#0a2540] tracking-tight mt-0.5">
              Smart Hybrid Energy Storage System
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Real-time telemetry and supervisory coordination of Li-ion battery and electric double-layer supercapacitor.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('power-sharing')}
            className="self-start md:self-auto px-3.5 py-2 bg-[#0a2540] hover:bg-[#123863] text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Energy Flow Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Status Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded">
            <span className="text-slate-500 font-medium">Status:</span>
            {statusLevel === 'Normal' && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Operational
              </span>
            )}
            {statusLevel === 'Warning' && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Peak Warning
              </span>
            )}
            {statusLevel === 'Critical' && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                Critical Trip
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Last Updated:</span>
            <span className="font-semibold text-slate-800">{nowTime} (2s sample)</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">Telemetry Status:</span>
            <span className="font-semibold text-slate-800">Active • STM32 Bus</span>
          </div>
        </div>
      </div>

      {/* 4-Column Metric Grid: 8 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Battery Voltage */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              Battery Voltage
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              INA226
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {reading.batteryVoltage.toFixed(3)}
            </span>
            <span className="text-sm font-medium text-slate-500">V</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Nominal: 3.70 V</span>
            <span>Range: 3.4 - 4.2 V</span>
          </div>
        </div>

        {/* 2. Battery Current */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Battery Current
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDischarging 
                ? 'bg-slate-50 text-slate-700 border-slate-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isDischarging ? 'Discharge' : 'Charge'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {reading.batteryCurrent > 0 ? `+${reading.batteryCurrent.toFixed(2)}` : reading.batteryCurrent.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-500">A</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>ACS712 Sensor</span>
            <span>Rated: ±15.0 A</span>
          </div>
        </div>

        {/* 3. Battery Temperature */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Thermometer className="w-3.5 h-3.5 text-slate-500" />
              Battery Temperature
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              DS18B20
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {reading.batteryTempCelsius.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">°C</span>
            </div>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs font-mono text-slate-500">
              {reading.batteryTempKelvin.toFixed(1)} K
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Nominal: 20.0 °C</span>
            <span className="text-emerald-700">Optimal Zone</span>
          </div>
        </div>

        {/* 4. State of Charge */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <BatteryCharging className="w-3.5 h-3.5 text-slate-500" />
              State of Charge
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              SoC
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {reading.stateOfCharge.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Coulomb Metric</span>
            <span className="text-emerald-700">20% - 95% Window</span>
          </div>
        </div>

        {/* 5. Power Flow */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Power Flow
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Net
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {instantBatteryWatts}
            </span>
            <span className="text-sm font-medium text-slate-500">W</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Split: {reading.batteryPowerShare}% Bat</span>
            <span>{reading.supercapPowerShare}% Cap</span>
          </div>
        </div>

        {/* 6. Energy Available */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              Energy Available
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Reserve
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {energyAvailableWh}
            </span>
            <span className="text-sm font-medium text-slate-500">Wh</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Pack: 18.5 Wh</span>
            <span>5.0 Ah Base</span>
          </div>
        </div>

        {/* 7. Supercapacitor Status */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              Supercapacitor Status
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              EDLC
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {reading.supercapVoltage.toFixed(3)}
            </span>
            <span className="text-sm font-medium text-slate-500">V</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Current: {reading.supercapCurrent > 0 ? `+${reading.supercapCurrent.toFixed(1)}` : reading.supercapCurrent.toFixed(1)} A</span>
            <span className="text-slate-600">{reading.supercapSoC.toFixed(0)}% Buffer</span>
          </div>
        </div>

        {/* 8. System Health */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              System Health
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Nominal
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono ${
              statusLevel === 'Normal' ? 'text-emerald-700' : statusLevel === 'Warning' ? 'text-amber-700' : 'text-red-700'
            }`}>
              {statusLevel === 'Normal' ? '100%' : statusLevel === 'Warning' ? '92%' : 'Alert'}
            </span>
            <span className="text-sm font-medium text-slate-500">Index</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
            <span>Interlocks: 3 Active</span>
            <span className="text-emerald-700">Bus Stable</span>
          </div>
        </div>

      </div>

      {/* Secondary Information & Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Real-Time Power Sharing Split */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                Adaptive Energy Flow Split
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Total Load: {reading.totalLoadDemand.toFixed(1)} A
            </span>
          </div>

          <div className="space-y-2">
            {/* Split Bar - Clean non-glowing */}
            <div className="h-3 w-full bg-slate-100 rounded overflow-hidden flex border border-slate-200">
              <div 
                className="bg-[#0a2540] h-full transition-all duration-300"
                style={{ width: `${reading.batteryPowerShare}%` }}
              />
              <div 
                className="bg-sky-600 h-full transition-all duration-300"
                style={{ width: `${reading.supercapPowerShare}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Base Storage (Li-ion)</div>
                <div className="text-sm font-bold text-[#0a2540] font-mono mt-0.5">
                  {reading.batteryPowerShare}% <span className="text-xs font-normal text-slate-500">({reading.batteryCurrent.toFixed(2)} A)</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Buffer Unit (Supercap)</div>
                <div className="text-sm font-bold text-sky-700 font-mono mt-0.5">
                  {reading.supercapPowerShare}% <span className="text-xs font-normal text-slate-500">({reading.supercapCurrent.toFixed(2)} A)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Load Demand Summary */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Predictive Demand Forecasting
            </h3>
            <button
              onClick={() => onNavigateTab('prediction')}
              className="text-xs text-[#0a2540] hover:underline flex items-center gap-1 font-medium"
            >
              Full Forecast &rarr;
            </button>
          </div>

          <div className="bg-slate-50 rounded p-3 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase font-mono">Predicted State</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {reading.predictedLoadCategory}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 uppercase font-mono">Model Confidence</div>
              <div className="text-sm font-mono font-bold text-slate-800">
                {reading.predictionConfidence}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-mono">
            <span>
              dI/dt: <strong className="text-slate-800">{reading.dIdt > 0 ? `+${reading.dIdt}` : reading.dIdt} A/s</strong>
            </span>
            <span>
              Target (Next 30s): <strong className="text-slate-800">{reading.predictedCurrentNext30s} A</strong>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
