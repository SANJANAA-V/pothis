import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { Play, Pause, RefreshCw, Activity, Thermometer, Zap, BatteryCharging } from 'lucide-react';
import { SensorReading } from '../types';

interface ChartsViewProps {
  history: SensorReading[];
  isPaused: boolean;
  onTogglePause: () => void;
  onClearHistory: () => void;
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  history,
  isPaused,
  onTogglePause,
  onClearHistory,
}) => {
  const [selectedZoom, setSelectedZoom] = useState<'30' | '60'>('60');

  const pointsToShow = selectedZoom === '30' ? 30 : 60;
  const chartData = history.slice(-pointsToShow);
  const latest = history[history.length - 1] || null;

  return (
    <div className="space-y-5">
      {/* Chart Control Bar */}
      <div className="bg-white border border-slate-200 rounded-md p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
            TELEMETRY RECORDING
          </div>
          <h2 className="text-base font-bold text-[#0a2540] tracking-tight">
            Real-Time Electrical & Thermal Monitoring
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Zoom filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <span className="text-slate-500 px-2 font-mono text-[11px]">Window:</span>
            <button
              onClick={() => setSelectedZoom('30')}
              className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                selectedZoom === '30'
                  ? 'bg-white text-slate-900 font-semibold border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Pts (60s)
            </button>
            <button
              onClick={() => setSelectedZoom('60')}
              className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                selectedZoom === '60'
                  ? 'bg-white text-slate-900 font-semibold border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              60 Pts (120s)
            </button>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isPaused
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current text-amber-700" /> Resume Stream
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-slate-500" /> Freeze View
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onClearHistory}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" /> Reset Buffer
          </button>
        </div>
      </div>

      {/* Chart 1: Current vs Time */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                Current Trend: Battery vs. Supercapacitor Absorption
              </h3>
              <p className="text-[11px] text-slate-500">
                Continuous baseline charging/discharging current and transient surge buffering (±15.0 A)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#0a2540] font-medium">
              Battery: <strong>{latest ? `${latest.batteryCurrent > 0 ? '+' : ''}${latest.batteryCurrent} A` : '--'}</strong>
            </span>
            <span className="text-sky-700 font-medium">
              Supercap: <strong>{latest ? `${latest.supercapCurrent > 0 ? '+' : ''}${latest.supercapCurrent} A` : '--'}</strong>
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[-16, 16]} 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                unit="A"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#cbd5e1', 
                  borderRadius: '4px', 
                  color: '#0f172a',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} 
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
              <ReferenceLine y={12} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Peak Limit (12A)', fill: '#b45309', fontSize: 10, position: 'insideTopLeft' }} />
              <Line 
                type="monotone" 
                dataKey="batteryCurrent" 
                name="Battery Current (A)" 
                stroke="#0a2540" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="supercapCurrent" 
                name="Supercapacitor Current (A)" 
                stroke="#0284c7" 
                strokeWidth={1.5} 
                strokeDasharray="3 2"
                dot={false}
                isAnimationActive={false}
              />
              <Legend 
                verticalAlign="top" 
                height={24} 
                wrapperStyle={{ fontSize: '11px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Voltage vs Time */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                Voltage Trend: Li-ion Terminal Potential (CC-CV Curve)
              </h3>
              <p className="text-[11px] text-slate-500">
                Electrochemical plateau and discharge internal resistance (IR) droop (3.4V – 4.2V)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-800 font-medium">
              Battery: <strong>{latest ? `${latest.batteryVoltage} V` : '--'}</strong>
            </span>
            <span className="text-slate-500 font-medium">
              Supercap: <strong>{latest ? `${latest.supercapVoltage} V` : '--'}</strong>
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[3.3, 4.3]} 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                unit="V"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#cbd5e1', 
                  borderRadius: '4px', 
                  color: '#0f172a',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} 
              />
              <ReferenceLine y={4.2} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'CV Saturation (4.20V)', fill: '#b91c1c', fontSize: 10, position: 'insideTopLeft' }} />
              <ReferenceLine y={3.7} stroke="#0284c7" strokeDasharray="2 2" label={{ value: 'Nominal 3.7V', fill: '#0369a1', fontSize: 10, position: 'insideBottomLeft' }} />
              <ReferenceLine y={3.4} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Cutoff (3.40V)', fill: '#b91c1c', fontSize: 10, position: 'insideBottomRight' }} />
              <Line 
                type="monotone" 
                dataKey="batteryVoltage" 
                name="Battery Voltage (V)" 
                stroke="#0f766e" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Legend 
                verticalAlign="top" 
                height={24} 
                wrapperStyle={{ fontSize: '11px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Battery Temperature vs Time */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                Thermal Trend: Cell Core Temperature
              </h3>
              <p className="text-[11px] text-slate-500">
                DS18B20 digital transducer output tracking core thermodynamic slope (292.0K - 298.0K)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-800 font-medium">
              Kelvin: <strong>{latest ? `${latest.batteryTempKelvin} K` : '--'}</strong>
            </span>
            <span className="text-slate-600 font-medium">
              Celsius: <strong>{latest ? `${latest.batteryTempCelsius} °C` : '--'}</strong>
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[291.5, 298.5]} 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                unit="K"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#cbd5e1', 
                  borderRadius: '4px', 
                  color: '#0f172a',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} 
              />
              <ReferenceLine y={297.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Thermal Warning (297K)', fill: '#b45309', fontSize: 10, position: 'insideTopLeft' }} />
              <ReferenceLine y={293.15} stroke="#64748b" strokeDasharray="2 2" label={{ value: '20°C Reference (293.15K)', fill: '#64748b', fontSize: 10, position: 'insideBottomLeft' }} />
              <Line 
                type="monotone" 
                dataKey="batteryTempKelvin" 
                name="Battery Temperature (K)" 
                stroke="#991b1b" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Legend 
                verticalAlign="top" 
                height={24} 
                wrapperStyle={{ fontSize: '11px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: State of Charge Trend */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                State of Charge & Buffer Utilization
              </h3>
              <p className="text-[11px] text-slate-500">
                Coulomb-integrated capacity percentage and supercapacitor fast-buffer availability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-700 font-medium">
              Battery SoC: <strong>{latest ? `${latest.stateOfCharge}%` : '--'}</strong>
            </span>
            <span className="text-sky-700 font-medium">
              Supercap Buffer: <strong>{latest ? `${latest.supercapSoC}%` : '--'}</strong>
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#cbd5e1', 
                  borderRadius: '4px', 
                  color: '#0f172a',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} 
              />
              <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Lower Reserve (20%)', fill: '#b45309', fontSize: 10, position: 'insideBottomLeft' }} />
              <ReferenceLine y={95} stroke="#64748b" strokeDasharray="2 2" label={{ value: 'Upper Cutoff (95%)', fill: '#64748b', fontSize: 10, position: 'insideTopLeft' }} />
              <Line 
                type="monotone" 
                dataKey="stateOfCharge" 
                name="Battery SoC (%)" 
                stroke="#047857" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="supercapSoC" 
                name="Supercap Buffer (%)" 
                stroke="#0284c7" 
                strokeWidth={1.5} 
                strokeDasharray="3 2"
                dot={false}
                isAnimationActive={false}
              />
              <Legend 
                verticalAlign="top" 
                height={24} 
                wrapperStyle={{ fontSize: '11px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
