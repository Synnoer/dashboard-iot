export interface PowerData {
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
  status?: string; // "sensor_error" when PZEM sensor fails
}

export interface DevicePayload {
  createdAt: string | number | Date;
  sensor_id: string;
  timestamp: number;
  
  pir1_status: number;  // Sent as 0 or 1
  pir2_status: number;  // Sent as 0 or 1
  
  relay1_status: number; // Sent as 0 or 1
  relay2_status: number; // Sent as 0 or 1

  // Power monitoring data from the single PZEM sensor
  // The C++ code sends NaN on error, which becomes null in JSON.
  voltage: number | null;
  current: number | null;
  power: number | null;
  energy: number | null;
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