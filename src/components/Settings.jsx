import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config.js";
import { onValue } from "firebase/database";
import {
  Settings as SettingsIcon,
  Clock,
  Wifi,
  Database,
  User,
  LogOut,
} from "lucide-react";

const Settings = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    esp32: true,
    firebase: true,
    internet: true,
  });

  const [schedules, setSchedules] = useState({
    pumpDuration: 10,
    pumpInterval: 60,
  });

  const handleLogout = () => {
    // Handle Firebase logout
    console.log("Logging out...");
    alert("Logged out successfully");
  };

  const handleSaveSchedules = () => {
    // Save to Firebase
    console.log("Schedules saved:", schedules);
    alert("✅ Schedules saved successfully!");
  };

  const handleTestConnection = () => {
    // Test ESP32 connection
    console.log("Testing connection...");
    alert("Testing ESP32 connection...");
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-8 pb-20 lg:pb-8 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-4xl">⚙️</div>
          <div>
            <h1 className="font-bold text-gray-900 text-4xl lg:text-5xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="font-medium text-gray-500 text-sm mt-1">Manage your system preferences</p>
          </div>
        </div>

        <div className="gap-6 lg:gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* User Profile */}
          <div className="lg:col-span-2 bg-gradient-to-br from-aqua-500 via-ocean-500 to-ocean-600 shadow-2xl hover:shadow-3xl p-7 lg:p-8 rounded-2xl text-white hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="flex justify-center items-center bg-white/20 shadow-lg backdrop-blur-sm mr-5 rounded-full w-24 h-24 text-4xl">
                👤
              </div>
              <div className="flex-1">
                <h2 className="drop-shadow-lg font-bold text-3xl">
                  Aquarium Owner
                </h2>
                <p className="opacity-95 drop-shadow font-medium text-sm mt-1">
                  owner@aquarium.com
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center bg-white/25 hover:bg-white/35 shadow-md hover:shadow-lg backdrop-blur-sm px-6 py-3 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
                aria-label="Log out of account"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="lg:hidden flex justify-center items-center bg-white/25 hover:bg-white/35 shadow-md hover:shadow-lg backdrop-blur-sm py-3 rounded-xl w-full font-bold text-white transition-all duration-300 uppercase tracking-wider"
              aria-label="Log out of account"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>

          {/* Connection Status */}
          <div className="bg-white shadow-md hover:shadow-lg p-7 border border-gray-200 rounded-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-aqua-100 rounded-xl mr-4">
                <Wifi className="text-aqua-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Connection Status
              </h3>
            </div>

            <div className="space-y-4">
              <ConnectionRow
                label="ESP32 Device"
                status={connectionStatus.esp32}
                info="192.168.1.105"
              />
              <ConnectionRow
                label="Firebase"
                status={connectionStatus.firebase}
                info="Realtime sync active"
              />
              <ConnectionRow
                label="Internet"
                status={connectionStatus.internet}
                info="Connected"
              />
            </div>

            <button
              onClick={handleTestConnection}
              className="bg-gradient-to-r from-aqua-500 to-ocean-500 hover:from-aqua-600 hover:to-ocean-600 shadow-lg hover:shadow-xl mt-6 py-3 px-4 rounded-xl w-full font-bold text-white hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
              aria-label="Test device connection"
            >
              🔗 Test Connection
            </button>
          </div>

          {/* System Information */}
          <div className="bg-white shadow-md hover:shadow-lg p-7 border border-gray-200 rounded-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <Database className="text-seaweed-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                System Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="App Version" value="1.0.0" emoji="📦" />
              <InfoRow label="Device ID" value="AQ-ESP32-001" emoji="🔧" />
              <InfoRow label="Firmware" value="v2.3.1" emoji="💾" />
              <InfoRow label="Last Update" value="2 days ago" emoji="⏱️" />
              <InfoRow label="Data Points" value="1,247" emoji="📊" />
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="lg:col-span-2 bg-white shadow-md hover:shadow-lg p-7 border border-gray-200 rounded-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-coral-100 rounded-xl mr-4">
                <Clock className="text-coral-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Automation Schedules
              </h3>
            </div>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
              {/* Pump Schedule */}
              <div>
                <label className="block mb-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  💨 Pump Operation Schedule
                </label>
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block mb-3 font-semibold text-gray-700 text-xs">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={schedules.pumpDuration}
                      onChange={(e) =>
                        setSchedules({
                          ...schedules,
                          pumpDuration: e.target.value,
                        })
                      }
                      className="shadow-sm px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-aqua-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-aqua-500 w-full font-medium text-sm transition-all"
                      aria-label="Pump duration"
                    />
                  </div>
                  <div>
                    <label className="block mb-3 font-semibold text-gray-700 text-xs">
                      Interval (min)
                    </label>
                    <input
                      type="number"
                      value={schedules.pumpInterval}
                      onChange={(e) =>
                        setSchedules({
                          ...schedules,
                          pumpInterval: e.target.value,
                        })
                      }
                      className="shadow-sm px-4 py-3 border-2 border-gray-300 hover:border-gray-400 focus:border-aqua-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-aqua-500 w-full font-medium text-sm transition-all"
                      aria-label="Pump interval"
                    />
                  </div>
                </div>
                <p className="bg-blue-50 mt-4 p-3 rounded-xl font-medium text-gray-700 text-xs border border-blue-200">
                  💡 Pump will run for <span className="font-bold text-blue-600">{schedules.pumpDuration} min</span> every <span className="font-bold text-blue-600">{schedules.pumpInterval} min</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveSchedules}
              className="bg-gradient-to-r from-coral-500 hover:from-coral-600 via-coral-600 to-orange-500 hover:to-orange-600 shadow-lg hover:shadow-xl mt-6 py-4 px-6 rounded-xl w-full font-bold text-white hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-wider text-sm"
              aria-label="Save schedule settings"
            >
              💾 Save Schedules
            </button>
          </div>

          {/* Device Controls */}
          <div className="lg:col-span-2 bg-white shadow-md hover:shadow-lg p-7 border border-gray-200 rounded-2xl transition-all duration-300">
            <h3 className="mb-6 font-bold text-gray-900 text-lg">
              🎮 Device Management
            </h3>

            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <button
                className="bg-gradient-to-br from-blue-100 hover:from-blue-200 to-blue-200 hover:to-blue-300 shadow-md hover:shadow-lg py-4 px-4 rounded-xl font-bold text-blue-700 hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
                aria-label="Restart ESP32 device"
              >
                🔄 Restart ESP32
              </button>
              <button
                className="bg-gradient-to-br from-gray-100 hover:from-gray-200 to-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg py-4 px-4 rounded-xl font-bold text-gray-700 hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
                aria-label="View system logs"
              >
                📊 View Logs
              </button>
              <button
                className="bg-gradient-to-br from-green-100 hover:from-green-200 to-green-200 hover:to-green-300 shadow-md hover:shadow-lg py-4 px-4 rounded-xl font-bold text-green-700 hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
                aria-label="Calibrate sensors"
              >
                🔧 Calibrate
              </button>
              <button
                className="bg-gradient-to-br from-red-100 hover:from-red-200 to-red-200 hover:to-red-300 shadow-md hover:shadow-lg py-4 px-4 border-2 border-red-300 rounded-xl font-bold text-red-700 hover:scale-105 transition-all duration-300 uppercase tracking-wider text-sm"
                aria-label="Factory reset device"
              >
                ⚠️ Reset
              </button>
            </div>
          </div>

          {/* About */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl hover:shadow-3xl p-8 rounded-2xl text-white text-center transition-all duration-300">
            <h3 className="drop-shadow-lg mb-4 font-black text-3xl">
              🐠 Smart Aquarium System
            </h3>
            <p className="opacity-95 drop-shadow mb-4 font-medium text-base">
              IoT-Based Automated Aquarium Management Platform
            </p>
            <p className="opacity-80 text-sm font-medium">
              Powered by <span className="font-bold">ESP32</span> & <span className="font-bold">Firebase</span>
              <br />© 2025 All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectionRow = ({ label, status, info }) => (
  <div className="flex justify-between items-center hover:bg-blue-50 px-3 py-3.5 border-gray-100 last:border-0 border-b rounded-lg transition-all duration-300">
    <div>
      <p className="font-bold text-gray-900 text-sm">{label}</p>
      <p className="font-medium text-gray-500 text-xs mt-1">{info}</p>
    </div>
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${status ? "bg-seaweed-500" : "bg-red-500"
            }`}
        ></div>
        {status && (
          <div className="absolute inset-0 bg-seaweed-500 rounded-full w-3 h-3 animate-pulse-slow"></div>
        )}
      </div>
      <span
        className={`text-xs font-bold ${status ? "text-seaweed-600" : "text-red-600"
          }`}
      >
        {status ? "✓ Connected" : "✗ Offline"}
      </span>
    </div>
  </div>
);

const InfoRow = ({ label, value, emoji }) => (
  <div className="flex justify-between items-center hover:bg-blue-50 px-3 py-3.5 border-gray-100 last:border-0 border-b rounded-lg transition-all duration-300">
    <span className="font-medium text-gray-700">{emoji} {label}</span>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

export default Settings;
