import { SensorReading, SystemStatusLevel, ProtectionState } from '../types';

export interface HESSDataProvider {
  getLatestReading: () => SensorReading;
  subscribe: (callback: (reading: SensorReading) => void) => () => void;
  injectFault: (faultType: keyof ProtectionState, tripped: boolean) => void;
  setDriveCycleMode: (mode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise') => void;
}

class SimulationEngine implements HESSDataProvider {
  private listeners: Set<(reading: SensorReading) => void> = new Set();
  private timer: any = null;
  private timeElapsed = 0;
  
  // State variables for physical realism
  private currentSoC = 78.4; // %
  private currentTempK = 294.2; // ~21.05°C
  private currentVoltage = 3.84; // V
  private currentCurrent = 2.4; // A
  private currentSupercapV = 2.62; // V
  private currentSupercapI = 0.8; // A
  private driveMode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise' = 'urban-commute';

  private faultOverrides: Partial<Record<keyof ProtectionState, boolean>> = {};

  constructor() {
    this.start();
  }

  public setDriveCycleMode(mode: 'urban-commute' | 'aggressive-acceleration' | 'regenerative-braking' | 'highway-cruise') {
    this.driveMode = mode;
  }

  public injectFault(faultType: keyof ProtectionState, tripped: boolean) {
    this.faultOverrides[faultType] = tripped;
  }

  private start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, 2000); // 2 second interval as specified
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick() {
    this.timeElapsed += 2;
    const reading = this.generateNextReading();
    this.listeners.forEach((cb) => cb(reading));
  }

  public getLatestReading(): SensorReading {
    return this.generateNextReading(false);
  }

  public subscribe(callback: (reading: SensorReading) => void): () => void {
    this.listeners.add(callback);
    // Send immediate initial reading
    callback(this.getLatestReading());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private generateNextReading(advanceState = true): SensorReading {
    const t = this.timeElapsed;

    // Determine target load profile based on drive cycle and sinusoidal variations
    let rawTotalDemand = 0;

    switch (this.driveMode) {
      case 'aggressive-acceleration':
        // Sudden high spikes up to 28A total demand
        rawTotalDemand = 16 + 10 * Math.sin(t * 0.2) + (Math.random() * 4 - 2);
        break;
      case 'regenerative-braking':
        // Negative current charging the system
        rawTotalDemand = -12 + 4 * Math.sin(t * 0.15) + (Math.random() * 2 - 1);
        break;
      case 'highway-cruise':
        // Steady moderate load
        rawTotalDemand = 7.5 + 2 * Math.sin(t * 0.08) + (Math.random() * 1 - 0.5);
        break;
      case 'urban-commute':
      default:
        // Periodic stop-and-go with acceleration peaks and cruising
        rawTotalDemand = 5 + 8 * Math.sin(t * 0.1) + 4 * Math.cos(t * 0.04) + (Math.random() * 2.5 - 1.25);
        break;
    }

    // Bound total demand
    const totalDemand = Math.max(-18, Math.min(28, rawTotalDemand));

    // Rate of change calculation (dI/dt)
    const prevCurrent = this.currentCurrent;
    const currentDiff = totalDemand - prevCurrent;
    const dIdt = Number((currentDiff / 2).toFixed(2)); // A/s

    // Adaptive Power Sharing Algorithm:
    // Supercapacitor is optimized for high-frequency transients and surge absorption.
    // Battery provides baseline power to protect its chemistry from thermal degradation.
    let supercapFraction = 0.25; // Base 25% supercap

    if (totalDemand > 12 || Math.abs(dIdt) > 3.0) {
      // Peak load or rapid surge: Supercapacitor steps up to absorb up to 60-75%
      supercapFraction = 0.65 + Math.min(0.15, Math.abs(dIdt) * 0.03);
    } else if (totalDemand > 6 || Math.abs(dIdt) > 1.5) {
      // Moderate ramp
      supercapFraction = 0.42 + Math.random() * 0.06;
    } else if (totalDemand < -4) {
      // Heavy regenerative braking: Supercap absorbs fast incoming charge
      supercapFraction = 0.70;
    } else {
      // Cruising / low demand: Battery handles most (80-85%)
      supercapFraction = 0.18 + Math.random() * 0.05;
    }

    // If overvoltage fault is simulated, load is 100% shifted to supercapacitor
    if (this.faultOverrides.overvoltage) {
      supercapFraction = 0.95;
    }

    const supercapPowerShare = Math.min(95, Math.max(10, Math.round(supercapFraction * 100)));
    const batteryPowerShare = 100 - supercapPowerShare;

    // Current distribution
    const batI = totalDemand * (batteryPowerShare / 100);
    const scI = totalDemand * (supercapPowerShare / 100);

    // Apply physical constraints to battery current (-15A to +15A)
    const clampedBatI = Math.max(-15, Math.min(15, batI));
    const clampedScI = scI;

    // Battery Voltage dynamics:
    // Li-ion nominal 3.7V, range 3.4V - 4.2V.
    // Discharging causes IR drop (voltage droop), charging raises voltage.
    // Internal resistance R_int ~ 0.025 ohms
    const rInt = 0.022;
    const ocv = 3.4 + (this.currentSoC / 100) * 0.78; // Open circuit voltage
    let vTerminal = ocv - clampedBatI * rInt + (Math.random() * 0.02 - 0.01);

    // Inject simulated fault overrides
    if (this.faultOverrides.overvoltage) {
      vTerminal = 4.28 + Math.random() * 0.05; // > 4.2V trigger
    } else if (this.faultOverrides.undervoltage) {
      vTerminal = 3.22 - Math.random() * 0.04; // < 3.3V trigger
    } else {
      vTerminal = Math.max(3.40, Math.min(4.20, vTerminal));
    }

    // Battery Temperature dynamics:
    // Joule heating P = I^2 * R_int + ambient cooling.
    // Realistic prototype range 292K - 298K (18.85°C - 24.85°C)
    const heatingFactor = (Math.abs(clampedBatI) ** 1.4) * 0.008;
    const coolingFactor = (this.currentTempK - 293.15) * 0.015;
    let nextTempK = this.currentTempK + (heatingFactor - coolingFactor) + (Math.random() * 0.05 - 0.025);
    nextTempK = Math.max(292.0, Math.min(298.0, nextTempK));

    // Supercapacitor Voltage dynamics (fast swing 2.1V to 2.8V)
    let scV = this.currentSupercapV - (clampedScI * 0.012) + (Math.random() * 0.015 - 0.007);
    scV = Math.max(2.10, Math.min(2.85, scV));

    // SoC calculation integration
    // 1Ah cell for prototype scale; 2 seconds tick
    const deltaSoC = -(clampedBatI * (2 / 3600) / 1.0) * 100;
    let nextSoC = Math.max(10, Math.min(99.5, this.currentSoC + deltaSoC * 0.05));

    // Predictive Load Demand Analysis logic
    let predictedCategory: 'Stable Load' | 'Rising Demand Expected' | 'Peak Load Imminent' = 'Stable Load';
    let confidence = 94;
    let predictedCurrentNext30s = clampedBatI;

    if (dIdt > 2.8 || totalDemand > 14) {
      predictedCategory = 'Peak Load Imminent';
      confidence = Math.min(99, 88 + Math.round(Math.abs(dIdt) * 3));
      predictedCurrentNext30s = Math.min(15, clampedBatI + dIdt * 1.5);
    } else if (dIdt > 0.8 || totalDemand > 7) {
      predictedCategory = 'Rising Demand Expected';
      confidence = Math.min(96, 85 + Math.round(dIdt * 4));
      predictedCurrentNext30s = clampedBatI + 2.5;
    } else {
      predictedCategory = 'Stable Load';
      confidence = 92 + Math.floor(Math.random() * 6);
      predictedCurrentNext30s = clampedBatI * 0.95;
    }

    if (advanceState) {
      this.currentCurrent = clampedBatI;
      this.currentVoltage = vTerminal;
      this.currentTempK = nextTempK;
      this.currentSoC = nextSoC;
      this.currentSupercapV = scV;
      this.currentSupercapI = clampedScI;
    }

    const now = new Date();
    const timeLabel = now.toTimeString().split(' ')[0];

    const tempC = Number((nextTempK - 273.15).toFixed(2));
    const batWatts = Number((vTerminal * clampedBatI).toFixed(1));
    const scWatts = Number((scV * clampedScI).toFixed(1));

    return {
      timestamp: Date.now(),
      timeLabel,
      batteryVoltage: Number(vTerminal.toFixed(3)),
      batteryCurrent: Number(clampedBatI.toFixed(2)),
      batteryTempKelvin: Number(nextTempK.toFixed(2)),
      batteryTempCelsius: tempC,
      stateOfCharge: Number(nextSoC.toFixed(1)),

      supercapVoltage: Number(scV.toFixed(3)),
      supercapCurrent: Number(clampedScI.toFixed(2)),
      supercapSoC: Number((((scV - 2.1) / (2.85 - 2.1)) * 100).toFixed(1)),

      totalLoadDemand: Number(totalDemand.toFixed(2)),
      batteryPowerShare,
      supercapPowerShare,
      batteryPowerWatts: batWatts,
      supercapPowerWatts: scWatts,

      dIdt,
      predictedLoadCategory: predictedCategory,
      predictionConfidence: confidence,
      predictedCurrentNext30s: Number(predictedCurrentNext30s.toFixed(2)),
    };
  }
}

export const hessSimulationService = new SimulationEngine();

export function evaluateSystemStatus(reading: SensorReading, protections: ProtectionState): {
  level: SystemStatusLevel;
  reason: string;
  badgeClass: string;
} {
  if (
    protections.reversePolarity === 'Tripped' ||
    protections.overvoltage === 'Tripped' ||
    protections.undervoltage === 'Tripped' ||
    reading.batteryVoltage > 4.22 ||
    reading.batteryVoltage < 3.32
  ) {
    return {
      level: 'Critical',
      reason: 'Safety interlock active - voltage threshold exceeded or protection tripped',
      badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/40',
    };
  }

  if (
    reading.batteryTempKelvin > 297.2 ||
    Math.abs(reading.batteryCurrent) > 13.5 ||
    reading.predictedLoadCategory === 'Peak Load Imminent'
  ) {
    return {
      level: 'Warning',
      reason: 'Elevated thermal gradient or imminent peak demand detected',
      badgeClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
    };
  }

  return {
    level: 'Normal',
    reason: 'Nominal operation - adaptive HESS load distribution synchronized',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
  };
}
