import React from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Thermometer, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw
} from 'lucide-react';

export const TechStackView: React.FC = () => {
  const hardwareStack = [
    {
      name: 'INA226 Voltage Sensor',
      type: 'High-Side / Low-Side I2C Monitor',
      icon: Zap,
      desc: 'Precision 16-bit bi-directional current & voltage shunt monitor with programmable alert thresholds.',
      specs: '0V - 36V Common Mode, 0.1% Max Error, I2C Interface (0x40)',
      role: 'Monitors real-time battery terminal potential and supercapacitor charge level.',
    },
    {
      name: 'ACS712 Current Sensor',
      type: 'Hall Effect Current Sensor IC',
      icon: Activity,
      desc: 'Galvanically isolated linear Hall-effect sensor with low-resistance copper conduction path.',
      specs: '±20A / ±30A Dynamic Range, 66-185 mV/A Sensitivity, Analog Output',
      role: 'Measures continuous traction current and instantaneous dI/dt rate of change.',
    },
    {
      name: 'DS18B20 Temperature Sensor',
      type: '1-Wire Digital Thermometer',
      icon: Thermometer,
      desc: 'Digital thermal transducer with user-selectable 9-bit to 12-bit Celsius temperature conversion.',
      specs: '-55°C to +125°C Range, ±0.5°C Accuracy, 1-Wire Serial Bus',
      role: 'Directly coupled to Li-ion core to trigger thermal derating and prevent runaway.',
    },
    {
      name: 'STM32 Microcontroller',
      type: 'ARM Cortex-M Embedded Controller',
      icon: Cpu,
      desc: 'High-performance 32-bit RISC core executing predictive load algorithms and PWM duty switching.',
      specs: '72MHz Core, 64KB Flash, 12-bit ADC, Timers for Synchronous Buck-Boost PWM',
      role: 'Hosts the HESS adaptive power split engine and safety trip interrupt routines.',
    },
    {
      name: 'Bidirectional DC-DC Power Converter',
      type: 'Synchronous Four-Switch Buck-Boost',
      icon: Layers,
      desc: 'High-frequency switched-mode converter decoupling supercapacitor voltage from the constant DC bus.',
      specs: '96.5% Peak Efficiency, 100kHz MOSFET Switching, Continuous Current Mode',
      role: 'Dynamically routes high-frequency current into or out of the supercapacitor buffer.',
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Sensor Initialization',
      subtitle: 'INA226, ACS712, DS18B20',
      detail: 'I2C, ADC, and 1-Wire buses calibrate baseline offsets and establish communications.',
    },
    {
      step: 2,
      title: 'Predict Load Demand',
      subtitle: 'dI/dt & Thermal Slope',
      detail: 'Microcontroller calculates rate-of-change (dI/dt) across sliding 50ms windows.',
    },
    {
      step: 3,
      title: 'Control Decision',
      subtitle: 'Adaptive Rule Matrix',
      detail: 'Algorithm determines dynamic power ratio between Li-ion base and Supercapacitor buffer.',
    },
    {
      step: 4,
      title: 'Adaptive Power Routing',
      subtitle: 'PWM Duty Cycle Shift',
      detail: 'DC-DC converter adjusts PWM to route peak transient amps into the supercapacitor.',
    },
    {
      step: 5,
      title: 'Safety Interlocks',
      subtitle: 'Closed-Loop Verification',
      detail: 'Validates OVP, UVP, and thermal boundaries before repeating the telemetry cycle.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
            ARCHITECTURE SPECIFICATION
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
            Embedded HESS Stack
          </span>
        </div>
        <h2 className="text-base font-bold text-[#0a2540] tracking-tight mt-0.5">
          Hardware Instrumentation & Components
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Precision transducers, ARM Cortex embedded microcontroller, and high-frequency power electronics.
        </p>
      </div>

      {/* 5-Step Operational Flowchart Stepper */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#0a2540]" />
              5-Step Closed-Loop Control Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic cycle executing on STM32 firmware every 50 milliseconds.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            Loop Rate: 20 Hz (50ms)
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 relative">
          {workflowSteps.map((item, idx) => (
            <div 
              key={item.step}
              className="bg-slate-50 p-3 rounded border border-slate-200 relative flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded bg-[#0a2540] text-white font-mono font-bold text-[11px] flex items-center justify-center">
                    0{item.step}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block w-3.5 h-3.5 text-slate-400 absolute -right-2 top-4 z-10" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{item.subtitle}</div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-normal">{item.detail}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {hardwareStack.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.name}
              className="bg-white border border-slate-200 rounded-md p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded bg-slate-100 border border-slate-200 text-[#0a2540]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs tracking-tight">{item.name}</h4>
                    <div className="text-[10px] font-mono text-slate-500">{item.type}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-normal">{item.desc}</p>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="text-slate-600 text-[11px]">
                  <span className="font-semibold text-slate-800">Specs:</span> {item.specs}
                </div>
                <div className="text-[#0a2540] font-mono text-[11px] pt-0.5 border-t border-slate-200">
                  <span className="text-slate-500 font-sans">Role:</span> {item.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
