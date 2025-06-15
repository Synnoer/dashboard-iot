"use client";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { DevicePayload } from "../types/device";

export const Chart: React.FC<{ 
  sensorData1: DevicePayload[]; 
  sensorData2: DevicePayload[];
  deviceName: string;
}> = ({
  sensorData1,
  sensorData2,
  deviceName
}) => {
  // Helper to format timestamps
  const formatTimestamp = (ts: string | number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Transform data for Group 1 chart
  const group1Data = sensorData1
    .filter(data => data.group1Power.status !== 'sensor_error')
    .map(data => ({
      timestamp: data.timestamp,
      power: data.group1Power.power || 0,
      voltage: data.group1Power.voltage || 0,
      current: data.group1Power.current || 0,
      energy: data.group1Power.energy || 0,
    }));

  // Transform data for Group 2 chart
  const group2Data = sensorData2
    .filter(data => data.group2Power.status !== 'sensor_error')
    .map(data => ({
      timestamp: data.timestamp,
      power: data.group2Power.power || 0,
      voltage: data.group2Power.voltage || 0,
      current: data.group2Power.current || 0,
      energy: data.group2Power.energy || 0,
    }));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Power Consumption Charts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group 1 Power Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Group 1 Power Consumption (4 Lamps)
          </h4>
          {group1Data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={group1Data}>
                <defs>
                  <linearGradient id="powerGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={formatTimestamp}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  label={{ value: "Watts (W)", angle: -90, position: "insideLeft" }} 
                />
                <Tooltip
                  labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(2) : value,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#powerGradient1)"
                  name="Power (W)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No data available</p>
                <p className="text-sm">Group 1 sensor error or no readings</p>
              </div>
            </div>
          )}
        </div>

        {/* Group 2 Power Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Group 2 Power Consumption (4 Lamps)
          </h4>
          {group2Data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={group2Data}>
                <defs>
                  <linearGradient id="powerGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={formatTimestamp}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  label={{ value: "Watts (W)", angle: -90, position: "insideLeft" }} 
                />
                <Tooltip
                  labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(2) : value,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#powerGradient2)"
                  name="Power (W)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No data available</p>
                <p className="text-sm">Group 2 sensor error or no readings</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device info */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Device: {deviceName} | Showing power consumption for both lamp groups</p>
      </div>
    </div>
  );
};