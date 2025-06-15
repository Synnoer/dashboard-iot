export interface PowerData {
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
  status?: string; // "sensor_error" when PZEM sensor fails
}

export interface DevicePayload {
  deviceId: string;
  timestamp: number;
  
  // Environmental sensors
  ldrValue: number;
  isDark: boolean;
  pir1State: boolean;
  pir2State: boolean;
  
  // Group status
  group1Active: boolean;
  group2Active: boolean;
  
  // Power monitoring data
  group1Power: PowerData;
  group2Power: PowerData;
}

// Optional: Helper types for API responses
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: DevicePayload;
}

// Optional: For device control endpoints
export interface RelayControlRequest {
  state: boolean;
}

export interface RelayControlResponse {
  success: boolean;
  deviceId: string;
  relay: string;
  newState: boolean;
  message?: string;
}