import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config";
import { onValue } from "firebase/database";
import { Power, Lightbulb, Wind, Coffee } from "lucide-react";

const Controls = () => {
  const [feedingMode, setFeedingMode] = useState("auto");
  const [feedInterval, setFeedInterval] = useState(6);
  const [lightMode, setLightMode] = useState("auto");
  const [lightColor, setLightColor] = useState("#4A90E2");
  const [lightBrightness, setLightBrightness] = useState(80);
  const [pumpMode, setPumpMode] = useState("auto");
  const [pumpStatus, setPumpStatus] = useState(true);

  const handleFeedNow = () => {
    // Send command to Firebase to trigger feeding
    console.log("Feeding now...");
    alert("🐠 Feeding initiated!");
  };

  const handleLightToggle = () => {
    // Send command to Firebase to toggle lights
    console.log("Light toggled");
  };

  const handlePumpToggle = () => {
    setPumpStatus(!pumpStatus);
    // Send command to Firebase
    console.log("Pump toggled:", !pumpStatus);
  };

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Device Controls</h1>

      {/* Feeding Control */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <Coffee className="text-orange-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Feeding System</h2>
            <p className="text-xs text-gray-500">Automated food dispenser</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFeedingMode("auto")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                feedingMode === "auto"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Automatic
            </button>
            <button
              onClick={() => setFeedingMode("manual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                feedingMode === "manual"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Auto Mode Settings */}
        {feedingMode === "auto" && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Feed Interval: {feedInterval} hours
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={feedInterval}
              onChange={(e) => setFeedInterval(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>24h</span>
            </div>
          </div>
        )}

        {/* Feed Now Button */}
        <button
          onClick={handleFeedNow}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          🐟 Feed Now
        </button>
      </div>

      {/* Lighting Control */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
            <Lightbulb className="text-yellow-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">RGB Lighting</h2>
            <p className="text-xs text-gray-500">LED strip control</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setLightMode("auto")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                lightMode === "auto"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Auto Day/Night
            </button>
            <button
              onClick={() => setLightMode("manual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                lightMode === "manual"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Manual Mode Settings */}
        {lightMode === "manual" && (
          <>
            {/* Color Picker */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      "#FF0000",
                      "#00FF00",
                      "#0000FF",
                      "#FFFF00",
                      "#FF00FF",
                      "#00FFFF",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setLightColor(color)}
                        style={{ backgroundColor: color }}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brightness Slider */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Brightness: {lightBrightness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightBrightness}
                onChange={(e) => setLightBrightness(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </>
        )}

        {/* Light Toggle */}
        <button
          onClick={handleLightToggle}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          💡 Toggle Lights
        </button>
      </div>

      {/* Oxygen Pump Control */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Wind className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Air Pump</h2>
            <p className="text-xs text-gray-500">Oxygenation system</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPumpMode("auto")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                pumpMode === "auto"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setPumpMode("manual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                pumpMode === "manual"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Auto Mode Info */}
        {pumpMode === "auto" && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Schedule:</span> 10 min ON every
              hour
            </p>
          </div>
        )}

        {/* Pump Status */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Pump Status</span>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                pumpStatus ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span
              className={`text-sm font-bold ${
                pumpStatus ? "text-green-600" : "text-gray-600"
              }`}
            >
              {pumpStatus ? "RUNNING" : "STOPPED"}
            </span>
          </div>
        </div>

        {/* Pump Toggle */}
        {pumpMode === "manual" && (
          <button
            onClick={handlePumpToggle}
            className={`w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 ${
              pumpStatus
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            }`}
          >
            {pumpStatus ? "⏸️ Stop Pump" : "▶️ Start Pump"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
