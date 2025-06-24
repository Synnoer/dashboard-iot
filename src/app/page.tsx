"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Chart } from "./components/chart";
import { ControlButtons } from "./components/button";
import { Footer } from "./components/footer";
import type { DevicePayload } from "./types/device"; 

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [devicePayload, setDevicePayload] = useState<DevicePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This endpoint should return the latest data for your device
        const response = await fetch("/api/devices/status"); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: DevicePayload = await response.json();
        setDevicePayload(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch device data:', err);
        setError('Failed to load device data. Is the ESP32 online?');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // --- ADJUSTED: Generic relay control function ---
  // This single function can control either relay based on the relayId.
  const handleToggleRelay = async (relayId: '1' | '2', newState: boolean) => {
    if (!devicePayload?.sensor_id) {
        console.error("Device ID is not available to control relay.");
        return;
    }
    try {
      // --- CORRECTED: Using the dynamic API route from the Canvas ---
      const response = await fetch(`/api/${devicePayload.sensor_id}/relay/${relayId}`, {
        method: "POST",
        body: JSON.stringify({ state: newState }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        // Update UI to show an error message if needed
        console.error(`Failed to toggle relay ${relayId}`);
      }
      // Optimistically update UI or refetch data after control action
      // For now, the 5-second polling will update the state.
    } catch (err) {
      console.error(`Error toggling relay ${relayId}:`, err);
    }
  };
  
  // --- ADJUSTED: Helper function to determine device status ---
  const getDeviceStatus = () => {
    if (error) return 'offline';
    if (!devicePayload) return 'loading';
    // The PZEM sensor sends NaN on error, which becomes null in JSON.
    if (devicePayload.voltage === null) return 'sensor_error';
    return 'online';
  };

  const statusTextMap = {
      'offline': 'Offline',
      'loading': 'Loading...',
      'sensor_error': 'Sensor Error',
      'online': 'Online'
  };

  const statusColorMap = {
    'offline': 'text-red-600',
    'loading': 'text-gray-500',
    'sensor_error': 'text-yellow-600',
    'online': 'text-green-600'
  };
  
  const deviceStatus = getDeviceStatus();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceStatus={deviceStatus}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Smart Power Monitor</h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
            {devicePayload && (
              <p className="text-sm text-gray-500 mt-1">
                Device: {devicePayload.sensor_id} | 
                Status: <span className={`font-semibold ${statusColorMap[deviceStatus]}`}>
                   {statusTextMap[deviceStatus]}
                </span>
                | Last Update: {new Date(devicePayload.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {error && !isLoading && (
            <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 font-bold">Error: {error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center"><p>Loading device data...</p></div>
          ) : devicePayload ? (
            <>
              {/* --- ADJUSTED: Simplified Control section --- */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-black">Device Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Relay 1 Control */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-3 text-black">Relay 1</h4>
                    <ControlButtons
                      deviceId={devicePayload.sensor_id}
                      deviceStatus={deviceStatus}
                      relayState={!!devicePayload.relay1_status}
                      toggleRelay={(newState) => handleToggleRelay('1', newState)}
                      groupName="Relay 1"
                    />
                    <div className="mt-3 text-sm text-gray-600">
                      <p>PIR Sensor: {devicePayload.pir1_status ? '🔴 Motion' : '🟢 No Motion'}</p>
                      <p>Status: {devicePayload.relay1_status ? '✅ ON' : '⭕ OFF'}</p>
                    </div>
                  </div>
                  {/* Relay 2 Control */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-3 text-black">Relay 2</h4>
                    <ControlButtons
                      deviceId={devicePayload.sensor_id}
                      deviceStatus={deviceStatus}
                      relayState={!!devicePayload.relay2_status}
                      toggleRelay={(newState) => handleToggleRelay('2', newState)}
                      groupName="Relay 2"
                    />
                     <div className="mt-3 text-sm text-gray-600">
                      <p>PIR Sensor: {devicePayload.pir2_status ? '🔴 Motion' : '🟢 No Motion'}</p>
                      <p>Status: {devicePayload.relay2_status ? '✅ ON' : '⭕ OFF'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- ADJUSTED: Single Power Consumption section --- */}
              <div className="mb-8 text-black">
                <h3 className="text-xl font-semibold mb-4">Power Consumption</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {deviceStatus === 'sensor_error' ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 font-medium">PZEM Sensor Error</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div><span className="text-gray-600 block">Voltage</span><span className="font-medium text-xl">{devicePayload.voltage?.toFixed(1) ?? 'N/A'}V</span></div>
                        <div><span className="text-gray-600 block">Current</span><span className="font-medium text-xl">{devicePayload.current?.toFixed(2) ?? 'N/A'}A</span></div>
                        <div><span className="text-gray-600 block">Power</span><span className="font-medium text-xl">{devicePayload.power?.toFixed(1) ?? 'N/A'}W</span></div>
                        <div><span className="text-gray-600 block">Energy</span><span className="font-medium text-xl">{devicePayload.energy?.toFixed(2) ?? 'N/A'}kWh</span></div>
                    </div>
                  )}
                </div>
              </div>

            </>
          ) : (
             <div className="text-center p-8"><p>No device data available.</p></div>
          )}
        
          <Footer />
        </main>
      </div>
    </div>
  );
}