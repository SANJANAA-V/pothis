import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  RotateCcw, 
  Bell, 
  CheckCircle2, 
  Flame, 
  ZapOff 
} from 'lucide-react';
import { ProtectionState, AlertLogItem } from '../types';

interface ProtectionViewProps {
  protections: ProtectionState;
  onToggleFault: (faultType: keyof ProtectionState) => void;
  onResetAllFaults: () => void;
  alertLogs: AlertLogItem[];
  onClearLogs: () => void;
}

export const ProtectionView: React.FC<ProtectionViewProps> = ({
  protections,
  onToggleFault,
  onResetAllFaults,
  alertLogs,
  onClearLogs,
}) => {
  const protectionCards = [
    {
      id: 'overvoltage' as keyof ProtectionState,
      name: 'Overvoltage Protection (OVP)',
      threshold: 'Threshold: Cutoff > 4.25 V',
      desc: 'Prevents Li-ion electrolyte oxidation, transition metal dissolution, and catastrophic thermal runaway.',
      mitigation: 'Trips solid-state battery relay; reroutes 100% current to supercapacitor buffer.',
      icon: Flame,
      tripped: protections.overvoltage === 'Tripped',
    },
    {
      id: 'undervoltage' as keyof ProtectionState,
      name: 'Undervoltage Protection (UVP)',
      threshold: 'Threshold: Cutoff < 3.30 V',
      desc: 'Prevents irreversible copper foil dissolution, internal micro-shorts, and permanent cell capacity loss.',
      mitigation: 'Engages regenerative pre-charge; throttles traction inverter demand.',
      icon: ZapOff,
      tripped: protections.undervoltage === 'Tripped',
    },
    {
      id: 'reversePolarity' as keyof ProtectionState,
      name: 'Reverse Polarity Protection',
      threshold: 'Threshold: V_diff < -0.20 V',
      desc: 'Solid-state P-channel MOSFET series gate disconnects reverse-biased DC connection.',
      mitigation: 'Autonomous circuit isolation within 45 microseconds.',
      icon: AlertTriangle,
      tripped: protections.reversePolarity === 'Tripped',
    },
  ];

  const anyTripped = Object.values(protections).some((val) => val === 'Tripped');

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                SAFETY INTERLOCK MATRIX
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                Autonomous Hardware Trip
              </span>
            </div>
            <h2 className="text-base font-bold text-[#0a2540] tracking-tight mt-0.5">
              Protection Layer & Fault Simulation
            </h2>
            <p className="text-xs text-slate-600">
              Multi-tiered electrical safety interlocks safeguarding battery cells against catastrophic overload and stress.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {anyTripped ? (
              <button
                onClick={onResetAllFaults}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Tripped Interlocks
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                All Interlocks Active & Healthy
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Protection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {protectionCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id}
              className={`bg-white border rounded-md p-4 shadow-xs transition-colors flex flex-col justify-between ${
                card.tripped 
                  ? 'border-red-300 bg-red-50/30' 
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`p-1.5 rounded border ${card.tripped ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${
                    card.tripped
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {card.tripped ? 'TRIPPED / FAULT' : 'NORMAL / ACTIVE'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs tracking-tight">{card.name}</h3>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">{card.threshold}</div>
                <p className="text-xs text-slate-600 mt-2 leading-normal">{card.desc}</p>

                {/* Automatic System Response */}
                <div className="mt-3 p-2.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                  <span className="font-semibold text-slate-700 text-[11px] block">Mitigation Action:</span>
                  <p className="text-slate-600 font-mono text-[11px] leading-tight">{card.mitigation}</p>
                </div>
              </div>

              {/* Interactive Fault Injection Toggle */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Test Simulator:</span>
                <button
                  onClick={() => onToggleFault(card.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded transition-colors border ${
                    card.tripped
                      ? 'bg-red-700 text-white border-red-800 hover:bg-red-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {card.tripped ? (
                    <>
                      <ToggleRight className="w-3.5 h-3.5" />
                      Clear Fault
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3.5 h-3.5 text-slate-500" />
                      Inject Fault
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert History Log */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-slate-900 text-xs tracking-tight">
              Safety Event & Protection Audit Log
            </h3>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
              {alertLogs.length} Records
            </span>
          </div>

          {alertLogs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Clear Log
            </button>
          )}
        </div>

        {alertLogs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            No safety incidents logged. Interlocks operating nominally.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {alertLogs.map((log) => (
              <div 
                key={log.id}
                className={`p-2.5 rounded border text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                  log.severity === 'critical'
                    ? 'bg-red-50/50 border-red-200 text-red-900'
                    : log.severity === 'warning'
                    ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                      {log.timestamp}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{log.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{log.message}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    Action: {log.automaticAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
