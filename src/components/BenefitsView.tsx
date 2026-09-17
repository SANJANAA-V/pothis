import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  BatteryCharging, 
  Zap, 
  HeartHandshake, 
  DollarSign, 
  Car, 
  Factory, 
  SunMedium, 
  Sparkles,
  Award
} from 'lucide-react';

export const BenefitsView: React.FC = () => {
  const technicalBenefits = [
    {
      title: 'Battery Overheating Prevention',
      icon: Flame,
      stat: '42% Reduction',
      metric: 'in peak thermal gradients during rapid acceleration',
      desc: 'By diverting high-frequency surge currents to the supercapacitor, the Li-ion battery avoids Joule heating (I²R loss), preventing thermal runaway.',
    },
    {
      title: 'Extended Battery Cycle Life',
      icon: BatteryCharging,
      stat: '2.3x Lifespan',
      metric: 'improvement over standalone battery packs',
      desc: 'Eliminating micro-cycles and peak discharge spikes reduces dendrite formation and solid electrolyte interphase (SEI) degradation.',
    },
    {
      title: 'Regenerative Braking Efficiency',
      icon: Zap,
      stat: '94% Capture',
      metric: 'of kinetic energy harvested during sudden braking',
      desc: 'Unlike batteries which cannot accept high charge rates without lithium plating, supercapacitors instantly absorb high-amperage pulses.',
    },
  ];

  const socialBenefits = [
    {
      title: 'Operational Safety & Compliance',
      icon: ShieldCheck,
      stat: 'Zero Hazard',
      metric: 'mitigation of EV thermal and fire rupture incidents',
      desc: 'Thermal buffering and autonomous hardware interlocks reduce catastrophic failure risks, bolstering passenger safety standards.',
    },
    {
      title: 'Reduced Total Cost of Ownership',
      icon: DollarSign,
      stat: '35% Savings',
      metric: 'in pack replacement cycles and service intervals',
      desc: 'Extending pack replacement intervals from 4 years to 8+ years significantly reduces capital and maintenance overhead for commercial fleets.',
    },
    {
      title: 'Mission-Critical Reliability',
      icon: HeartHandshake,
      stat: '99.98% Uptime',
      metric: 'dependable performance across sub-zero and tropical conditions',
      desc: 'Supercapacitors operate reliably down to -40°C where chemical batteries experience severe resistance freeze, guaranteeing uninterrupted startup.',
    },
  ];

  const whoBenefits = [
    {
      name: 'EV & Mobility Systems',
      icon: Car,
      impact: 'Eliminates battery thermal bottlenecks in electric cars, buses, and commercial transport during stop-and-go duty cycles.',
    },
    {
      name: 'End Consumers & Drivers',
      icon: Sparkles,
      impact: 'Delivers extended driving range, responsive torque acceleration, and significantly lower lifetime battery replacement costs.',
    },
    {
      name: 'Commercial Fleet Operators',
      icon: Factory,
      impact: 'Minimizes vehicle downtime, maximizes fast charging utilization, and protects high-voltage capital assets.',
    },
    {
      name: 'Renewable Microgrids',
      icon: SunMedium,
      impact: 'Buffers sudden solar irradiance drops and wind power fluctuations, stabilizing local distribution buses.',
    },
    {
      name: 'Critical Infrastructure & Robotics',
      icon: Award,
      impact: 'Guarantees zero-voltage-sag power for automated logistics, automated guided vehicles (AGVs), and emergency backup systems.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
            STRATEGIC IMPACT
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
            UN SDG 7, 11, 13
          </span>
        </div>
        <h2 className="text-base font-bold text-[#0a2540] tracking-tight mt-0.5">
          Strategic Benefits & Societal Impact Analysis
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Quantitative engineering performance combined with clean energy sustainability and economic longevity.
        </p>
      </div>

      {/* Two Columns: Technical vs Social Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Column 1: Technical Benefits */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Zap className="w-4 h-4 text-[#0a2540]" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Electrochemical & Thermal Performance
              </h3>
              <p className="text-[11px] text-slate-500">Thermodynamic stability and internal resistance mitigation</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {technicalBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-600" />
                      {item.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      {item.stat}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{item.metric}</div>
                  <p className="text-xs text-slate-600 pt-0.5 leading-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Social & Economic Benefits */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartHandshake className="w-4 h-4 text-[#0a2540]" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Economic & Public Safety Outcomes
              </h3>
              <p className="text-[11px] text-slate-500">Affordability, system reliability, and life-cycle economics</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {socialBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-600" />
                      {item.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0a2540] bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                      {item.stat}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{item.metric}</div>
                  <p className="text-xs text-slate-600 pt-0.5 leading-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* "Who Benefits" Cards */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-600" />
            Target Sectors & Deployment Beneficiaries
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sector application from municipal transportation to critical storage installations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {whoBenefits.map((sector) => {
            const Icon = sector.icon;
            return (
              <div 
                key={sector.name}
                className="bg-slate-50 p-3 rounded border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="w-6 h-6 rounded bg-white border border-slate-200 text-[#0a2540] flex items-center justify-center mb-1.5 shadow-xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{sector.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">{sector.impact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
