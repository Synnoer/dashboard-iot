"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Chart } from "./components/chart";
import { ControlButtons } from "./components/button";
import { Footer } from "./components/footer";
import type { DevicePayload } from "./types/device";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Changed: Only one device now
  const [devicePayload, setDevicePayload] = useState<DevicePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from your single device endpoint
        const response = await fetch("/api/device/status");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: DevicePayload = await response.json();
        setDevicePayload(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch device data:', err);
        setError('Failed to load device data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Control functions for both relay groups on the single device
  const handleToggleRelay1 = async (newState: boolean) => {
    try {
      const response = await fetch(`/api/device/${devicePayload?.deviceId}/relay1`, {
        method: "POST",
        body: JSON.stringify({ state: newState }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        console.error('Failed to toggle relay 1');
      }
    } catch (err) {
      console.error('Error toggling relay 1:', err);
    }
  };

  const handleToggleRelay2 = async (newState: boolean) => {
    try {
      const response = await fetch(`/api/device/${devicePayload?.deviceId}/relay2`, {
        method: "POST",
        body: JSON.stringify({ state: newState }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        console.error('Failed to toggle relay 2');
      }
    } catch (err) {
      console.error('Error toggling relay 2:', err);
    }
  };

  // Helper function to determine device status
  const getDeviceStatus = () => {
    if (!devicePayload) return 'offline';
    
    // Check if both power sensors have errors
    const group1HasError = devicePayload.group1Power.status === 'sensor_error';
    const group2HasError = devicePayload.group2Power.status === 'sensor_error';
    
    if (group1HasError && group2HasError) return 'offline';
    return 'online';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar - Updated for single device */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceStatus={getDeviceStatus()}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Scrollable content area */}
        <main className="flex-1 overflow-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">
              Smart Lamp Controller Dashboard
            </h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {devicePayload && (
              <p className="text-sm text-gray-500 mt-1">
                Device: {devicePayload.deviceId} | 
                Status: <span className={`font-semibold ${
                  getDeviceStatus() === 'online' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getDeviceStatus()}
                </span>
                | Last Update: {new Date(devicePayload.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {error ? (
            <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">Error: {error}</p>
              <p className="text-red-600 text-sm mt-1">
                Make sure your ESP32 is connected and sending data to the API.
              </p>
            </div>
          ) : isLoading ? (
            <div className="mb-8 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading device data...</p>
            </div>
          ) : devicePayload ? (
            <>
              {/* Control buttons for both relay groups */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Lamp Group Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-3">Group 1 (4 Lamps)</h4>
                    <ControlButtons
                      deviceId={devicePayload.deviceId}
                      deviceStatus={getDeviceStatus()}
                      relayState={devicePayload.group1Active}
                      toggleRelay={handleToggleRelay1}
                      groupName="Group 1"
                    />
                    <div className="mt-3 text-sm text-gray-600">
                      <p>PIR Sensor: {devicePayload.pir1State ? '🔴 Motion' : '🟢 No Motion'}</p>
                      <p>Auto Status: {devicePayload.group1Active ? '✅ ON' : '⭕ OFF'}</p>
                      <p>Power Status: {devicePayload.group1Power.status === 'sensor_error' ? '🔴 Sensor Error' : '🟢 Normal'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-3">Group 2 (4 Lamps)</h4>
                    <ControlButtons
                      deviceId={devicePayload.deviceId}
                      deviceStatus={getDeviceStatus()}
                      relayState={devicePayload.group2Active}
                      toggleRelay={handleToggleRelay2}
                      groupName="Group 2"
                    />
                    <div className="mt-3 text-sm text-gray-600">
                      <p>PIR Sensor: {devicePayload.pir2State ? '🔴 Motion' : '🟢 No Motion'}</p>
                      <p>Auto Status: {devicePayload.group2Active ? '✅ ON' : '⭕ OFF'}</p>
                      <p>Power Status: {devicePayload.group2Power.status === 'sensor_error' ? '🔴 Sensor Error' : '🟢 Normal'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental sensor data */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Environmental Sensors</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {devicePayload.isDark ? '🌙' : '☀️'}
                      </div>
                      <p className="text-lg font-medium">
                        {devicePayload.isDark ? 'Dark' : 'Bright'}
                      </p>
                      <p className="text-sm text-gray-600">
                        LDR: {devicePayload.ldrValue}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {devicePayload.pir1State ? '🚶' : '🚫'}
                      </div>
                      <p className="text-lg font-medium">PIR 1</p>
                      <p className="text-sm text-gray-600">
                        {devicePayload.pir1State ? 'Motion Detected' : 'No Motion'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {devicePayload.pir2State ? '🚶' : '🚫'}
                      </div>
                      <p className="text-lg font-medium">PIR 2</p>
                      <p className="text-sm text-gray-600">
                        {devicePayload.pir2State ? 'Motion Detected' : 'No Motion'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Power consumption data */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Power Consumption</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold mb-4">Group 1 Power</h4>
                    {devicePayload.group1Power.status === 'sensor_error' ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">⚠️</div>
                        <p className="text-red-600 font-medium">Sensor Error</p>
                        <p className="text-sm text-gray-500">PZEM sensor not responding</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voltage:</span>
                          <span className="font-medium">{devicePayload.group1Power.voltage?.toFixed(1) || 0}V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current:</span>
                          <span className="font-medium">{devicePayload.group1Power.current?.toFixed(2) || 0}A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Power:</span>
                          <span className="font-medium">{devicePayload.group1Power.power?.toFixed(1) || 0}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Energy:</span>
                          <span className="font-medium">{devicePayload.group1Power.energy?.toFixed(2) || 0}kWh</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold mb-4">Group 2 Power</h4>
                    {devicePayload.group2Power.status === 'sensor_error' ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">⚠️</div>
                        <p className="text-red-600 font-medium">Sensor Error</p>
                        <p className="text-sm text-gray-500">PZEM sensor not responding</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voltage:</span>
                          <span className="font-medium">{devicePayload.group2Power.voltage?.toFixed(1) || 0}V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current:</span>
                          <span className="font-medium">{devicePayload.group2Power.current?.toFixed(2) || 0}A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Power:</span>
                          <span className="font-medium">{devicePayload.group2Power.power?.toFixed(1) || 0}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Energy:</span>
                          <span className="font-medium">{devicePayload.group2Power.energy?.toFixed(2) || 0}kWh</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts - Show data from single device */}
              <Chart
                sensorData1={[devicePayload]}
                sensorData2={[devicePayload]} // Same device, different groups
                deviceName={devicePayload.deviceId}
              />
            </>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 text-lg">No device data available</p>
              <p className="text-gray-400 text-sm mt-2">
                Check if your ESP32 is connected and sending data
              </p>
            </div>
          )}
        
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}