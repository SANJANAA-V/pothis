import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Cpu, Clock, Zap } from 'lucide-react';
import { SensorReading, SystemStatusLevel } from '../types';

interface HeaderProps {
  reading: SensorReading;
  statusLevel: SystemStatusLevel;
  statusReason: string;
  driveMode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise';
  onDriveModeChange: (mode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise') => void;
}

export const Header: React.FC<HeaderProps> = ({
  reading,
  statusLevel,
  statusReason,
  driveMode,
  onDriveModeChange,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (statusLevel) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Critical Intervention
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            Load Peak Warning
          </span>
        );
      case 'Normal':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Operational
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-xs">
      {/* Top Institutional Metadata Bar */}
      <div className="bg-[#0a2540] px-4 lg:px-6 py-1.5 text-xs text-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium tracking-wide text-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">National Clean Energy & EV Initiative</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-mono text-[11px]">System ID: HESS-R2026-EXP</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateStr}</span>
            <span className="text-white font-medium">{timeStr} UTC</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200">Telemetry: 2000ms</span>
          </div>
        </div>
      </div>

      {/* Main Portal Header */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#0a2540] flex items-center justify-center text-white shadow-xs">
            <Zap className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#0a2540] tracking-tight">
                EnergySync
              </h1>
              <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Smart Hybrid Energy Storage System (HESS) • Engineering Telemetry Portal
            </p>
          </div>
        </div>

        {/* Right side controls: Drive Cycle Simulation Mode & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-600 px-2 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-500" />
              Cycle:
            </span>
            <button
              onClick={() => onDriveModeChange('urban-commute')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                driveMode === 'urban-commute'
                  ? 'bg-white text-[#0a2540] font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Urban
            </button>
            <button
              onClick={() => onDriveModeChange('aggressive-acceleration')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                driveMode === 'aggressive-acceleration'
                  ? 'bg-white text-[#0a2540] font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peak Surge
            </button>
            <button
              onClick={() => onDriveModeChange('regenerative-braking')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                driveMode === 'regenerative-braking'
                  ? 'bg-white text-[#0a2540] font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regen Braking
            </button>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>
      </div>
    </header>
  );
};
