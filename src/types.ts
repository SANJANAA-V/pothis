export interface SensorReading {
  timestamp: number;
  timeLabel: string;
  // Battery metrics
  batteryVoltage: number; // Volts (3.4 - 4.2V)
  batteryCurrent: number; // Amperes (-15A to +15A, +ve discharge, -ve charge)
  batteryTempKelvin: number; // Kelvin (292K - 298K)
  batteryTempCelsius: number; // Celsius (18.85°C - 24.85°C)
  stateOfCharge: number; // Percentage (0 - 100%)
  
  // Supercapacitor metrics
  supercapVoltage: number; // Volts (e.g. 2.1V - 2.8V or scaled 14.2V)
  supercapCurrent: number; // Amperes
  supercapSoC: number; // %
  
  // System Load & Power sharing
  totalLoadDemand: number; // Amperes or Watts
  batteryPowerShare: number; // % (e.g. 65%)
  supercapPowerShare: number; // % (e.g. 35%)
  batteryPowerWatts: number;
  supercapPowerWatts: number;
  
  // Predictive metrics
  dIdt: number; // Rate of change of current (A/s)
  predictedLoadCategory: 'Stable Load' | 'Rising Demand Expected' | 'Peak Load Imminent';
  predictionConfidence: number; // % (e.g. 92%)
  predictedCurrentNext30s: number; // A
}

export type SystemStatusLevel = 'Normal' | 'Warning' | 'Critical';

export interface ProtectionState {
  reversePolarity: 'Active' | 'Tripped';
  overvoltage: 'Active' | 'Tripped';
  undervoltage: 'Active' | 'Tripped';
  overtemperature: 'Active' | 'Tripped';
}

export interface AlertLogItem {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  automaticAction: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'charts'
  | 'prediction'
  | 'power-sharing'
  | 'protection'
  | 'tech-stack'
  | 'benefits'
  | 'about';
