"use client";
import React from "react";
import { Power, CheckCircle, XCircle } from "lucide-react";

export const ControlButtons: React.FC<{
  deviceId: string;
  deviceStatus: string; // 'online' | 'offline'
  relayState: boolean;
  toggleRelay: (newState: boolean) => void;
  groupName: string;
}> = ({ deviceStatus, relayState, toggleRelay, groupName }) => {
  const isOnline = deviceStatus === 'online';

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Status</span>
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

      {/* Control button */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{groupName} Control</span>
        <button
          onClick={() => toggleRelay(!relayState)}
          disabled={!isOnline}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            relayState
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          <Power size={16} />
          <span>{relayState ? "Turn OFF" : "Turn ON"}</span>
        </button>
      </div>

      {/* Current state indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <span className="text-sm text-gray-600">Current State:</span>
        <span className={`text-sm font-medium ${
          relayState ? "text-green-600" : "text-gray-600"
        }`}>
          {relayState ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};