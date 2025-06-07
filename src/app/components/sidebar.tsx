"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wifi, Settings, Home, Activity } from "lucide-react";
import type { StatusData } from "../types/device";

const menuItems = [
  { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
  { id: "history", icon: <Activity size={20} />, label: "History" },
  { id: "settings", icon: <Settings size={20} />, label: "Settings" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  deviceStatus1: StatusData | null;
  deviceStatus2: StatusData | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ deviceStatus1, deviceStatus2 }) => {
  const pathname = usePathname();

  const isActive = (id: string) => pathname === `/${id}`;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-xl flex flex-col justify-between min-h-screen">
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            IoT Monitor
          </h1>
          <p className="text-slate-400 text-sm mt-1">Device Dashboard</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.id)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-white hover:bg-slate-700 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2 mb-2">
          <Wifi
            size={16}
            className={
              deviceStatus1?.group1Active ? "text-green-400" : "text-red-400"
            }
          />
          <span className="text-sm font-medium">Connection Status</span>
        </div>
        <div className="text-xs text-slate-400">
          {deviceStatus1?.group1Active ? "Connected" : "Disconnected"}
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Wifi
            size={16}
            className={
              deviceStatus2?.group2Active ? "text-green-400" : "text-red-400"
            }
          />
          <span className="text-sm font-medium">Connection Status</span>
        </div>
        <div className="text-xs text-slate-400">
          {deviceStatus2?.group2Active ? "Connected" : "Disconnected"}
        </div>
      </div>
    </aside>
  );
};
