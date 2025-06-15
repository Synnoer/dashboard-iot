"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Wifi, Settings, Home, Activity, Zap, AlertTriangle } from "lucide-react";

const menuItems = [
  { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
  { id: "history", icon: <Activity size={20} />, label: "History" },
  { id: "settings", icon: <Settings size={20} />, label: "Settings" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  deviceStatus: string | null; // 'online' | 'offline' | null
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  deviceStatus
}) => {
  const pathname = usePathname();

  const isActive = (id: string) => pathname === `/${id}` || activeTab === id;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'online':
        return <Wifi size={16} className="text-green-400" />;
      case 'offline':
        return <AlertTriangle size={16} className="text-red-400" />;
      default:
        return <Wifi size={16} className="text-gray-400" />;
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-xl flex flex-col justify-between min-h-screen">
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smart Lamp
          </h1>
          <p className="text-slate-400 text-sm mt-1">Controller Dashboard</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.id)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-white hover:bg-slate-700 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {/* Device Status Card */}
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 mb-3">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm font-medium">ESP32 Device</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(deviceStatus)}
                <span className="text-xs text-slate-300">Status:</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(deviceStatus)}`}>
                {getStatusText(deviceStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 mb-3">
            <Activity size={16} className="text-green-400" />
            <span className="text-sm font-medium">Quick Stats</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Groups:</span>
              <span className="text-slate-300">2 Groups</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Lamps:</span>
              <span className="text-slate-300">8 Lamps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sensors:</span>
              <span className="text-slate-300">PIR + LDR</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};