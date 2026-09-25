export interface TelemetryData {
  sst: number; // Sea Surface Temp (°C)
  dhw: number; // Degree Heating Weeks (°C-weeks)
  oxygen: number; // Dissolved O2 (mg/L)
  ph: number;
  salinity: number; // PSU
  depth: number; // meters
  status: 'OPTIMAL' | 'ELEVATED' | 'SEVERE';
}

export interface AgentInfo {
  id: string;
  name: string;
  icon: string;
  role: string;
  detailedRole: string;
  color: string;
  status: 'SCANNING...' | 'CORRELATING...' | 'VERIFYING...' | 'SIMULATING...' | 'AUDITING...' | 'ONLINE';
  cycleStatuses: string[];
  metrics: string;
}

export type SoundMode = 'muted' | 'enabled';

export interface CursorBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vy: number;
}
