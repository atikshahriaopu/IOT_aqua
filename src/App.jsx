import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Controls from "./components/Controls";
import Alerts from "./components/Alerts";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Layout */}
      <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:min-h-screen">
        {/* Sidebar Component (Desktop & Mobile) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 pb-16 lg:pb-0 lg:overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
