import { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { database } from "../firebase/config";
import { ref, set, onValue } from "firebase/database";

const Controls = () => {
  const [feedingMode, setFeedingMode] = useState("auto");
  const [feedInterval, setFeedInterval] = useState(6);

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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-8 pb-20 lg:pb-8 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="text-4xl">🎮</div>
          <div>
            <h1 className="font-bold text-gray-900 text-4xl lg:text-5xl tracking-tight bg-gradient-to-r from-coral-600 to-orange-600 bg-clip-text text-transparent">
              Device Controls
            </h1>
            <p className="font-medium text-gray-500 text-sm mt-1">Manage your aquarium devices</p>
          </div>
        </div>

        <div className="gap-6 lg:gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* Feeding Control */}
          <div className="group bg-white shadow-md hover:shadow-xl p-7 lg:p-8 border border-gray-200 rounded-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="flex justify-center items-center bg-gradient-to-br from-coral-100 to-orange-100 shadow-sm mr-4 rounded-xl w-14 h-14">
                <Coffee className="text-coral-600" size={28} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-2xl">
                  Feeding System
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  Automated food dispenser
                </p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block mb-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                Operating Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFeedingModeChange("auto")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-wider ${feedingMode === "auto"
                      ? "bg-gradient-to-r from-coral-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-coral-600 hover:to-orange-600 scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  aria-label="Set feeding to automatic mode"
                >
                  ⏰ Automatic
                </button>
                <button
                  onClick={() => handleFeedingModeChange("manual")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-wider ${feedingMode === "manual"
                      ? "bg-gradient-to-r from-coral-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-coral-600 hover:to-orange-600 scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  aria-label="Set feeding to manual mode"
                >
                  ✋ Manual
                </button>
              </div>
            </div>

            {/* Auto Mode Settings */}
            {feedingMode === "auto" && (
              <div className="bg-gradient-to-br from-coral-50 to-orange-50 shadow-sm mb-6 p-5 border border-coral-200 rounded-2xl">
                <label className="block mb-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Feed Interval:{" "}
                  <span className="text-coral-600 font-bold">{feedInterval} hours</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={feedInterval}
                  onChange={(e) => handleFeedIntervalChange(e.target.value)}
                  className="bg-gray-200 rounded-lg w-full h-2.5 accent-coral-500 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                  aria-label="Feeding interval slider"
                />
                <div className="flex justify-between mt-3 font-bold text-gray-600 text-xs">
                  <span>1 hour</span>
                  <span>24 hours</span>
                </div>
              </div>
            )}

            {/* Feed Now Button */}
            <button
              onClick={handleFeedNow}
              className="bg-gradient-to-r from-coral-500 via-coral-600 to-orange-500 shadow-lg hover:shadow-2xl py-4 px-6 rounded-xl w-full font-bold text-white hover:scale-105 active:scale-95 transition-all duration-300 text-lg uppercase tracking-wider"
              aria-label="Feed fish now"
            >
              🐟 Feed Now!
            </button>
          </div>

          {/* Additional Controls Section */}
          <div className="group bg-white shadow-md hover:shadow-xl p-7 lg:p-8 border border-gray-200 rounded-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="flex justify-center items-center bg-gradient-to-br from-blue-100 to-cyan-100 shadow-sm mr-4 rounded-xl w-14 h-14">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-2xl">
                  Quick Settings
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  Adjust device parameters
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">Feeding System</p>
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{feedingMode === "auto" ? "Automatic" : "Manual"}</span>
                </div>
                <p className="text-gray-600 text-xs">Current mode: {feedingMode}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">System Health</p>
                  <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Good</span>
                </div>
                <p className="text-gray-600 text-xs">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
