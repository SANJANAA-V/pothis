import React from 'react';
import { 
  Users, 
  Globe2, 
  CheckCircle2, 
  BookOpen, 
  Cpu, 
  Terminal, 
  LineChart, 
  Sparkles 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const teamMembers = [
    {
      name: 'Shabana Parveen M',
      role: 'Project Guide & Technical Mentor',
      badge: 'Academic Mentor',
      icon: BookOpen,
      desc: 'Technical oversight, research methodology validation, and architectural governance for the hybrid energy storage framework.',
    },
    {
      name: 'Vinothini M H',
      role: 'Researcher',
      badge: 'Electrochemical Modeling',
      icon: Sparkles,
      desc: 'Investigated Li-ion degradation mechanics, CC-CV charging characteristics, and supercapacitor impedance matching.',
    },
    {
      name: 'Pothiswaran T',
      role: 'Hardware Lead',
      badge: 'Sensors & Power Electronics',
      icon: Cpu,
      desc: 'Instrumentation design, INA226/ACS712 integration, STM32 circuit prototyping, and DC-DC converter testing.',
    },
    {
      name: 'Ruthish Kumar S I',
      role: 'Coding & Controls',
      badge: 'Embedded Firmware & Algorithms',
      icon: Terminal,
      desc: 'Developed closed-loop predictive load demand algorithms, dI/dt derivative tracking, and adaptive PWM frequency splitting.',
    },
    {
      name: 'Sanjay S',
      role: 'Data Analyst',
      badge: 'Telemetry & Validation',
      icon: LineChart,
      desc: 'Real-time telemetry analysis, thermal gradient regression, and CC-CV charge cycle data modeling.',
    },
  ];

  const sdgGoals = [
    {
      num: '07',
      title: 'Affordable & Clean Energy',
      color: 'bg-amber-600',
      desc: 'Optimizes battery cycle efficiency and increases energy capture from regenerative braking systems.',
    },
    {
      num: '11',
      title: 'Sustainable Cities & Communities',
      color: 'bg-orange-600',
      desc: 'Powers zero-emission urban mass transit fleets with resilient, low-maintenance energy storage systems.',
    },
    {
      num: '13',
      title: 'Climate Action',
      color: 'bg-emerald-700',
      desc: 'Mitigates lithium extraction footprints by extending battery operational lifespans from 4 to 8+ years.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                PROJECT REGISTRY
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                Project "WePOWER"
              </span>
            </div>
            <h2 className="text-base font-bold text-[#0a2540] tracking-tight mt-0.5">
              Team EnergySync • Smart Hybrid Energy Storage System
            </h2>
            <p className="text-xs text-slate-600">
              National clean energy and sustainable transportation engineering initiative.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-slate-700">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            <span>UN SDG Target Alignment</span>
          </div>
        </div>
      </div>

      {/* SDG Badges (7, 11, 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {sdgGoals.map((sdg) => (
          <div 
            key={sdg.num}
            className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded ${sdg.color} text-white font-bold text-base flex items-center justify-center font-mono shadow-xs`}>
                {sdg.num}
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Sustainable Development Goal</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{sdg.title}</h4>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-normal pt-1">
              {sdg.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Team Roster Grid */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0a2540]" />
              Research & Engineering Team
            </h3>
            <p className="text-xs text-slate-500">
              Cross-functional research and embedded systems implementation personnel.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            Affiliation: EnergySync
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teamMembers.map((member) => {
            const Icon = member.icon;
            return (
              <div 
                key={member.name}
                className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded bg-white border border-slate-200 text-[#0a2540]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {member.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs tracking-tight">{member.name}</h4>
                  <div className="text-[11px] font-medium text-[#0a2540]">{member.role}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-normal">{member.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Project WePOWER</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
