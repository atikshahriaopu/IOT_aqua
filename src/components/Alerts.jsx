import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config.js";
import { onValue } from "firebase/database";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Volume2,
} from "lucide-react";

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "Water Quality Alert",
      message: "Turbidity level is moderate. Consider checking the filter.",
      timestamp: "5 minutes ago",
      active: true,
    },
    {
      id: 2,
      type: "info",
      title: "Feeding Completed",
      message: "Automatic feeding was successful at 2:00 PM",
      timestamp: "2 hours ago",
      active: false,
    },
  ]);

  const [buzzerActive, setBuzzerActive] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleResetAlert = (alertId) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, active: false } : alert
      )
    );
    // Send reset command to Firebase
    console.log("Alert reset:", alertId);
  };

  const handleStopBuzzer = () => {
    setBuzzerActive(false);
    // Send command to ESP32 to stop buzzer
    console.log("Buzzer stopped");
  };

  const handleClearAll = () => {
    setActiveAlerts((prev) =>
      prev.map((alert) => ({ ...alert, active: false }))
    );
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return <XCircle className="text-red-500" size={28} />;
      case "warning":
        return <AlertTriangle className="text-coral-500" size={28} />;
      case "success":
        return <CheckCircle className="text-seaweed-500" size={28} />;
      default:
        return <Bell className="text-aqua-500" size={28} />;
    }
  };

  const getAlertStyle = (type, active) => {
    if (!active) return "bg-gray-50 border-gray-200 opacity-60";

    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 border-2";
      case "warning":
        return "bg-coral-50 border-coral-200 border-2";
      case "success":
        return "bg-seaweed-50 border-seaweed-200 border-2";
      default:
        return "bg-aqua-50 border-aqua-200 border-2";
    }
  };

  return (
    <div className="p-4 pb-24 lg:pb-12 bg-transparent min-h-screen lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-7 tracking-tight">
          Alerts & Notifications
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Buzzer Control */}
            {buzzerActive && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-xl p-6 text-white animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Volume2 className="mr-3 animate-pulse" size={28} />
                    <div>
                      <h2 className="text-xl font-bold drop-shadow-sm">
                        Buzzer Active
                      </h2>
                      <p className="text-sm opacity-90 font-medium">
                        Critical water quality alert
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleStopBuzzer}
                  className="w-full bg-white text-red-600 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105 focus-aqua"
                  aria-label="Stop buzzer and reset alert"
                >
                  🔇 Stop Buzzer & Reset
                </button>
              </div>
            )}

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="text-ocean-600 mr-3" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">
                      Push Notifications
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      Get alerts on your device
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-16 h-9 rounded-full transition-all duration-300 focus-aqua shadow-sm ${
                    notifications
                      ? "bg-seaweed-500 hover:bg-seaweed-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={
                    notifications
                      ? "Disable notifications"
                      : "Enable notifications"
                  }
                >
                  <div
                    className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      notifications ? "translate-x-8" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Clear All Button */}
            {activeAlerts.some((a) => a.active) && (
              <button
                onClick={handleClearAll}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus-aqua"
                aria-label="Clear all active alerts"
              >
                Clear All Active Alerts
              </button>
            )}

            {/* Alerts List */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Recent Alerts
              </h2>

              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl shadow-md p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getAlertStyle(
                    alert.type,
                    alert.active
                  )}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start flex-1">
                      <div className="mr-4 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-base mb-2">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    {alert.active && (
                      <button
                        onClick={() => handleResetAlert(alert.id)}
                        className="ml-3 text-xs bg-white text-gray-700 px-4 py-2 rounded-full border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold focus-aqua hover:scale-105"
                        aria-label={`Dismiss ${alert.title}`}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {activeAlerts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-100 shadow-md">
                  <CheckCircle
                    className="text-seaweed-500 mx-auto mb-4"
                    size={56}
                  />
                  <p className="text-gray-700 font-bold text-lg">All Clear!</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    No active alerts
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 pb-4">
            {/* Active Alerts Summary */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              <div
                className="bg-white rounded-xl p-5 text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer focus-aqua"
                tabIndex={0}
                role="button"
                aria-label="Critical alerts count"
              >
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "error")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Critical
                </div>
              </div>
              <div
                className="bg-white rounded-xl p-5 text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer focus-aqua"
                tabIndex={0}
                role="button"
                aria-label="Warning alerts count"
              >
                <div className="text-4xl font-bold text-coral-500 mb-2">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "warning")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Warnings
                </div>
              </div>
              <div
                className="bg-white rounded-xl p-5 text-center border-2 border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer focus-aqua"
                tabIndex={0}
                role="button"
                aria-label="Info alerts count"
              >
                <div className="text-4xl font-bold text-aqua-500 mb-2">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "info")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Info
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-gray-800 mb-5 text-lg">
                Alert Thresholds
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-700 font-bold mb-3 block">
                    Temperature Range (°C)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      defaultValue="24"
                      className="flex-1 min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Minimum temperature threshold"
                    />
                    <span className="text-gray-500 text-sm font-bold">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      defaultValue="28"
                      className="flex-1 min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                      aria-label="Maximum temperature threshold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-bold mb-3 block">
                    Turbidity Threshold (NTU)
                  </label>
                  <input
                    type="number"
                    placeholder="Max turbidity"
                    defaultValue="30"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 hover:border-gray-400 transition-all shadow-sm"
                    aria-label="Maximum turbidity threshold"
                  />
                </div>

                <button className="w-full bg-gradient-to-r from-aqua-500 to-ocean-500 text-white py-4 rounded-xl font-bold hover:from-aqua-600 hover:to-ocean-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 focus-aqua">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
