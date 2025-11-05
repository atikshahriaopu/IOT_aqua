import { useState } from "react";
import { Home, Sliders, Bell, Settings as SettingsIcon } from "lucide-react";
import Dashboard from "./components/Dashboard";
import Controls from "./components/Controls";
import Alerts from "./components/Alerts";
import Settings from "./components/Settings";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "controls":
        return <Controls />;
      case "alerts":
        return <Alerts />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-16">{renderContent()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <NavButton
            icon={<Home size={24} />}
            label="Home"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavButton
            icon={<Sliders size={24} />}
            label="Controls"
            active={activeTab === "controls"}
            onClick={() => setActiveTab("controls")}
          />
          <NavButton
            icon={<Bell size={24} />}
            label="Alerts"
            active={activeTab === "alerts"}
            onClick={() => setActiveTab("alerts")}
            badge={2}
          />
          <NavButton
            icon={<SettingsIcon size={24} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>
      </nav>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center relative py-2 px-4 transition-all"
  >
    <div
      className={`transition-all ${active ? "text-blue-500" : "text-gray-400"}`}
    >
      {icon}
      {badge && (
        <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
    </div>
    <span
      className={`text-xs mt-1 font-medium ${
        active ? "text-blue-500" : "text-gray-500"
      }`}
    >
      {label}
    </span>
  </button>
);

export default App;
