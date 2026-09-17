import React from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Activity, 
  Clock, 
  Gauge
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { SensorReading } from '../types';

interface PredictionViewProps {
  reading: SensorReading;
  history: SensorReading[];
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  reading,
  history,
}) => {
  const recentHistory = history.slice(-10);
  const forecastData: any[] = [];

  recentHistory.forEach((pt) => {
    forecastData.push({
      time: pt.timeLabel,
      actual: pt.batteryCurrent,
      predicted: null,
    });
  });

  const lastActual = reading.batteryCurrent;
  const dIdt = reading.dIdt;

  for (let i = 1; i <= 6; i++) {
    const futureSec = i * 5;
    const projectedVal = Number((lastActual + (dIdt * (1 - i * 0.12))).toFixed(2));

    forecastData.push({
      time: `+${futureSec}s`,
      actual: null,
      predicted: projectedVal,
    });
  }

  const getPredictionColor = () => {
    switch (reading.predictedLoadCategory) {
      case 'Peak Load Imminent':
        return {
          badge: 'bg-red-50 text-red-800 border-red-200',
          text: 'text-red-700',
          desc: 'High acceleration transient detected. Adaptive control primes supercapacitor to absorb imminent current crest.',
        };
      case 'Rising Demand Expected':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          text: 'text-amber-700',
          desc: 'Positive current acceleration (dI/dt > 0.8A/s). DC-DC converter begins dynamic impedance scaling.',
        };
      case 'Stable Load':
      default:
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          text: 'text-emerald-700',
          desc: 'Load fluctuations within nominal boundary. Battery carries primary steady-state load safely.',
        };
    }
  };

  const predInfo = getPredictionColor();

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              PREDICTIVE ANALYSIS
            </div>
            <h2 className="text-base font-bold text-[#0a2540] tracking-tight">
              Load Demand Prediction (30-Second Horizon)
            </h2>
            <p className="text-xs text-slate-600">
              Anticipates EV motor torque transients before thermal thresholds are reached in the Li-ion battery.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lookahead: <strong>30.0s Horizon</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Prediction Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Card 1: Prediction Status */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <BrainCircuit className="w-3.5 h-3.5 text-slate-500" />
                State Assessment
              </span>
              <span className="font-mono text-[10px] text-slate-500">REALTIME</span>
            </div>

            <div className={`text-lg font-bold ${predInfo.text} tracking-tight`}>
              {reading.predictedLoadCategory}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-normal">
              {predInfo.desc}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${predInfo.badge}`}>
              Buffer Modulation Active
            </span>
          </div>
        </div>

        {/* Card 2: Confidence Rating */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <Gauge className="w-3.5 h-3.5 text-slate-500" />
                Model Confidence
              </span>
              <span className="font-mono text-[10px] text-emerald-700 font-semibold">HIGH FIDELITY</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900">
                {reading.predictionConfidence}
              </span>
              <span className="text-sm font-medium text-slate-500">%</span>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-[#0a2540] transition-all duration-300"
                style={{ width: `${reading.predictionConfidence}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Threshold: &gt; 80%</span>
              <span>Kalman Filtered</span>
            </div>
          </div>
        </div>

        {/* Card 3: dI/dt & Derivative */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                Current Rate of Change (dI/dt)
              </span>
              <span className="font-mono text-[10px] text-slate-500">DERIVATIVE</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900">
                {reading.dIdt > 0 ? `+${reading.dIdt}` : reading.dIdt}
              </span>
              <span className="text-xs font-mono text-slate-500">A / sec</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 font-mono space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Voltage Trend:</span>
              <span className={reading.batteryVoltage > 3.7 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                {reading.batteryVoltage > 3.7 ? 'Nominal High' : 'Discharge Droop'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Target (30s):</span>
              <span className="text-slate-900 font-bold">{reading.predictedCurrentNext30s} A</span>
            </div>
          </div>
        </div>

      </div>

      {/* Forecast Chart */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-600" />
            <div>
              <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
                Forecast Trajectory: Measured vs Upcoming 30 Seconds
              </h3>
              <p className="text-[11px] text-slate-500">
                Solid line represents historical measured current; dashed line projects forward load requirement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#0a2540] font-medium">● Measured Current</span>
            <span className="text-sky-700 font-medium">┅ Horizon Forecast (+30s)</span>
          </div>
        </div>

        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tick={{ fontSize: 10, fill: '#64748b' }} 
              />
              <YAxis 
                domain={[-15, 20]} 
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
              <ReferenceLine x="+5s" stroke="#f59e0b" strokeDasharray="2 2" label={{ value: 'Lookahead Start', fill: '#b45309', fontSize: 10 }} />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Measured Current (A)"
                stroke="#0a2540" 
                strokeWidth={2} 
                fill="#0a2540" 
                fillOpacity={0.08} 
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="Predicted Current (A)"
                stroke="#0284c7" 
                strokeWidth={2} 
                strokeDasharray="4 2"
                fill="#0284c7" 
                fillOpacity={0.08} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
