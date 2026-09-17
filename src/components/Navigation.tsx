import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  TrendingUp, 
  Share2, 
  ShieldAlert, 
  Cpu, 
  Award, 
  Users,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { ActiveTab, SystemStatusLevel } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  statusLevel: SystemStatusLevel;
  activeAlertCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  statusLevel,
  activeAlertCount,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'charts', label: 'Real-Time Monitoring', icon: LineChart },
    { id: 'power-sharing', label: 'Energy Flow', icon: Share2 },
    { id: 'prediction', label: 'Predictive Analysis', icon: TrendingUp },
    { id: 'protection', label: 'Protection & Safety', icon: ShieldAlert, badge: activeAlertCount > 0 ? `${activeAlertCount}` : undefined },
    { id: 'tech-stack', label: 'Technical Information', icon: Cpu },
    { id: 'benefits', label: 'Benefits & Impact', icon: Award },
    { id: 'about', label: 'Team & Project', icon: Users },
  ];

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-white border-r border-slate-200 text-slate-700 shrink-0 select-none">
        <div className="p-3.5 border-b border-slate-100">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Navigation Menu
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Radio className="w-3 h-3 text-emerald-600" />
              Bus: Online
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">
              I2C / ADC
            </span>
          </div>
        </div>

        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-[#0a2540] font-semibold border-l-3 border-[#0a2540]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#0a2540]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-200 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Hardware Simulation Card */}
        <div className="p-3 m-2.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              Telemetry Engine
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            STM32 controller & sensor bus simulation loop running at 0.5 Hz.
          </p>
        </div>
      </aside>

      {/* Mobile Horizontal Top Navigation Tabs */}
      <div className="md:hidden flex overflow-x-auto no-scrollbar bg-white border-b border-slate-200 p-1.5 gap-1 sticky top-[95px] z-30 shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0a2540] text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 px-1 text-[10px] font-mono bg-red-600 text-white rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
