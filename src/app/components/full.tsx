'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Power, 
  Wifi, 
  Thermometer, 
  Droplets, 
  Zap, 
  Settings, 
  Home, 
  BarChart3, 
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DeviceData {
  timestamp: string;
  temperature: number;
  humidity: number;
  power: number;
}

interface DeviceStatus {
  isOnline: boolean;
  isPoweredOn: boolean;
  lastSeen: string;
  batteryLevel: number;
  signalStrength: number;
}

const IoTDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    isOnline: true,
    isPoweredOn: true,
    lastSeen: new Date().toLocaleTimeString(),
    batteryLevel: 87,
    signalStrength: 92
  });

  const [sensorData, setSensorData] = useState<DeviceData[]>([]);

  // Generate mock data
  useEffect(() => {
    const generateData = () => {
      const data: DeviceData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: 20 + Math.random() * 15 + Math.sin(i * 0.5) * 5,
          humidity: 40 + Math.random() * 20 + Math.cos(i * 0.3) * 10,
          power: 50 + Math.random() * 30 + Math.sin(i * 0.7) * 15
        });
      }
      
      setSensorData(data);
    };

    generateData();
    const interval = setInterval(generateData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const toggleDevice = () => {
    setDeviceStatus(prev => ({
      ...prev,
      isPoweredOn: !prev.isPoweredOn,
      lastSeen: new Date().toLocaleTimeString()
    }));
  };

  const StatusCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; status?: 'good' | 'warning' | 'error' }> = ({ 
    title, 
    value, 
    icon, 
    status = 'good' 
  }) => {
    const statusColors = {
      good: 'border-green-200 bg-green-50',
      warning: 'border-yellow-200 bg-yellow-50',
      error: 'border-red-200 bg-red-50'
    };

    return (
      <div className={`p-6 rounded-xl border-2 ${statusColors[status]} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600 text-sm font-medium">{title}</div>
          <div className="text-blue-600">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
    );
  };

  const Sidebar: React.FC = () => {
    const menuItems = [
      { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
      { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
      { id: 'devices', icon: <Activity size={20} />, label: 'Devices' },
      { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
    ];

    return (
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            IoT Monitor
          </h1>
          <p className="text-slate-400 text-sm mt-1">Device Dashboard</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi size={16} className="text-green-400" />
            <span className="text-sm font-medium">Connection Status</span>
          </div>
          <div className="text-xs text-slate-400">
            {deviceStatus.isOnline ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Device Dashboard</h2>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        {/* Device Control */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Device Control</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              deviceStatus.isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {deviceStatus.isOnline ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span>{deviceStatus.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDevice}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                deviceStatus.isPoweredOn
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                  : 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'
              }`}
            >
              <Power size={20} />
              <span>{deviceStatus.isPoweredOn ? 'Turn OFF' : 'Turn ON'}</span>
            </button>
            
            <div className="text-sm text-gray-600">
              Last seen: {deviceStatus.lastSeen}
            </div>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Temperature"
            value={`${sensorData[sensorData.length - 1]?.temperature.toFixed(1) || '0.0'}°C`}
            icon={<Thermometer size={24} />}
            status={sensorData[sensorData.length - 1]?.temperature > 30 ? 'warning' : 'good'}
          />
          <StatusCard
            title="Humidity"
            value={`${sensorData[sensorData.length - 1]?.humidity.toFixed(1) || '0.0'}%`}
            icon={<Droplets size={24} />}
          />
          <StatusCard
            title="Power Usage"
            value={`${sensorData[sensorData.length - 1]?.power.toFixed(1) || '0.0'}W`}
            icon={<Zap size={24} />}
          />
          <StatusCard
            title="Signal Strength"
            value={`${deviceStatus.signalStrength}%`}
            icon={<Wifi size={24} />}
            status={deviceStatus.signalStrength < 50 ? 'warning' : 'good'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature & Humidity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Sensors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Power Usage Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Power Consumption</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#powerGradient)"
                  name="Power (W)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Status Summary */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${deviceStatus.isPoweredOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">Power Status: </span>
              <span className="font-medium">{deviceStatus.isPoweredOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Battery: </span>
              <span className="font-medium">{deviceStatus.batteryLevel}%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${deviceStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">Connection: </span>
              <span className="font-medium">{deviceStatus.isOnline ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;