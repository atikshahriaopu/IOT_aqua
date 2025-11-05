# 🚀 Quick Reference Card - Smart Aquarium App

## 📱 Essential Commands

### Development

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:5173)
npm run dev -- --host    # Start with network access
npm run build            # Build for production
npm run preview          # Preview production build
```

### Testing on Mobile

1. Start: `npm run dev -- --host`
2. Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Open on phone: `http://YOUR_IP:5173`

---

## 🎯 Component Quick Reference

### Dashboard.jsx

```javascript
// Real-time sensor data
const [sensorData, setSensorData] = useState({
  waterTemp: 26.5,
  waterQuality: "Good",
  turbidityValue: 15,
  lightStatus: "ON",
  pumpStatus: "ON",
});

// Update every 5 seconds
useEffect(() => {
  setInterval(() => {
    /* update */
  }, 5000);
}, []);
```

### Controls.jsx

```javascript
// Device modes
const [feedingMode, setFeedingMode] = useState("auto");
const [lightMode, setLightMode] = useState("auto");
const [pumpMode, setPumpMode] = useState("auto");

// Trigger actions
handleFeedNow(); // Feed fish immediately
handleLightToggle(); // Toggle lights
handlePumpToggle(); // Start/stop pump
```

### Alerts.jsx

```javascript
// Alert structure
{
  id: 1,
  type: 'warning',    // error|warning|success|info
  title: 'Water Quality Alert',
  message: 'Check filter',
  timestamp: '5 minutes ago',
  active: true
}

// Actions
handleResetAlert(id)  // Dismiss alert
handleStopBuzzer()    // Stop buzzer
handleClearAll()      // Clear all alerts
```

### Settings.jsx

```javascript
// Schedules
const [schedules, setSchedules] = useState({
  lightStart: "06:00",
  lightEnd: "20:00",
  pumpDuration: 10,
  pumpInterval: 60,
});

// Save
handleSaveSchedules(); // Update schedules
handleTestConnection(); // Test ESP32 connection
```

---

## 🔥 Firebase Quick Start

### 1. Install Firebase

```bash
npm install firebase
```

### 2. Configure

```javascript
// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
```

### 3. Read Data

```javascript
import { ref, onValue } from "firebase/database";

useEffect(() => {
  const dbRef = ref(database, "aquarium/sensors");
  const unsubscribe = onValue(dbRef, (snapshot) => {
    setSensorData(snapshot.val());
  });
  return () => unsubscribe();
}, []);
```

### 4. Write Data

```javascript
import { ref, update } from "firebase/database";

const feedNow = () => {
  update(ref(database, "aquarium/commands"), {
    feedNow: true,
    timestamp: Date.now(),
  });
};
```

---

## 🎨 Tailwind Quick Reference

### Common Classes

```html
<!-- Layout -->
<div className="flex flex-col items-center justify-between">
  <div className="grid grid-cols-2 gap-4">
    <!-- Spacing -->
    <div className="p-4 m-4">
      <!-- padding & margin: 16px -->
      <div className="px-5 py-3">
        <!-- px: 20px, py: 12px -->

        <!-- Colors -->
        <div className="bg-blue-500 text-white">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600">
            <!-- Borders & Shadows -->
            <div className="rounded-xl shadow-lg border border-gray-200">
              <!-- Typography -->
              <h1 className="text-2xl font-bold text-gray-800">
                <p className="text-sm text-gray-500">
                  <!-- Buttons -->
                  <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 active:scale-95 transition-all"
                  ></button>
                </p>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Database Structure

```json
aquarium/
├── sensors/
│   ├── temperature: 26.5
│   ├── turbidity: 15
│   └── timestamp: 1699123456
├── devices/
│   ├── lights/
│   │   ├── status: "ON"
│   │   ├── mode: "auto"
│   │   ├── color: "#4A90E2"
│   │   └── brightness: 80
│   ├── pump/
│   │   ├── status: "ON"
│   │   └── mode: "auto"
│   └── feeder/
│       ├── lastFed: timestamp
│       └── interval: 6
├── alerts/
│   └── alert_id/
│       ├── type: "warning"
│       ├── message: "..."
│       └── active: true
└── commands/
    ├── feedNow: false
    └── stopBuzzer: false
```

---

## 🔌 ESP32 Integration

### Arduino Setup

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// Config
#define WIFI_SSID "your_wifi"
#define WIFI_PASSWORD "your_password"
#define FIREBASE_HOST "your_db.firebaseio.com"
#define FIREBASE_AUTH "your_secret"

FirebaseData firebaseData;

void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
```

### Read Sensors

```cpp
float temp = readTemperatureSensor();
int turbidity = readTurbiditySensor();

Firebase.setFloat(firebaseData, "/aquarium/sensors/temperature", temp);
Firebase.setInt(firebaseData, "/aquarium/sensors/turbidity", turbidity);
```

### Listen for Commands

```cpp
if (Firebase.getBool(firebaseData, "/aquarium/commands/feedNow")) {
  if (firebaseData.boolData()) {
    triggerServoMotor();  // Feed fish
    Firebase.setBool(firebaseData, "/aquarium/commands/feedNow", false);
  }
}
```

---

## 🎯 Common Tasks

### Add New Alert

```javascript
const newAlert = {
  id: Date.now(),
  type: "warning",
  title: "Temperature Alert",
  message: "Water too hot!",
  timestamp: new Date().toLocaleString(),
  active: true,
};
setAlerts((prev) => [...prev, newAlert]);
```

### Toggle Device

```javascript
const toggleLight = () => {
  setLightStatus((prev) => !prev);
  // Update Firebase
  update(ref(database, "aquarium/devices/lights"), {
    status: !lightStatus,
  });
};
```

### Update Schedule

```javascript
const saveSchedule = () => {
  update(ref(database, "aquarium/schedules"), {
    lightStart: "06:00",
    lightEnd: "20:00",
  });
};
```

---

## 🐛 Quick Fixes

### Problem: Port Already in Use

```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problem: Tailwind Not Working

```bash
npm run dev  # Restart server
```

### Problem: Firebase Not Connecting

1. Check `src/firebase/config.js` exists
2. Verify API keys
3. Check Firebase console

### Problem: Components Not Updating

```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📱 Navigation Routes

| Route       | Component     | Purpose         |
| ----------- | ------------- | --------------- |
| `dashboard` | Dashboard.jsx | Home screen     |
| `controls`  | Controls.jsx  | Device controls |
| `alerts`    | Alerts.jsx    | Notifications   |
| `settings`  | Settings.jsx  | Configuration   |

---

## 🎨 Color Reference

```javascript
// Status Colors
const colors = {
  good: "text-green-500 bg-green-50",
  moderate: "text-yellow-500 bg-yellow-50",
  bad: "text-red-500 bg-red-50",
  info: "text-blue-500 bg-blue-50",
};

// Temperature Status
if (temp < 24) return "text-blue-500"; // Cold
if (temp > 28) return "text-red-500"; // Hot
return "text-green-500"; // Optimal
```

---

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.3.3",
  "lucide-react": "latest",
  "firebase": "^10.x.x",
  "vite": "^4.4.5"
}
```

---

## 🔐 Security Checklist

- [ ] Add `src/firebase/config.js` to `.gitignore`
- [ ] Set Firebase database rules
- [ ] Enable Firebase Authentication
- [ ] Use environment variables
- [ ] Enable HTTPS in production

---

## 📚 Documentation Links

- **User Guide**: `MOBILE_APP_GUIDE.md`
- **Technical Docs**: `TECHNICAL_DOCS.md`
- **Firebase Setup**: `FIREBASE_SETUP.md`
- **Project Summary**: `PROJECT_SUMMARY.md`

---

## 🚀 Deployment

```bash
# Build
npm run build

# Test build locally
npm run preview

# Deploy to Firebase
firebase login
firebase init hosting
firebase deploy
```

---

## 📞 Need Help?

1. Check documentation files
2. Review console logs (F12)
3. Test connection in Settings
4. Verify Firebase configuration
5. Restart dev server

---

**💡 Pro Tip**: Keep browser DevTools open (F12) to monitor real-time updates and catch errors!

**🐠 Happy Coding! 🐠**
