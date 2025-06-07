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
import type { SensorData } from "../types/device";

export const Chart: React.FC<{ sensorData1: SensorData[]; sensorData2: SensorData[] }> = ({
  sensorData1,
  sensorData2,
}) => {
  // Helper to format timestamps to e.g. HH:mm or Date string (adjust as needed)
  const formatTimestamp = (ts: string | number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* First Device Power Usage */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Device 1 Power Consumption
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sensorData1}>
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
            <YAxis stroke="#666" fontSize={12} label={{ value: "Watts (W)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
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
      </div>

      {/* Second Device Power Usage */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Device 2 Power Consumption
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sensorData2}>
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
            <YAxis stroke="#666" fontSize={12} label={{ value: "Watts (W)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              labelFormatter={(label) => `Time: ${formatTimestamp(label)}`}
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
      </div>
    </div>
  );
};
