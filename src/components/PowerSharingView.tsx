import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  Share2, 
  ArrowRight, 
  Battery, 
  Layers, 
  Sliders
} from 'lucide-react';
import { SensorReading } from '../types';

interface PowerSharingViewProps {
  reading: SensorReading;
  onDriveModeChange: (mode: any) => void;
}

export const PowerSharingView: React.FC<PowerSharingViewProps> = ({
  reading,
  onDriveModeChange,
}) => {
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [injectedLoad, setInjectedLoad] = useState<number>(14);

  const effectiveLoad = manualOverride ? injectedLoad : Math.abs(reading.totalLoadDemand);
  
  let batPercent = 75;
  let scPercent = 25;

  if (effectiveLoad > 12) {
    scPercent = Math.min(80, Math.round(55 + (effectiveLoad - 12) * 2.2));
    batPercent = 100 - scPercent;
  } else if (effectiveLoad > 6) {
    scPercent = Math.round(30 + (effectiveLoad - 6) * 3.5);
    batPercent = 100 - scPercent;
  } else {
    scPercent = Math.max(12, Math.round(15 + effectiveLoad * 1.5));
    batPercent = 100 - scPercent;
  }

  const displayBatShare = manualOverride ? batPercent : reading.batteryPowerShare;
  const displayScShare = manualOverride ? scPercent : reading.supercapPowerShare;
  const displayTotalLoad = manualOverride ? effectiveLoad : reading.totalLoadDemand;

  const batCurrent = Number(((displayTotalLoad * displayBatShare) / 100).toFixed(2));
  const scCurrent = Number(((displayTotalLoad * displayScShare) / 100).toFixed(2));

  return (
    <div className="space-y-5">
      {/* Top Description & Architecture Concept */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              ENERGY FLOW CONTROL
            </div>
            <h2 className="text-base font-bold text-[#0a2540] tracking-tight">
              Dual-Source Adaptive Power Sharing
            </h2>
            <p className="text-xs text-slate-600">
              Li-ion battery manages baseline energy capacity, while the Supercapacitor buffers rapid transient spikes (dI/dt).
            </p>
          </div>

          {/* Interactive Simulation Switch */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setManualOverride(false)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                !manualOverride
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real-Time Telemetry
            </button>
            <button
              onClick={() => setManualOverride(true)}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                manualOverride
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3 h-3 text-slate-600" /> Manual Load Testing
            </button>
          </div>
        </div>

        {manualOverride && (
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                Simulate EV Acceleration Load Demand:
              </span>
              <span className="font-mono text-xs font-bold text-[#0a2540]">
                {injectedLoad.toFixed(1)} A {injectedLoad > 12 ? '(PEAK SURGE)' : injectedLoad > 6 ? '(MODERATE ACCELERATION)' : '(CRUISE LOAD)'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="24" 
              step="0.5"
              value={injectedLoad}
              onChange={(e) => setInjectedLoad(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#0a2540]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.0A (Battery Dominant)</span>
              <span>10.0A (Mid Ramp)</span>
              <span>24.0A (Supercapacitor Dominant)</span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Split Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Dynamic Power Ratio:</span>
            <span className="font-mono text-[#0a2540] font-bold">Battery {displayBatShare}%</span>
            <span className="text-slate-400">/</span>
            <span className="font-mono text-sky-700 font-bold">Supercapacitor {displayScShare}%</span>
          </div>
          <div className="text-slate-600 font-mono text-xs">
            Total Demand: <strong className="text-slate-900">{Math.abs(displayTotalLoad).toFixed(2)} A</strong>
          </div>
        </div>

        {/* Clean bar */}
        <div className="h-5 w-full bg-slate-100 rounded overflow-hidden flex border border-slate-200 p-0.5">
          <div 
            className="bg-[#0a2540] h-full rounded-l flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
            style={{ width: `${displayBatShare}%` }}
          >
            {displayBatShare > 18 && (
              <span className="truncate px-2 font-mono text-[11px] flex items-center gap-1">
                <Battery className="w-3 h-3" /> {displayBatShare}% ({batCurrent}A)
              </span>
            )}
          </div>
          <div 
            className="bg-sky-600 h-full rounded-r flex items-center justify-center text-xs font-bold text-white transition-all duration-300"
            style={{ width: `${displayScShare}%` }}
          >
            {displayScShare > 18 && (
              <span className="truncate px-2 font-mono text-[11px] flex items-center gap-1">
                <Layers className="w-3 h-3" /> {displayScShare}% ({scCurrent}A)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0a2540]"></span>
            Li-ion Protected from High dI/dt Stress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            Supercapacitor Absorbs Fast Transients
          </span>
        </div>
      </div>

      {/* Power Flow Diagram (SVG Schematic) */}
      <div className="bg-white border border-slate-200 rounded-md p-4 lg:p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Electromechanical Power Flow Schematic
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Energy distribution topology linking dual storage banks through DC-DC conversion to the vehicle traction load.
          </p>
        </div>

        {/* Clean SVG Diagram */}
        <div className="relative w-full max-w-4xl mx-auto py-2">
          <svg viewBox="0 0 900 300" className="w-full h-auto select-none font-sans">
            {/* Circuit Lines */}
            {/* Battery Path */}
            <path
              d="M 220 80 L 380 80"
              stroke="#0a2540"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 4"
            />
            {/* Supercap Path */}
            <path
              d="M 220 220 L 380 220"
              stroke="#0284c7"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 4"
            />
            {/* Converters to Common Bus */}
            <path
              d="M 520 80 L 600 150"
              stroke="#0a2540"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 520 220 L 600 150"
              stroke="#0284c7"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Bus to Load */}
            <path
              d="M 600 150 L 720 150"
              stroke="#0f172a"
              strokeWidth="3"
              fill="none"
            />

            {/* BLOCK 1: BATTERY PACK */}
            <g transform="translate(60, 40)">
              <rect width="160" height="80" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="80" y="28" fill="#0a2540" fontSize="12" fontWeight="bold" textAnchor="middle">
                Li-ion Battery Pack
              </text>
              <text x="80" y="46" fill="#475569" fontSize="11" textAnchor="middle" fontFamily="monospace">
                Base Energy: {displayBatShare}%
              </text>
              <text x="80" y="64" fill="#0a2540" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {reading.batteryVoltage}V | {batCurrent}A
              </text>
            </g>

            {/* BLOCK 2: SUPERCAPACITOR PACK */}
            <g transform="translate(60, 180)">
              <rect width="160" height="80" rx="4" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
              <text x="80" y="28" fill="#0369a1" fontSize="12" fontWeight="bold" textAnchor="middle">
                Supercapacitor Bank
              </text>
              <text x="80" y="46" fill="#475569" fontSize="11" textAnchor="middle" fontFamily="monospace">
                Peak Buffer: {displayScShare}%
              </text>
              <text x="80" y="64" fill="#0369a1" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {reading.supercapVoltage}V | {scCurrent}A
              </text>
            </g>

            {/* BLOCK 3: DC-DC CONVERTERS */}
            <g transform="translate(380, 50)">
              <rect width="140" height="60" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="70" y="26" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                DC-DC Converter 1
              </text>
              <text x="70" y="44" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Battery Bus Step
              </text>
            </g>

            <g transform="translate(380, 190)">
              <rect width="140" height="60" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="70" y="26" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                Bidirectional DC-DC
              </text>
              <text x="70" y="44" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Fast Transient Reg.
              </text>
            </g>

            {/* Central Junction Point */}
            <circle cx="600" cy="150" r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
            <text x="600" y="175" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
              DC BUS LINK
            </text>

            {/* BLOCK 4: EV TRACTION LOAD / MOTOR */}
            <g transform="translate(720, 110)">
              <rect width="150" height="80" rx="4" fill="#f8fafc" stroke="#0a2540" strokeWidth="1.5" />
              <text x="75" y="30" fill="#0a2540" fontSize="12" fontWeight="bold" textAnchor="middle">
                EV Traction Load
              </text>
              <text x="75" y="48" fill="#475569" fontSize="11" textAnchor="middle" fontFamily="monospace">
                Demand: {Math.abs(displayTotalLoad).toFixed(1)} A
              </text>
              <text x="75" y="65" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Inverter & Motor
              </text>
            </g>
          </svg>
        </div>

        {/* Rule-based logic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0a2540]"></span> 1. Steady Cruising
            </span>
            <p className="text-slate-600 leading-normal">
              When current demand is moderate (dI/dt &lt; 1.5A/s), the Li-ion battery supplies 75-85% of power at its optimal efficiency curve.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> 2. Acceleration / Surge
            </span>
            <p className="text-slate-600 leading-normal">
              When high dI/dt or torque demand is detected, the controller instantly shifts 60-80% of current draw to the supercapacitor buffer.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> 3. Regenerative Braking
            </span>
            <p className="text-slate-600 leading-normal">
              Braking energy is routed to the supercapacitor first, capturing high-amperage pulses that would otherwise accelerate battery degradation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
