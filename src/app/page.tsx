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
        
        const responseData = await response.json();
        
        // Handle the API response structure: { success: true, data: [...] }
        if (responseData.success && responseData.data && responseData.data.length > 0) {
          // Get the first device from the array (since we're showing one device)
          const deviceData = responseData.data[0];
          setDevicePayload(deviceData);
          setError(null);
        } else {
          throw new Error('No device data available');
        }
        
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

  // Generic relay control function
  const handleToggleRelay = async (relayId: '1' | '2', newState: boolean) => {
    if (!devicePayload?.sensor_id) {
        console.error("Device ID is not available to control relay.");
        return;
    }
    try {
      // Using the dynamic API route
      const response = await fetch(`/api/${encodeURIComponent(devicePayload.sensor_id)}/relay/${relayId}`, {
        method: "POST",
        body: JSON.stringify({ state: newState }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        console.error(`Failed to toggle relay ${relayId}: ${response.status}`);
        // You might want to show a toast notification here
      } else {
        console.log(`Successfully toggled relay ${relayId} to ${newState}`);
        // Optionally update the UI optimistically while waiting for next poll
        setDevicePayload(prev => prev ? {
          ...prev,
          [`relay${relayId}_status`]: newState ? 1 : 0
        } : null);
      }
    } catch (err) {
      console.error(`Error toggling relay ${relayId}:`, err);
    }
  };
  
  // Helper function to determine device status
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

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

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
                | Last Update: {formatTimestamp(devicePayload.timestamp)}
              </p>
            )}
          </div>

          {error && !isLoading && (
            <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 font-bold">Error: {error}</p>
              <p className="text-red-600 text-sm mt-1">
                Check if the API is running and the device is connected.
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading device data...</p>
            </div>
          ) : devicePayload ? (
            <>
              {/* Device Controls section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-black">Device Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Relay 1 Control */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h4 className="text-lg font-medium mb-3 text-black">Relay 1 Control</h4>
                    <ControlButtons
                      deviceId={devicePayload.sensor_id}
                      deviceStatus={deviceStatus}
                      relayState={!!devicePayload.relay1_status}
                      toggleRelay={(newState) => handleToggleRelay('1', newState)}
                      groupName="Relay 1"
                    />
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">PIR Sensor:</span>
                        <span className={`font-medium ${devicePayload.pir1_status ? 'text-red-600' : 'text-green-600'}`}>
                          {devicePayload.pir1_status ? '🔴 Motion Detected' : '🟢 No Motion'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Relay Status:</span>
                        <span className={`font-medium ${devicePayload.relay1_status ? 'text-green-600' : 'text-gray-500'}`}>
                          {devicePayload.relay1_status ? '✅ ON' : '⭕ OFF'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Relay 2 Control */}
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h4 className="text-lg font-medium mb-3 text-black">Relay 2 Control</h4>
                    <ControlButtons
                      deviceId={devicePayload.sensor_id}
                      deviceStatus={deviceStatus}
                      relayState={!!devicePayload.relay2_status}
                      toggleRelay={(newState) => handleToggleRelay('2', newState)}
                      groupName="Relay 2"
                    />
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">PIR Sensor:</span>
                        <span className={`font-medium ${devicePayload.pir2_status ? 'text-red-600' : 'text-green-600'}`}>
                          {devicePayload.pir2_status ? '🔴 Motion Detected' : '🟢 No Motion'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Relay Status:</span>
                        <span className={`font-medium ${devicePayload.relay2_status ? 'text-green-600' : 'text-gray-500'}`}>
                          {devicePayload.relay2_status ? '✅ ON' : '⭕ OFF'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Power Consumption section */}
              <div className="mb-8 text-black">
                <h3 className="text-xl font-semibold mb-4">Power Consumption</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {deviceStatus === 'sensor_error' ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">⚠️</div>
                      <p className="text-red-600 font-medium text-lg">PZEM Sensor Error</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Unable to read power consumption data. Check sensor connection.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl mb-2">⚡</div>
                        <span className="text-gray-600 block text-sm">Voltage</span>
                        <span className="font-bold text-2xl text-blue-600">
                          {devicePayload.voltage?.toFixed(1) ?? 'N/A'}
                        </span>
                        <span className="text-gray-500 text-sm">V</span>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl mb-2">🔌</div>
                        <span className="text-gray-600 block text-sm">Current</span>
                        <span className="font-bold text-2xl text-orange-600">
                          {devicePayload.current?.toFixed(2) ?? 'N/A'}
                        </span>
                        <span className="text-gray-500 text-sm">A</span>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl mb-2">💡</div>
                        <span className="text-gray-600 block text-sm">Power</span>
                        <span className="font-bold text-2xl text-green-600">
                          {devicePayload.power?.toFixed(1) ?? 'N/A'}
                        </span>
                        <span className="text-gray-500 text-sm">W</span>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl mb-2">📊</div>
                        <span className="text-gray-600 block text-sm">Energy</span>
                        <span className="font-bold text-2xl text-purple-600">
                          {devicePayload.energy?.toFixed(2) ?? 'N/A'}
                        </span>
                        <span className="text-gray-500 text-sm">kWh</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </>
          ) : (
             <div className="text-center p-8">
               <div className="text-6xl mb-4">📱</div>
               <p className="text-gray-600 text-lg">No device data available</p>
               <p className="text-gray-500 text-sm mt-2">
                 Make sure your ESP32 device is connected and sending data.
               </p>
             </div>
          )}
        
          <Footer />
        </main>
      </div>
    </div>
  );
}