"use client";
import React from "react";
import { Power, CheckCircle, XCircle } from "lucide-react";
import type { StatusData } from "../types/device";

export const ControlButtons: React.FC<{
  deviceId: string;
  deviceStatus: StatusData;
  toggleRelay: (deviceId: string, newState: boolean) => void;
}> = ({ deviceId, deviceStatus, toggleRelay }) => {
  const isOnline = true; // You can compute this if needed from lastSeen or heartbeat

  return (
    <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-black">Device Control</h3>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isOnline
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isOnline ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Relay 1</span>
          <button
            onClick={() => toggleRelay(deviceId, !deviceStatus.relay1)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              deviceStatus.relay1
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            <Power size={16} />
            <span>{deviceStatus.relay1 ? "Turn OFF" : "Turn ON"}</span>
          </button>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          Lamps ON: {deviceStatus.totalLampsOn} | Dark:{" "}
          {deviceStatus.isDark ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};
