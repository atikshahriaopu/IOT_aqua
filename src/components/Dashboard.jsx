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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-8 pb-20 lg:pb-8 min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">🐠</div>
            <div>
              <h1 className="font-bold text-gray-900 text-4xl lg:text-5xl tracking-tight bg-gradient-to-r from-aqua-600 to-ocean-600 bg-clip-text text-transparent">
                Aquarium Dashboard
              </h1>
              <p className="font-medium text-gray-500 text-sm mt-1">
                Real-time monitoring system
              </p>
            </div>
          </div>
          <p className="font-medium text-gray-600 text-xs mt-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-seaweed-500 rounded-full animate-pulse"></span>
            Last updated: {sensorData.timestamp}
          </p>
        </div>

        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg hover:shadow-xl mb-6 p-5 border border-red-400 rounded-2xl transition-all duration-300 text-white">
            <div className="flex items-start">
              <AlertTriangle
                className="flex-shrink-0 mr-4 animate-pulse"
                size={28}
              />
              <div className="flex-1">
                <p className="mb-1 font-bold text-lg">
                  ⚠️ Attention Required!
                </p>
                <p className="text-red-50 text-sm font-medium">{alerts[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Status Cards */}
        <div className="gap-5 lg:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 mb-8">
          {/* Water Temperature */}
          <div
            className="group relative bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-2xl p-6 lg:p-7 border border-blue-200 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            tabIndex={0}
            role="button"
            aria-label="Water temperature status"
          >
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-aqua-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-aqua-100 to-ocean-100 rounded-xl">
                    <Thermometer
                      className="text-aqua-600 group-hover:scale-110 transition-transform"
                      size={28}
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-semibold">Temperature</p>
                    <p className="text-gray-400 text-xs">Current</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${tempStatus.color} shadow-sm`}
                >
                  {tempStatus.status}
                </span>
              </div>
              <div className="mb-2 font-bold text-gray-900 text-5xl">
                {sensorData.waterTemp}°
              </div>
              <div className="font-medium text-gray-500 text-sm">Celsius</div>
            </div>
          </div>
        </div>

        <div className="gap-5 lg:gap-6 grid grid-cols-1 lg:grid-cols-2">
          {/* Feeding Schedule Card */}
          <div
            className="group relative bg-gradient-to-br from-orange-400 via-coral-500 to-red-500 shadow-lg hover:shadow-2xl p-7 lg:p-8 rounded-2xl text-white hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            tabIndex={0}
            role="button"
            aria-label="Feeding schedule information"
          >
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white opacity-5 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                  <Calendar
                    className="mr-0 group-hover:scale-110 transition-transform"
                    size={32}
                  />
                </div>
                <h2 className="drop-shadow-lg font-bold text-2xl">
                  Feeding Schedule
                </h2>
              </div>
              <div className="gap-4 grid grid-cols-2">
                <div className="bg-white/15 hover:bg-white/25 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 border border-white/20">
                  <p className="opacity-90 mb-2 font-semibold text-xs uppercase tracking-wider">
                    Last Fed
                  </p>
                  <p className="drop-shadow font-bold text-lg">
                    {sensorData.lastFed}
                  </p>
                </div>
                <div className="bg-white/15 hover:bg-white/25 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 border border-white/20">
                  <p className="opacity-90 mb-2 font-semibold text-xs uppercase tracking-wider">
                    Next Feeding
                  </p>
                  <p className="drop-shadow font-bold text-lg">
                    {sensorData.nextFeeding}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white shadow-md hover:shadow-lg p-7 lg:p-8 border border-gray-200 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-bold text-gray-900 text-xl">
                System Status
              </h3>
            </div>
            <div className="space-y-4">
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
  <div className="group flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-3 py-4 border-b border-gray-100 last:border-0 rounded-lg transition-all duration-300">
    <span className="font-semibold text-gray-700 group-hover:text-gray-900 text-sm">
      {label}
    </span>
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${isGood ? "bg-seaweed-500" : "bg-red-500"
            }`}
        ></div>
        {isGood && (
          <div
            className={`absolute inset-0 w-3 h-3 rounded-full bg-seaweed-500 animate-pulse-slow`}
          ></div>
        )}
      </div>
      <span
        className={`text-sm font-semibold ${isGood ? "text-seaweed-600" : "text-red-600"
          }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
