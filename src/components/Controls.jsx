import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config.js";
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
    <div className="p-4 pb-20 lg:pb-8 bg-transparent min-h-screen lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-7 tracking-tight">
          Device Controls
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Feeding Control */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <Coffee className="text-coral-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Feeding System
                </h2>
                <p className="text-xs text-gray-600">
                  Automated food dispenser
                </p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-3 block">
                Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedingMode("auto")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                    feedingMode === "auto"
                      ? "bg-coral-500 text-white shadow-lg hover:shadow-xl hover:bg-coral-600 scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                  aria-label="Set feeding to automatic mode"
                >
                  Automatic
                </button>
                <button
                  onClick={() => setFeedingMode("manual")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                    feedingMode === "manual"
                      ? "bg-coral-500 text-white shadow-lg hover:shadow-xl hover:bg-coral-600 scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                  aria-label="Set feeding to manual mode"
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Auto Mode Settings */}
            {feedingMode === "auto" && (
              <div className="mb-5 p-4 bg-gradient-to-br from-coral-50 to-orange-50 rounded-xl border border-coral-100 shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  Feed Interval:{" "}
                  <span className="text-coral-600">{feedInterval} hours</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={feedInterval}
                  onChange={(e) => setFeedInterval(e.target.value)}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral-500 focus-aqua"
                  aria-label="Feeding interval slider"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                  <span>1h</span>
                  <span>24h</span>
                </div>
              </div>
            )}

            {/* Feed Now Button */}
            <button
              onClick={handleFeedNow}
              className="w-full bg-gradient-to-r from-coral-500 via-coral-600 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 focus-aqua"
              aria-label="Feed fish now"
            >
              🐟 Feed Now
            </button>
          </div>

          {/* Lighting Control */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-coral-100 to-yellow-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <Lightbulb className="text-coral-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  RGB Lighting
                </h2>
                <p className="text-xs text-gray-600">LED strip control</p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-3 block">
                Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLightMode("auto")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                    lightMode === "auto"
                      ? "bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg hover:shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                  aria-label="Set lighting to auto day/night mode"
                >
                  Auto Day/Night
                </button>
                <button
                  onClick={() => setLightMode("manual")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                    lightMode === "manual"
                      ? "bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg hover:shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                  aria-label="Set lighting to manual mode"
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Manual Mode Settings */}
            {lightMode === "manual" && (
              <>
                {/* Color Picker */}
                <div className="mb-5">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-300 shadow-md hover:shadow-lg transition-all focus-aqua"
                      aria-label="Select light color"
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
                            className="w-10 h-10 rounded-xl border-2 border-gray-300 hover:scale-110 hover:shadow-lg transition-all focus-aqua"
                            aria-label={`Set color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brightness Slider */}
                <div className="mb-5 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Brightness:{" "}
                    <span className="text-coral-600">{lightBrightness}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lightBrightness}
                    onChange={(e) => setLightBrightness(e.target.value)}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral-500 focus-aqua"
                    aria-label="Adjust brightness"
                  />
                </div>
              </>
            )}

            {/* Light Toggle */}
            <button
              onClick={handleLightToggle}
              className="w-full bg-gradient-to-r from-coral-400 via-coral-500 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 focus-aqua"
              aria-label="Toggle lights on or off"
            >
              💡 Toggle Lights
            </button>
          </div>

          {/* Oxygen Pump Control */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 lg:col-span-2">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <Wind className="text-ocean-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Air Pump</h2>
                <p className="text-xs text-gray-600">Oxygenation system</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                {/* Mode Selection */}
                <div className="mb-5">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Mode
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPumpMode("auto")}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                        pumpMode === "auto"
                          ? "bg-ocean-500 text-white shadow-lg hover:shadow-xl hover:bg-ocean-600 scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                      aria-label="Set pump to scheduled mode"
                    >
                      Scheduled
                    </button>
                    <button
                      onClick={() => setPumpMode("manual")}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 focus-aqua ${
                        pumpMode === "manual"
                          ? "bg-ocean-500 text-white shadow-lg hover:shadow-xl hover:bg-ocean-600 scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                      aria-label="Set pump to manual mode"
                    >
                      Manual
                    </button>
                  </div>
                </div>

                {/* Auto Mode Info */}
                {pumpMode === "auto" && (
                  <div className="mb-5 p-4 bg-gradient-to-br from-ocean-50 to-aqua-50 rounded-xl border border-ocean-100 shadow-sm">
                    <p className="text-sm text-ocean-800 font-medium">
                      <span className="font-bold">Schedule:</span> 10 min ON
                      every hour
                    </p>
                  </div>
                )}
              </div>

              <div>
                {/* Pump Status */}
                <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-sm font-bold text-gray-700">
                    Pump Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          pumpStatus ? "bg-seaweed-500" : "bg-gray-400"
                        }`}
                      ></div>
                      {pumpStatus && (
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-seaweed-500 animate-pulse-slow"></div>
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        pumpStatus ? "text-seaweed-600" : "text-gray-600"
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
                    className={`w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 focus-aqua ${
                      pumpStatus
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-ocean-500 via-ocean-600 to-aqua-600 text-white"
                    }`}
                    aria-label={pumpStatus ? "Stop the pump" : "Start the pump"}
                  >
                    {pumpStatus ? "⏸️ Stop Pump" : "▶️ Start Pump"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
