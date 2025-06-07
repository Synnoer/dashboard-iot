"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Chart } from "./components/chart";
import { DeviceStatusCard } from "./components/status_card";
import { ControlButtons } from "./components/button";
import { Footer } from "./components/footer";
import type { DevicePayload, StatusData, SensorData } from "./types/device";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [device1Payload, setDevice1Payload] = useState<DevicePayload | null>(
    null
  );
  const [device2Payload, setDevice2Payload] = useState<DevicePayload | null>(
    null
  );

  const [deviceStatus1, setDeviceStatus1] = useState<StatusData | null>(null);
  const [deviceStatus2, setDeviceStatus2] = useState<StatusData | null>(null);

  const [sensorData1, setSensorData1] = useState<SensorData[]>([]);
  const [sensorData2, setSensorData2] = useState<SensorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch("/api/device/device-1"); // Replace with your backend route
      const data1: DevicePayload = await res1.json();
      setDevice1Payload(data1);

      const res2 = await fetch("/api/device/device-2");
      const data2: DevicePayload = await res2.json();
      setDevice2Payload(data2);

      setDeviceStatus1({
        isOnline: true,
        isPoweredOn: data1.status.group1Active || data1.status.group2Active,
        lastSeen: new Date(data1.timestamp).toLocaleTimeString(),
        batteryLevel: Math.floor(Math.random() * 20) + 80, // Simulated
        signalStrength: Math.floor(Math.random() * 20) + 80, // Simulated
      });

      setDeviceStatus2({
        isOnline: true,
        isPoweredOn: data2.status.group1Active || data2.status.group2Active,
        lastSeen: new Date(data2.timestamp).toLocaleTimeString(),
        batteryLevel: Math.floor(Math.random() * 20) + 80,
        signalStrength: Math.floor(Math.random() * 20) + 80,
      });

      setSensorData1([
        {
          timestamp: new Date(data1.timestamp).toISOString(),
          temperature: data1.sensors.ldr / 10,
          humidity: data1.status.isDark ? 80 : 60,
          power: data1.group1.power + data1.group2.power,
        },
      ]);

      setSensorData2([
        {
          timestamp: new Date(data2.timestamp).toISOString(),
          temperature: data2.sensors.ldr / 10,
          humidity: data2.status.isDark ? 80 : 60,
          power: data2.group1.power + data2.group2.power,
        },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceStatus1={deviceStatus1}
        deviceStatus2={deviceStatus2}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Scrollable content area */}
        <main className="flex-1 overflow-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">
              Device Dashboard
            </h2>
            <p className="text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {deviceStatus1 && deviceStatus2 ? (
            <>
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ControlButtons
                  deviceStatus={deviceStatus1}
                  toggleDevice={() => {}}
                />
                <ControlButtons
                  deviceStatus={deviceStatus2}
                  toggleDevice={() => {}}
                />
              </div>

              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeviceStatusCard
                  sensorData={sensorData1}
                  deviceStatus={deviceStatus1}
                />
                <DeviceStatusCard
                  sensorData={sensorData2}
                  deviceStatus={deviceStatus2}
                />
              </div>

              <Chart sensorData1={sensorData1} sensorData2={sensorData2} />
            </>
          ) : (
            <p className="text-gray-500">Loading device data...</p>
          )}
          {/* Device Info Summary */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-black">
            <h3 className="text-lg font-semibold mb-4">Device Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <p className="text-lg font-semibold mb-4">Device 1 Status</p>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    deviceStatus1.isPoweredOn ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>Power Status: </span>
                <span className="font-medium">
                  {deviceStatus1.isPoweredOn ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-black">Battery: </span>
                <span className="font-medium">
                  {deviceStatus1.batteryLevel}%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    deviceStatus1.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>Connection: </span>
                <span className="font-medium">
                  {deviceStatus1.isOnline ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <p className="text-lg font-semibold mb-4">Device 2 Status</p>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    deviceStatus2.isPoweredOn ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>Power Status: </span>
                <span className="font-medium">
                  {deviceStatus2.isPoweredOn ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-black">Battery: </span>
                <span className="font-medium">
                  {deviceStatus2.batteryLevel}%
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    deviceStatus2.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>Connection: </span>
                <span className="font-medium">
                  {deviceStatus2.isOnline ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
