import { useState, useEffect } from "react";
import { Lightbulb, Coffee } from "lucide-react";
import { database } from "../firebase/config";
import { ref, set, onValue } from "firebase/database";

const Controls = () => {
  const [feedingMode, setFeedingMode] = useState("auto");
  const [feedInterval, setFeedInterval] = useState(6);
  const [lightMode, setLightMode] = useState("manual");
  const [lightStatus, setLightStatus] = useState("OFF");
  const [lightColor, setLightColor] = useState("#4A90E2");
  const [lightBrightness, setLightBrightness] = useState(80);

  // Load current settings from Firebase
  useEffect(() => {
    const devicesRef = ref(database, "aquarium/devices");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        if (data.feeder) {
          setFeedingMode(data.feeder.mode || "auto");
          setFeedInterval(data.feeder.interval || 6);
        }

        if (data.lights) {
          setLightMode(data.lights.mode || "manual");
          setLightStatus(data.lights.status || "OFF");
          setLightColor(data.lights.color || "#4A90E2");
          setLightBrightness(data.lights.brightness || 80);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFeedNow = async () => {
    try {
      // Send command to Firebase to trigger feeding
      await set(ref(database, "aquarium/commands/feedNow"), true);
      console.log("Feeding now...");
      alert("🐠 Feeding initiated!");
    } catch (error) {
      console.error("Error feeding:", error);
      alert("❌ Failed to feed. Check connection.");
    }
  };

  const handleFeedingModeChange = async (mode) => {
    setFeedingMode(mode);
    try {
      await set(ref(database, "aquarium/devices/feeder/mode"), mode);
    } catch (error) {
      console.error("Error updating feeding mode:", error);
    }
  };

  const handleFeedIntervalChange = async (interval) => {
    setFeedInterval(interval);
    try {
      await set(
        ref(database, "aquarium/devices/feeder/interval"),
        parseInt(interval)
      );
    } catch (error) {
      console.error("Error updating feed interval:", error);
    }
  };

  const handleLightToggle = async () => {
    const newStatus = lightStatus === "ON" ? "OFF" : "ON";
    setLightStatus(newStatus);
    try {
      await set(ref(database, "aquarium/devices/lights/status"), newStatus);
    } catch (error) {
      console.error("Error toggling lights:", error);
    }
  };

  const handleLightModeChange = async (mode) => {
    setLightMode(mode);
    try {
      await set(ref(database, "aquarium/devices/lights/mode"), mode);
    } catch (error) {
      console.error("Error updating light mode:", error);
    }
  };

  const handleLightColorChange = async (color) => {
    setLightColor(color);
    try {
      await set(ref(database, "aquarium/devices/lights/color"), color);
    } catch (error) {
      console.error("Error updating light color:", error);
    }
  };

  const handleBrightnessChange = async (brightness) => {
    setLightBrightness(brightness);
    try {
      await set(
        ref(database, "aquarium/devices/lights/brightness"),
        parseInt(brightness)
      );
    } catch (error) {
      console.error("Error updating brightness:", error);
    }
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
                  onClick={() => handleFeedingModeChange("auto")}
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
                  onClick={() => handleFeedingModeChange("manual")}
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
                  onChange={(e) => handleFeedIntervalChange(e.target.value)}
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
                  onClick={() => handleLightModeChange("auto")}
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
                  onClick={() => handleLightModeChange("manual")}
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
                      onChange={(e) => handleLightColorChange(e.target.value)}
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
                            onClick={() => handleLightColorChange(color)}
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
                    onChange={(e) => handleBrightnessChange(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default Controls;
