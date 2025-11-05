import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config";
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
        return <XCircle className="text-red-500" size={24} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={24} />;
      case "success":
        return <CheckCircle className="text-green-500" size={24} />;
      default:
        return <Bell className="text-blue-500" size={24} />;
    }
  };

  const getAlertStyle = (type, active) => {
    if (!active) return "bg-gray-50 border-gray-200 opacity-60";

    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Alerts & Notifications
      </h1>

      {/* Buzzer Control */}
      {buzzerActive && (
        <div className="bg-red-500 rounded-xl shadow-lg p-5 mb-4 text-white animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Volume2 className="mr-3" size={24} />
              <div>
                <h2 className="text-lg font-bold">Buzzer Active</h2>
                <p className="text-xs opacity-90">
                  Critical water quality alert
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleStopBuzzer}
            className="w-full bg-white text-red-600 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            🔇 Stop Buzzer & Reset
          </button>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="text-gray-600 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-gray-800">
                Push Notifications
              </h3>
              <p className="text-xs text-gray-500">Get alerts on your device</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-14 h-8 rounded-full transition-all ${
              notifications ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                notifications ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Active Alerts Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-2xl font-bold text-red-500">
            {activeAlerts.filter((a) => a.active && a.type === "error").length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Critical</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-2xl font-bold text-yellow-500">
            {
              activeAlerts.filter((a) => a.active && a.type === "warning")
                .length
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">Warnings</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
          <div className="text-2xl font-bold text-blue-500">
            {activeAlerts.filter((a) => a.active && a.type === "info").length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Info</div>
        </div>
      </div>

      {/* Clear All Button */}
      {activeAlerts.some((a) => a.active) && (
        <button
          onClick={handleClearAll}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium mb-4 hover:bg-gray-200 transition-all"
        >
          Clear All Active Alerts
        </button>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Recent Alerts
        </h2>

        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl shadow-sm p-4 border ${getAlertStyle(
              alert.type,
              alert.active
            )} transition-all`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start flex-1">
                <div className="mr-3 mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
              {alert.active && (
                <button
                  onClick={() => handleResetAlert(alert.id)}
                  className="ml-2 text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))}

        {activeAlerts.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            <p className="text-gray-500 font-medium">All Clear!</p>
            <p className="text-xs text-gray-400 mt-1">No active alerts</p>
          </div>
        )}
      </div>

      {/* Alert Settings */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Alert Thresholds</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium mb-2 block">
              Temperature Range (°C)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                defaultValue="24"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue="28"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium mb-2 block">
              Turbidity Threshold (NTU)
            </label>
            <input
              type="number"
              placeholder="Max turbidity"
              defaultValue="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-all">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
