export interface GroupData {
  voltage: number;
  current: number;
  power: number;
  connected: boolean;
  lampCount: number;
  description: string;
  relayPin: number;
}

export interface SensorData {
  ldr: number;
  pir1: boolean;
  pir2: boolean;
}

export interface StatusData {
  relay1: boolean;
  relay2: boolean;
  group1Active: boolean;
  group2Active: boolean;
  totalLampsOn: number;
  isDark: boolean;
}

export interface DevicePayload {
  deviceId: string;
  group1: GroupData;
  group2: GroupData;
  sensors: SensorData;
  status: StatusData;
  timestamp: number;
  uptime: number;
}
