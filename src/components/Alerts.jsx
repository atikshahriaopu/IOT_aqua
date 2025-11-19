import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Volume2,
} from "lucide-react";
import { database } from "../firebase/config";
import { ref, onValue, set } from "firebase/database";

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Listen to alerts from Firebase
    const alertsRef = ref(database, "aquarium/alerts");

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const alerts = [];
        let id = 1;

        if (data.temperature) {
          alerts.push({
            id: id++,
            type: "error",
            title: "Temperature Alert",
            message: data.temperature,
            timestamp: "Now",
            active: true,
          });
          setBuzzerActive(true);
        }

        setActiveAlerts(alerts);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResetAlert = (alertId) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, active: false } : alert
      )
    );
    // Clear alert in Firebase
    set(ref(database, "aquarium/alerts/temperature"), "");
  };

  const handleStopBuzzer = async () => {
    setBuzzerActive(false);
    try {
      // Send command to ESP32 to stop buzzer
      await set(ref(database, "aquarium/commands/stopBuzzer"), true);
      console.log("Buzzer stop command sent");
    } catch (error) {
      console.error("Error stopping buzzer:", error);
    }
  };

  const handleClearAll = () => {
    setActiveAlerts((prev) =>
      prev.map((alert) => ({ ...alert, active: false }))
    );
    // Clear all alerts in Firebase
    set(ref(database, "aquarium/alerts/temperature"), "");
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
    <div className="p-4 pb-24 lg:pb-12 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-4xl">🔔</div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Alerts & Notifications
            </h1>
            <p className="font-medium text-gray-500 text-sm mt-1">Real-time system monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Buzzer Control */}
            {buzzerActive && (
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl p-7 text-white animate-pulse">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <Volume2 className="mr-4 animate-bounce" size={32} />
                    <div>
                      <h2 className="text-2xl font-bold drop-shadow-lg">
                        🔊 Buzzer Active
                      </h2>
                      <p className="text-sm opacity-95 font-medium mt-1">
                        Critical alert - Immediate attention required!
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleStopBuzzer}
                  className="w-full bg-white text-red-600 py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105 text-lg uppercase tracking-wider"
                  aria-label="Stop buzzer and reset alert"
                >
                  🔇 Stop Buzzer & Reset
                </button>
              </div>
            )}

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-md p-7 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-ocean-100 rounded-xl mr-4">
                    <Bell className="text-ocean-600" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Push Notifications
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Receive real-time alerts on your device
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-16 h-9 rounded-full transition-all duration-300 shadow-sm ${
                    notifications
                      ? "bg-gradient-to-r from-seaweed-500 to-green-500 hover:from-seaweed-600 hover:to-green-600"
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
                className="w-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 py-4 px-6 rounded-xl font-bold hover:from-red-200 hover:to-orange-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-lg uppercase tracking-wider"
                aria-label="Clear all active alerts"
              >
                ✖️ Clear All Active Alerts
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
                  className={`rounded-2xl shadow-md p-6 border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getAlertStyle(
                    alert.type,
                    alert.active
                  )}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start flex-1">
                      <div className="mr-4 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    {alert.active && (
                      <button
                        onClick={() => handleResetAlert(alert.id)}
                        className="ml-4 text-xs bg-white text-gray-700 px-5 py-2.5 rounded-full border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105"
                        aria-label={`Dismiss ${alert.title}`}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {activeAlerts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-green-200 shadow-md">
                  <CheckCircle
                    className="text-seaweed-500 mx-auto mb-4"
                    size={64}
                  />
                  <p className="text-gray-900 font-bold text-2xl">✅ All Clear!</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    No active alerts - Your aquarium is healthy
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 pb-4">
            {/* Active Alerts Summary */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              <div
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center border-2 border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label="Critical alerts count"
              >
                <div className="text-5xl font-bold text-red-600 mb-3">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "error")
                      .length
                  }
                </div>
                <div className="text-xs text-red-700 font-bold uppercase tracking-wider">
                  🔴 Critical
                </div>
              </div>
              <div
                className="bg-gradient-to-br from-coral-50 to-orange-100 rounded-2xl p-6 text-center border-2 border-coral-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label="Warning alerts count"
              >
                <div className="text-5xl font-bold text-coral-600 mb-3">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "warning")
                      .length
                  }
                </div>
                <div className="text-xs text-coral-700 font-bold uppercase tracking-wider">
                  🟠 Warnings
                </div>
              </div>
              <div
                className="bg-gradient-to-br from-aqua-50 to-ocean-100 rounded-2xl p-6 text-center border-2 border-aqua-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label="Info alerts count"
              >
                <div className="text-5xl font-bold text-aqua-600 mb-3">
                  {
                    activeAlerts.filter((a) => a.active && a.type === "info")
                      .length
                  }
                </div>
                <div className="text-xs text-aqua-700 font-bold uppercase tracking-wider">
                  🔵 Info
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            <div className="bg-white rounded-2xl shadow-md p-7 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-gray-900 mb-5 text-lg">
                ⚙️ Alert Thresholds
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-900 font-bold mb-3 block">
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

                <button className="w-full bg-gradient-to-r from-aqua-500 to-ocean-500 text-white py-4 px-6 rounded-xl font-bold hover:from-aqua-600 hover:to-ocean-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 text-sm uppercase tracking-wider">
                  💾 Save Settings
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
