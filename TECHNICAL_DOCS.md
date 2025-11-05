# 🛠️ Smart Aquarium App - Technical Documentation

## Project Architecture

### Tech Stack

- **Frontend Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.3
- **Icons**: Lucide React + React Icons
- **Build Tool**: Vite 4.4.5
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **IoT Device**: ESP32 Microcontroller

---

## File Structure

```
f:\IOT\
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Home screen with live data
│   │   ├── Controls.jsx        # Device control panel
│   │   ├── Alerts.jsx          # Notification center
│   │   └── Settings.jsx        # Configuration page
│   ├── App.jsx                 # Main app with navigation
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## Component Documentation

### 1. App.jsx

**Purpose**: Main application shell with bottom navigation

**State Management**:

```javascript
const [activeTab, setActiveTab] = useState("dashboard");
```

**Navigation Tabs**:

- `dashboard`: Home/Dashboard view
- `controls`: Device controls
- `alerts`: Alerts & notifications
- `settings`: Configuration

**Key Features**:

- Fixed bottom navigation bar
- Conditional rendering based on active tab
- Badge notifications on Alerts tab
- Mobile-optimized navigation buttons

---

### 2. Dashboard.jsx

**Purpose**: Real-time monitoring dashboard

**State Variables**:

```javascript
const [sensorData, setSensorData] = useState({
  waterTemp: 26.5, // °C
  waterQuality: "Good", // Good/Moderate/Bad
  turbidityValue: 15, // NTU
  lastFed: "2 hours ago",
  nextFeeding: "In 4 hours",
  lightStatus: "ON",
  pumpStatus: "ON",
  timestamp: new Date().toLocaleString(),
});

const [alerts, setAlerts] = useState([]);
```

**Real-Time Updates**:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // Update sensor data every 5 seconds
    setSensorData((prev) => ({ ...prev /* new data */ }));
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

**Firebase Integration** (To be implemented):

```javascript
// Example Firebase listener
import { ref, onValue } from "firebase/database";

useEffect(() => {
  const dbRef = ref(database, "aquarium/sensors");
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setSensorData(data);
  });
  return () => unsubscribe();
}, []);
```

---

### 3. Controls.jsx

**Purpose**: Manual and automatic device control

**State Variables**:

```javascript
const [feedingMode, setFeedingMode] = useState("auto");
const [feedInterval, setFeedInterval] = useState(6); // hours
const [lightMode, setLightMode] = useState("auto");
const [lightColor, setLightColor] = useState("#4A90E2");
const [lightBrightness, setLightBrightness] = useState(80);
const [pumpMode, setPumpMode] = useState("auto");
const [pumpStatus, setPumpStatus] = useState(true);
```

**Control Functions**:

#### Feed Now Function

```javascript
const handleFeedNow = () => {
  // Firebase command
  update(ref(database, "aquarium/commands"), {
    feedNow: true,
    timestamp: Date.now(),
  });
};
```

#### Light Control

```javascript
const handleLightToggle = () => {
  update(ref(database, "aquarium/lights"), {
    status: !lightStatus,
    mode: lightMode,
    color: lightColor,
    brightness: lightBrightness,
  });
};
```

#### Pump Control

```javascript
const handlePumpToggle = () => {
  update(ref(database, "aquarium/pump"), {
    status: !pumpStatus,
    mode: pumpMode,
  });
};
```

---

### 4. Alerts.jsx

**Purpose**: Alert management and notification center

**State Variables**:

```javascript
const [activeAlerts, setActiveAlerts] = useState([
  {
    id: 1,
    type: "warning", // error/warning/success/info
    title: "Water Quality Alert",
    message: "Turbidity level is moderate...",
    timestamp: "5 minutes ago",
    active: true,
  },
]);

const [buzzerActive, setBuzzerActive] = useState(false);
const [notifications, setNotifications] = useState(true);
```

**Alert Types**:

- `error`: Critical issues (Red)
- `warning`: Attention needed (Yellow)
- `success`: Positive events (Green)
- `info`: Status updates (Blue)

**Functions**:

```javascript
// Reset specific alert
const handleResetAlert = (alertId) => {
  update(ref(database, `aquarium/alerts/${alertId}`), {
    active: false,
    resetAt: Date.now(),
  });
};

// Stop buzzer
const handleStopBuzzer = () => {
  update(ref(database, "aquarium/buzzer"), {
    active: false,
  });
};
```

---

### 5. Settings.jsx

**Purpose**: System configuration and management

**State Variables**:

```javascript
const [connectionStatus, setConnectionStatus] = useState({
  esp32: true,
  firebase: true,
  internet: true,
});

const [schedules, setSchedules] = useState({
  lightStart: "06:00",
  lightEnd: "20:00",
  pumpDuration: 10, // minutes
  pumpInterval: 60, // minutes
});
```

**Schedule Management**:

```javascript
const handleSaveSchedules = () => {
  update(ref(database, "aquarium/schedules"), schedules);
};
```

---

## Firebase Database Structure

```json
{
  "aquarium": {
    "sensors": {
      "temperature": 26.5,
      "turbidity": 15,
      "timestamp": 1699123456789
    },
    "devices": {
      "lights": {
        "status": "ON",
        "mode": "auto",
        "color": "#4A90E2",
        "brightness": 80,
        "schedule": {
          "start": "06:00",
          "end": "20:00"
        }
      },
      "pump": {
        "status": "ON",
        "mode": "auto",
        "duration": 10,
        "interval": 60
      },
      "feeder": {
        "lastFed": 1699120000000,
        "nextFeed": 1699141600000,
        "interval": 6,
        "mode": "auto"
      }
    },
    "alerts": {
      "alert1": {
        "type": "warning",
        "title": "Water Quality Alert",
        "message": "Check filter",
        "timestamp": 1699123000000,
        "active": true
      }
    },
    "commands": {
      "feedNow": false,
      "stopBuzzer": false,
      "resetAlerts": false
    },
    "system": {
      "esp32Connected": true,
      "lastUpdate": 1699123456789,
      "firmware": "v2.3.1"
    }
  }
}
```

---

## Tailwind CSS Customization

### Color Palette

```javascript
// Custom colors for aquarium theme
colors: {
  aqua: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#1890FF',
    600: '#096DD9',
    700: '#0050B3',
    800: '#003A8C',
    900: '#002766'
  }
}
```

### Responsive Breakpoints

```javascript
screens: {
  'xs': '320px',   // Small phones
  'sm': '640px',   // Large phones
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
}
```

---

## ESP32 Integration

### Data Publishing (ESP32 → Firebase)

```cpp
// ESP32 Arduino code example
#include <WiFi.h>
#include <FirebaseESP32.h>

void publishSensorData() {
  float temp = readTemperature();
  int turbidity = readTurbidity();

  Firebase.setFloat(firebaseData, "/aquarium/sensors/temperature", temp);
  Firebase.setInt(firebaseData, "/aquarium/sensors/turbidity", turbidity);
  Firebase.setInt(firebaseData, "/aquarium/sensors/timestamp", millis());
}
```

### Command Listening (Firebase → ESP32)

```cpp
void listenForCommands() {
  if (Firebase.getBool(firebaseData, "/aquarium/commands/feedNow")) {
    if (firebaseData.boolData()) {
      triggerFeeding();
      Firebase.setBool(firebaseData, "/aquarium/commands/feedNow", false);
    }
  }

  if (Firebase.getString(firebaseData, "/aquarium/lights/color")) {
    String color = firebaseData.stringData();
    setLEDColor(color);
  }
}
```

---

## Performance Optimization

### React Optimization

```javascript
// Use memo for expensive computations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

// Use callback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Lazy load components
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### Firebase Optimization

```javascript
// Limit data sync
const recentAlertsRef = query(
  ref(database, "aquarium/alerts"),
  orderByChild("timestamp"),
  limitToLast(10)
);

// Offline persistence
enableDatabase(app);
```

---

## Mobile Responsive Design

### Viewport Configuration

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### Touch-Friendly Design

- Minimum tap target: 44x44px
- Adequate spacing between buttons
- Large text for readability
- High contrast colors

### CSS Media Queries

```css
/* Mobile-first approach */
@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

---

## Testing Guidelines

### Manual Testing Checklist

- [ ] All navigation tabs work
- [ ] Real-time data updates
- [ ] Control buttons respond
- [ ] Alerts display correctly
- [ ] Settings save properly
- [ ] Responsive on different screen sizes
- [ ] Touch interactions smooth
- [ ] No console errors

### Firebase Security Rules

```json
{
  "rules": {
    "aquarium": {
      ".read": "auth != null && auth.uid == 'OWNER_UID'",
      ".write": "auth != null && auth.uid == 'OWNER_UID'"
    }
  }
}
```

---

## Deployment

### Build for Production

```bash
npm run build
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Environment Variables

```javascript
// .env file
VITE_FIREBASE_API_KEY = your_api_key;
VITE_FIREBASE_AUTH_DOMAIN = your_auth_domain;
VITE_FIREBASE_DATABASE_URL = your_database_url;
VITE_FIREBASE_PROJECT_ID = your_project_id;
```

---

## Troubleshooting

### Common Issues

**Issue**: Components not rendering

- Check import paths
- Verify component exports
- Check for syntax errors

**Issue**: Tailwind styles not applying

- Run `npm run dev` to rebuild
- Check `tailwind.config.js`
- Verify class names

**Issue**: Firebase not connecting

- Check Firebase config
- Verify API keys
- Check network connection

---

## Future Development Roadmap

### Phase 1: Core Features ✅

- [x] Dashboard with real-time data
- [x] Device controls
- [x] Alert system
- [x] Settings configuration

### Phase 2: Enhanced Features

- [ ] Historical data charts (Chart.js)
- [ ] User authentication flow
- [ ] Push notifications (FCM)
- [ ] Offline mode (Service Workers)

### Phase 3: Advanced Features

- [ ] AI-powered recommendations
- [ ] Multi-aquarium support
- [ ] Voice commands (Web Speech API)
- [ ] AR fish tracking

---

## Code Style Guidelines

### Naming Conventions

- **Components**: PascalCase (Dashboard.jsx)
- **Functions**: camelCase (handleFeedNow)
- **Constants**: UPPER_SNAKE_CASE (MAX_TEMP)
- **CSS Classes**: kebab-case or Tailwind utilities

### Component Structure

```javascript
// 1. Imports
import { useState } from "react";

// 2. Component definition
const ComponentName = () => {
  // 3. State declarations
  const [state, setState] = useState(initial);

  // 4. Effects
  useEffect(() => {}, []);

  // 5. Event handlers
  const handleClick = () => {};

  // 6. Render
  return <div>...</div>;
};

// 7. Export
export default ComponentName;
```

---

## License & Credits

**License**: MIT  
**Author**: IoT Aquarium Team  
**Year**: 2025

**Dependencies**:

- React - UI Framework
- Tailwind CSS - Styling
- Lucide React - Icons
- Firebase - Backend
- Vite - Build Tool

---

**For questions or contributions, please contact the development team.**
