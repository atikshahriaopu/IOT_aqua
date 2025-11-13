import { useEffect, useState } from "react";
import { Thermometer, Calendar, AlertTriangle } from "lucide-react";
import { database } from "../firebase/config";
import { ref, onValue } from "firebase/database";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    waterTemp: "--",
    waterQuality: "Good",
    lastFed: "--",
    nextFeeding: "--",
    lightStatus: "OFF",
    timestamp: new Date().toLocaleString(),
  });

  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Listen to real-time sensor data from Firebase
    const sensorRef = ref(database, "aquarium/sensors");
    const devicesRef = ref(database, "aquarium/devices");
    const alertsRef = ref(database, "aquarium/alerts");

    // Subscribe to sensor updates
    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData((prev) => ({
          ...prev,
          waterTemp: data.temperature ? data.temperature.toFixed(1) : "--",
          timestamp: data.timestamp
            ? new Date(data.timestamp * 1000).toLocaleString()
            : new Date().toLocaleString(),
        }));
        setIsConnected(true);
      }
    });

    // Subscribe to device status
    const unsubscribeDevices = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Update light status
        if (data.lights) {
          setSensorData((prev) => ({
            ...prev,
            lightStatus: data.lights.status || "OFF",
          }));
        }

        // Update feeding info
        if (data.feeder) {
          const lastFed = data.feeder.lastFed;
          const interval = data.feeder.interval || 6;

          if (lastFed) {
            const lastFedDate = new Date(lastFed * 1000);
            const now = new Date();
            const diffMs = now - lastFedDate;
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor(
              (diffMs % (1000 * 60 * 60)) / (1000 * 60)
            );

            const nextFeedMs = lastFed * 1000 + interval * 60 * 60 * 1000;
            const nextFeedDate = new Date(nextFeedMs);
            const timeToNext = nextFeedDate - now;
            const hoursToNext = Math.floor(timeToNext / (1000 * 60 * 60));
            const minsToNext = Math.floor(
              (timeToNext % (1000 * 60 * 60)) / (1000 * 60)
            );

            setSensorData((prev) => ({
              ...prev,
              lastFed:
                diffHrs > 0
                  ? `${diffHrs}h ${diffMins}m ago`
                  : `${diffMins}m ago`,
              nextFeeding:
                timeToNext > 0
                  ? `In ${hoursToNext}h ${minsToNext}m`
                  : "Due now",
            }));
          }
        }
      }
    });

    // Subscribe to alerts
    const unsubscribeAlerts = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const alertMessages = [];

        if (data.temperature) {
          alertMessages.push(data.temperature);
        }

        setAlerts(alertMessages);
      }
    });

    return () => {
      unsubscribeSensor();
      unsubscribeDevices();
      unsubscribeAlerts();
    };
  }, []);

  const getTempStatus = (temp) => {
    if (temp < 24)
      return {
        status: "Cold",
        color: "text-aqua-600 bg-aqua-50 font-semibold",
      };
    if (temp > 28)
      return {
        status: "Hot",
        color: "text-coral-600 bg-coral-50 font-semibold",
      };
    return {
      status: "Optimal",
      color: "text-seaweed-600 bg-seaweed-50 font-semibold",
    };
  };

  const tempStatus = getTempStatus(parseFloat(sensorData.waterTemp));

  return (
    <div className="p-4 pb-20 lg:pb-8 bg-transparent min-h-screen lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            Last updated: {sensorData.timestamp}
          </p>
        </div>

        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-start">
              <AlertTriangle
                className="text-red-500 mr-3 flex-shrink-0 animate-pulse"
                size={24}
              />
              <div className="flex-1">
                <p className="text-red-800 font-bold text-base mb-1">
                  Attention Required!
                </p>
                <p className="text-red-700 text-sm">{alerts[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-5 mb-6">
          {/* Water Temperature */}
          <div
            className="bg-white rounded-xl shadow-md p-5 lg:p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group focus-aqua"
            tabIndex={0}
            role="button"
            aria-label="Water temperature status"
            data-tooltip="Current water temperature"
          >
            <div className="flex items-center justify-between mb-3">
              <Thermometer
                className="text-aqua-500 group-hover:text-aqua-600 transition-colors"
                size={24}
              />
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tempStatus.color}`}
              >
                {tempStatus.status}
              </span>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
              {sensorData.waterTemp}°C
            </div>
            <div className="text-sm text-gray-600 font-medium">Water Temp</div>
          </div>

          {/* Light Status */}
          <div
            className="bg-white rounded-xl shadow-md p-5 lg:p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group focus-aqua"
            tabIndex={0}
            role="button"
            aria-label="Lighting system status"
            data-tooltip="RGB LED lights control"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-coral-400 to-coral-600 group-hover:shadow-lg transition-shadow"></div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  sensorData.lightStatus === "ON"
                    ? "bg-seaweed-50 text-seaweed-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {sensorData.lightStatus}
              </span>
            </div>
            <div className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
              RGB Lights
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Lighting System
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Feeding Schedule Card */}
          <div
            className="bg-gradient-to-br from-aqua-500 via-ocean-500 to-ocean-600 rounded-xl shadow-lg hover:shadow-xl p-6 lg:p-7 text-white transition-all duration-300 hover:scale-105 cursor-pointer group focus-ocean"
            tabIndex={0}
            role="button"
            aria-label="Feeding schedule information"
          >
            <div className="flex items-center mb-4">
              <Calendar
                className="mr-3 group-hover:scale-110 transition-transform"
                size={28}
              />
              <h2 className="text-xl font-bold drop-shadow-sm">
                Feeding Schedule
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-colors">
                <p className="text-xs font-medium opacity-90 mb-1.5">
                  Last Fed
                </p>
                <p className="text-xl font-bold drop-shadow">
                  {sensorData.lastFed}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-colors">
                <p className="text-xs font-medium opacity-90 mb-1.5">
                  Next Feeding
                </p>
                <p className="text-xl font-bold drop-shadow">
                  {sensorData.nextFeeding}
                </p>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 lg:p-7 border border-gray-100 transition-all duration-300">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <StatusRow
                label="ESP32 Connection"
                status={isConnected ? "Connected" : "Disconnected"}
                isGood={isConnected}
              />
              <StatusRow
                label="Firebase Sync"
                status={isConnected ? "Active" : "Waiting"}
                isGood={isConnected}
              />
              <StatusRow label="Auto Mode" status="Enabled" isGood={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({ label, status, isGood }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors group">
    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${
            isGood ? "bg-seaweed-500" : "bg-red-500"
          }`}
        ></div>
        {isGood && (
          <div
            className={`absolute inset-0 w-3 h-3 rounded-full bg-seaweed-500 animate-pulse-slow`}
          ></div>
        )}
      </div>
      <span
        className={`text-sm font-bold ${
          isGood ? "text-seaweed-600" : "text-red-600"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
