import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config";
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
    lightStart: "06:00",
    lightEnd: "20:00",
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
    <div className="p-4 pb-20 lg:pb-8 bg-transparent min-h-screen lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-7 tracking-tight">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* User Profile */}
          <div className="bg-gradient-to-br from-aqua-500 via-ocean-500 to-ocean-600 rounded-xl shadow-xl hover:shadow-2xl p-6 lg:p-7 text-white lg:col-span-2 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm shadow-lg">
                <User size={40} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold drop-shadow-sm">
                  Aquarium Owner
                </h2>
                <p className="text-sm opacity-90 font-medium drop-shadow-sm">
                  owner@aquarium.com
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:flex bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 items-center shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
                aria-label="Log out of account"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="lg:hidden w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg focus-aqua"
              aria-label="Log out of account"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>

          {/* Connection Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-5">
              <Wifi className="text-aqua-500 mr-3" size={24} />
              <h3 className="font-bold text-gray-800 text-lg">
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
              className="w-full mt-5 bg-gradient-to-r from-aqua-50 to-ocean-50 text-aqua-700 py-3 rounded-xl font-bold hover:from-aqua-100 hover:to-ocean-100 transition-all duration-300 border-2 border-aqua-200 shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
              aria-label="Test device connection"
            >
              Test Connection
            </button>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-5">
              <Database className="text-seaweed-500 mr-3" size={24} />
              <h3 className="font-bold text-gray-800 text-lg">
                System Information
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="App Version" value="1.0.0" />
              <InfoRow label="Device ID" value="AQ-ESP32-001" />
              <InfoRow label="Firmware" value="v2.3.1" />
              <InfoRow label="Last Update" value="2 days ago" />
              <InfoRow label="Data Points" value="1,247" />
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 lg:col-span-2">
            <div className="flex items-center mb-5">
              <Clock className="text-coral-500 mr-3" size={24} />
              <h3 className="font-bold text-gray-800 text-lg">
                Automation Schedules
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Light Schedule */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  💡 Light Schedule (Day/Night Cycle)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block font-semibold">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={schedules.lightStart}
                      onChange={(e) =>
                        setSchedules({
                          ...schedules,
                          lightStart: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Light start time"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block font-semibold">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={schedules.lightEnd}
                      onChange={(e) =>
                        setSchedules({ ...schedules, lightEnd: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Light end time"
                    />
                  </div>
                </div>
              </div>

              {/* Pump Schedule */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  💨 Pump Operation Schedule
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block font-semibold">
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Pump duration"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block font-semibold">
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Pump interval"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 font-medium bg-gray-50 p-2 rounded-lg">
                  Pump will run for {schedules.pumpDuration} minutes every{" "}
                  {schedules.pumpInterval} minutes
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveSchedules}
              className="w-full mt-5 bg-gradient-to-r from-coral-500 via-coral-600 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-coral-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 focus-aqua"
              aria-label="Save schedule settings"
            >
              Save Schedules
            </button>
          </div>

          {/* Device Controls */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 lg:col-span-2">
            <h3 className="font-bold text-gray-800 mb-5 text-lg">
              Device Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
                aria-label="Restart ESP32 device"
              >
                🔄 Restart ESP32
              </button>
              <button
                className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
                aria-label="View system logs"
              >
                📊 View Logs
              </button>
              <button
                className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
                aria-label="Calibrate sensors"
              >
                🔧 Calibrate Sensors
              </button>
              <button
                className="bg-gradient-to-br from-red-50 to-red-100 text-red-600 py-4 rounded-xl font-bold hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border-2 border-red-200 focus-aqua"
                aria-label="Factory reset device"
              >
                ⚠️ Factory Reset
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl shadow-xl p-7 text-white text-center lg:col-span-2 hover:shadow-2xl transition-all duration-300">
            <h3 className="font-bold text-2xl mb-3 drop-shadow-lg">
              🐠 Smart Aquarium System
            </h3>
            <p className="text-sm opacity-90 mb-4 font-medium drop-shadow">
              IoT-Based Automated Aquarium Management
            </p>
            <p className="text-xs opacity-70">
              Powered by ESP32 & Firebase
              <br />© 2025 All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectionRow = ({ label, status, info }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
    <div>
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <p className="text-xs text-gray-600 font-medium">{info}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${
            status ? "bg-seaweed-500" : "bg-red-500"
          }`}
        ></div>
        {status && (
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-seaweed-500 animate-pulse-slow"></div>
        )}
      </div>
      <span
        className={`text-xs font-bold ${
          status ? "text-seaweed-600" : "text-red-600"
        }`}
      >
        {status ? "Connected" : "Disconnected"}
      </span>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

export default Settings;
