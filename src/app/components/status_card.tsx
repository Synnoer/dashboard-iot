"use client";
import React from "react";
import { Wifi, Zap, ToggleLeft, ToggleRight, Moon } from "lucide-react";
import type { SensorData, StatusData } from "../types/device";

export const DeviceStatusCard: React.FC<{
  sensorData: SensorData[];
  deviceStatus: StatusData;
}> = ({ sensorData, deviceStatus }) => {
  const StatusCard: React.FC<{
    title: string;
    value: string | number | React.ReactNode;
    icon: React.ReactNode;
    status?: "good" | "warning" | "error";
  }> = ({ title, value, icon, status = "good" }) => {
    const statusColors = {
      good: "border-green-200 bg-green-50",
      warning: "border-yellow-200 bg-yellow-50",
      error: "border-red-200 bg-red-50",
    };

    return (
      <div
        className={`p-6 rounded-xl border-2 ${statusColors[status]} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600 text-sm font-medium">{title}</div>
          <div className="text-blue-600">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    );
  };

  // Get latest sensor reading (if any)
  const latestSensor = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Power Usage: sum relay powers or similar - assuming total power not in sensorData here, so use lamp count or status instead */}
      <StatusCard
        title="Total Lamps ON"
        value={deviceStatus.totalLampsOn}
        icon={<Zap size={24} />}
        status={deviceStatus.totalLampsOn > 0 ? "good" : "warning"}
      />

      {/* Relay 1 status */}
      <StatusCard
        title="Relay 1"
        value={deviceStatus.relay1 ? "ON" : "OFF"}
        icon={<ToggleLeft size={24} />}
        status={deviceStatus.relay1 ? "good" : "error"}
      />

      {/* Relay 2 status */}
      <StatusCard
        title="Relay 2"
        value={deviceStatus.relay2 ? "ON" : "OFF"}
        icon={<ToggleRight size={24} />}
        status={deviceStatus.relay2 ? "good" : "error"}
      />

      {/* Ambient Light Sensor */}
      <StatusCard
        title="Ambient Light (LDR)"
        value={latestSensor ? latestSensor.ldr : "N/A"}
        icon={<Wifi size={24} />}
        status={
          latestSensor && latestSensor.ldr < 20
            ? "warning"
            : "good"
        }
      />

      {/* Motion Sensors */}
      <StatusCard
        title="Motion Sensor 1"
        value={latestSensor?.pir1 ? "Detected" : "No Motion"}
        icon={<Wifi size={24} />}
        status={latestSensor?.pir1 ? "good" : "warning"}
      />

      <StatusCard
        title="Motion Sensor 2"
        value={latestSensor?.pir2 ? "Detected" : "No Motion"}
        icon={<Wifi size={24} />}
        status={latestSensor?.pir2 ? "good" : "warning"}
      />

      {/* Darkness status */}
      <StatusCard
        title="Is Dark"
        value={deviceStatus.isDark ? "Yes" : "No"}
        icon={<Moon size={24} />}
        status={deviceStatus.isDark ? "warning" : "good"}
      />
    </div>
  );
};
