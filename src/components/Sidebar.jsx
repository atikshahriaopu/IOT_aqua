import { Home, Sliders, Bell, Settings as SettingsIcon } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block lg:w-64 bg-white border-r border-gray-200 shadow-md">
        <div className="sticky top-0 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              🐠{" "}
              <span className="ml-2 bg-gradient-to-r from-aqua-600 to-ocean-600 bg-clip-text text-transparent">
                Smart Aquarium
              </span>
            </h1>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              IoT Management System
            </p>
          </div>
          <nav className="space-y-3">
            <DesktopNavButton
              icon={<Home size={22} />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <DesktopNavButton
              icon={<Sliders size={22} />}
              label="Controls"
              active={activeTab === "controls"}
              onClick={() => setActiveTab("controls")}
            />
            <DesktopNavButton
              icon={<Bell size={22} />}
              label="Alerts"
              active={activeTab === "alerts"}
              onClick={() => setActiveTab("alerts")}
              badge={2}
            />
            <DesktopNavButton
              icon={<SettingsIcon size={22} />}
              label="Settings"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-2 py-3 pb-safe shadow-xl z-50 lg:hidden backdrop-blur-sm bg-white/95">
        <div className="flex justify-around items-center max-w-md mx-auto gap-1">
          <MobileNavButton
            icon={<Home size={24} />}
            label="Home"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <MobileNavButton
            icon={<Sliders size={24} />}
            label="Controls"
            active={activeTab === "controls"}
            onClick={() => setActiveTab("controls")}
          />
          <MobileNavButton
            icon={<Bell size={24} />}
            label="Alerts"
            active={activeTab === "alerts"}
            onClick={() => setActiveTab("alerts")}
            badge={2}
          />
          <MobileNavButton
            icon={<SettingsIcon size={24} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>
      </nav>
    </>
  );
};

// Mobile Navigation Button Component
const MobileNavButton = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center relative py-3 px-4 rounded-xl transition-all duration-300 min-w-[72px] focus-aqua ${
      active
        ? "bg-gradient-to-br from-aqua-50 to-ocean-50 scale-110"
        : "hover:bg-gray-50 hover:scale-105"
    }`}
    aria-label={label}
    aria-current={active ? "page" : undefined}
  >
    <div
      className={`transition-all duration-300 ${
        active ? "text-aqua-600 scale-110" : "text-gray-500"
      }`}
    >
      {icon}
      {badge && (
        <span className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
          {badge}
        </span>
      )}
    </div>
    <span
      className={`text-xs mt-1.5 font-bold transition-all duration-300 ${
        active ? "text-aqua-600" : "text-gray-600"
      }`}
    >
      {label}
    </span>
  </button>
);

// Desktop Navigation Button Component
const DesktopNavButton = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 relative group focus-aqua ${
      active
        ? "bg-gradient-to-r from-aqua-50 to-ocean-50 text-aqua-600 font-bold shadow-md scale-105"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold hover:scale-105"
    }`}
    aria-label={label}
    aria-current={active ? "page" : undefined}
  >
    <span
      className={`mr-3 transition-all duration-300 ${
        active ? "scale-110" : "group-hover:scale-110"
      }`}
    >
      {icon}
    </span>
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
