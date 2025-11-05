import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config";
import { onValue } from "firebase/database";
import {
  Droplets,
  Thermometer,
  Activity,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const Dashboard = () => {
  // Mock data - replace with Firebase real-time data
  const [sensorData, setSensorData] = useState({
    waterTemp: 26.5,
    waterQuality: "Good",
    turbidityValue: 15,
    lastFed: "2 hours ago",
    nextFeeding: "In 4 hours",
    lightStatus: "ON",
    pumpStatus: "ON",
    timestamp: new Date().toLocaleString(),
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        ...prev,
        waterTemp: (26 + Math.random() * 2).toFixed(1),
        turbidityValue: Math.floor(10 + Math.random() * 20),
        timestamp: new Date().toLocaleString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Good":
        return "text-green-500 bg-green-50";
      case "Moderate":
        return "text-yellow-500 bg-yellow-50";
      case "Bad":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getTempStatus = (temp) => {
    if (temp < 24) return { status: "Cold", color: "text-blue-500" };
    if (temp > 28) return { status: "Hot", color: "text-red-500" };
    return { status: "Optimal", color: "text-green-500" };
  };

  const tempStatus = getTempStatus(parseFloat(sensorData.waterTemp));

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          🐠 Smart Aquarium
        </h1>
        <p className="text-sm text-gray-500">
          Last updated: {sensorData.timestamp}
        </p>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle
              className="text-red-500 mr-3 flex-shrink-0"
              size={20}
            />
            <div>
              <p className="text-red-800 font-semibold text-sm">
                Attention Required!
              </p>
              <p className="text-red-700 text-xs mt-1">{alerts[0]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Water Temperature */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="text-blue-500" size={20} />
            <span className={`text-xs font-medium ${tempStatus.color}`}>
              {tempStatus.status}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {sensorData.waterTemp}°C
          </div>
          <div className="text-xs text-gray-500 mt-1">Water Temp</div>
        </div>

        {/* Water Quality */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="text-cyan-500" size={20} />
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getQualityColor(
                sensorData.waterQuality
              )}`}
            >
              {sensorData.waterQuality}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {sensorData.turbidityValue}
          </div>
          <div className="text-xs text-gray-500 mt-1">Turbidity (NTU)</div>
        </div>

        {/* Light Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                sensorData.lightStatus === "ON"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {sensorData.lightStatus}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-800">RGB Lights</div>
          <div className="text-xs text-gray-500 mt-1">Lighting System</div>
        </div>

        {/* Pump Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-indigo-500" size={20} />
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                sensorData.pumpStatus === "ON"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {sensorData.pumpStatus}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-800">Air Pump</div>
          <div className="text-xs text-gray-500 mt-1">Oxygenation</div>
        </div>
      </div>

      {/* Feeding Schedule Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-5 mb-4 text-white">
        <div className="flex items-center mb-3">
          <Calendar className="mr-2" size={24} />
          <h2 className="text-lg font-bold">Feeding Schedule</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-90 mb-1">Last Fed</p>
            <p className="text-lg font-semibold">{sensorData.lastFed}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Next Feeding</p>
            <p className="text-lg font-semibold">{sensorData.nextFeeding}</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">System Status</h3>
        <div className="space-y-2">
          <StatusRow
            label="ESP32 Connection"
            status="Connected"
            isGood={true}
          />
          <StatusRow label="Firebase Sync" status="Active" isGood={true} />
          <StatusRow label="Auto Mode" status="Enabled" isGood={true} />
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, status, isGood }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          isGood ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span
        className={`text-sm font-medium ${
          isGood ? "text-green-600" : "text-red-600"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
