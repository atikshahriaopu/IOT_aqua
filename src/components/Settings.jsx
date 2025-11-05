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
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      {/* User Profile */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-5 mb-4 text-white">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Aquarium Owner</h2>
            <p className="text-sm opacity-90">owner@aquarium.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-white/20 backdrop-blur-sm text-white py-2 rounded-lg font-medium hover:bg-white/30 transition-all flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <Wifi className="text-blue-500 mr-3" size={20} />
          <h3 className="font-semibold text-gray-800">Connection Status</h3>
        </div>

        <div className="space-y-3">
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
          className="w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-all"
        >
          Test Connection
        </button>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <Clock className="text-purple-500 mr-3" size={20} />
          <h3 className="font-semibold text-gray-800">Automation Schedules</h3>
        </div>

        {/* Light Schedule */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            💡 Light Schedule (Day/Night Cycle)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Start Time
              </label>
              <input
                type="time"
                value={schedules.lightStart}
                onChange={(e) =>
                  setSchedules({ ...schedules, lightStart: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                End Time
              </label>
              <input
                type="time"
                value={schedules.lightEnd}
                onChange={(e) =>
                  setSchedules({ ...schedules, lightEnd: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Pump Schedule */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            💨 Pump Operation Schedule
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Duration (min)
              </label>
              <input
                type="number"
                value={schedules.pumpDuration}
                onChange={(e) =>
                  setSchedules({ ...schedules, pumpDuration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Interval (min)
              </label>
              <input
                type="number"
                value={schedules.pumpInterval}
                onChange={(e) =>
                  setSchedules({ ...schedules, pumpInterval: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pump will run for {schedules.pumpDuration} minutes every{" "}
            {schedules.pumpInterval} minutes
          </p>
        </div>

        <button
          onClick={handleSaveSchedules}
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all active:scale-95"
        >
          Save Schedules
        </button>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <Database className="text-green-500 mr-3" size={20} />
          <h3 className="font-semibold text-gray-800">System Information</h3>
        </div>

        <div className="space-y-2 text-sm">
          <InfoRow label="App Version" value="1.0.0" />
          <InfoRow label="Device ID" value="AQ-ESP32-001" />
          <InfoRow label="Firmware" value="v2.3.1" />
          <InfoRow label="Last Update" value="2 days ago" />
          <InfoRow label="Data Points" value="1,247" />
        </div>
      </div>

      {/* Device Controls */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Device Management</h3>

        <div className="space-y-3">
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
            🔄 Restart ESP32
          </button>
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
            📊 View Logs
          </button>
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
            🔧 Calibrate Sensors
          </button>
          <button className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-all">
            ⚠️ Factory Reset
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-sm p-5 text-white text-center">
        <h3 className="font-bold text-lg mb-2">🐠 Smart Aquarium System</h3>
        <p className="text-sm opacity-80 mb-3">
          IoT-Based Automated Aquarium Management
        </p>
        <p className="text-xs opacity-60">
          Powered by ESP32 & Firebase
          <br />© 2025 All Rights Reserved
        </p>
      </div>
    </div>
  );
};

const ConnectionRow = ({ label, status, info }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500">{info}</p>
    </div>
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          status ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span
        className={`text-xs font-semibold ${
          status ? "text-green-600" : "text-red-600"
        }`}
      >
        {status ? "Connected" : "Disconnected"}
      </span>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default Settings;
