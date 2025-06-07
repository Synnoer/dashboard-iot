"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/sidebar";
import { Chart } from "./components/chart";
import { DeviceStatusCard } from "./components/status_card";
import { ControlButtons } from "./components/button";
import { Footer } from "./components/footer";
import type { DevicePayload } from "./types/device";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [device1Payload, setDevice1Payload] = useState<DevicePayload | null>(null);
  const [device2Payload, setDevice2Payload] = useState<DevicePayload | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [res1, res2] = await Promise.all([
        fetch("/api/device/device-1"),
        fetch("/api/device/device-2"),
      ]);

      const [data1, data2]: [DevicePayload, DevicePayload] = await Promise.all([
        res1.json(),
        res2.json(),
      ]);

      setDevice1Payload(data1);
      setDevice2Payload(data2);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleRelay1 = async (deviceId: string, newState: boolean) => {
    await fetch(`/api/device/${deviceId}/relay1`, {
      method: "POST",
      body: JSON.stringify({ state: newState }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const handleToggleRelay2 = async (deviceId: string, newState: boolean) => {
    await fetch(`/api/device/${deviceId}/relay2`, {
      method: "POST",
      body: JSON.stringify({ state: newState }),
      headers: { "Content-Type": "application/json" },
    });
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceStatus1={device1Payload?.status || null}
        deviceStatus2={device2Payload?.status || null}
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

          {device1Payload && device2Payload ? (
            <>
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ControlButtons
                  deviceId="device-1"
                  deviceStatus={device1Payload.status}
                  toggleRelay={handleToggleRelay1}
                />
                <ControlButtons
                  deviceId="device-2"
                  deviceStatus={device2Payload.status}
                  toggleRelay={handleToggleRelay2}
                />
              </div>

              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <DeviceStatusCard
                  sensorData={[device1Payload.sensors]}
                  deviceStatus={device1Payload.status}
                />
                <DeviceStatusCard
                  sensorData={[device2Payload.sensors]}
                  deviceStatus={device2Payload.status}
                />
              </div>

              <Chart
                sensorData1={[device1Payload.sensors]}
                sensorData2={[device2Payload.sensors]}
              />
            </>
          ) : (
            <p className="text-gray-500">Loading device data...</p>
          )}
        
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
