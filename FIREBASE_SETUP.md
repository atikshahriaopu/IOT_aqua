# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `smart-aquarium`
4. Disable Google Analytics (optional)
5. Click "Create Project"

---

## Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build > Realtime Database**
2. Click "Create Database"
3. Choose location: Select closest to your region
4. Start in **Test Mode** (we'll add rules later)
5. Click "Enable"

---

## Step 3: Enable Authentication

1. Go to **Build > Authentication**
2. Click "Get Started"
3. Click on **Email/Password** provider
4. Enable it and click "Save"
5. Go to **Users** tab
6. Click "Add User"
7. Enter email and password for aquarium owner
8. Click "Add User"

---

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click on **Web** icon (`</>`)
4. Register app name: `smart-aquarium-app`
5. Copy the `firebaseConfig` object

---

## Step 5: Configure App

1. Navigate to `src/firebase/`
2. Copy `config.template.js` to `config.js`
   ```bash
   cp src/firebase/config.template.js src/firebase/config.js
   ```
3. Open `config.js` and replace values with your Firebase config
4. Save the file

**Example configuration:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnop",
  authDomain: "smart-aquarium-abc123.firebaseapp.com",
  databaseURL: "https://smart-aquarium-abc123-default-rtdb.firebaseio.com",
  projectId: "smart-aquarium-abc123",
  storageBucket: "smart-aquarium-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
};
```

---

## Step 6: Set Database Rules

1. In Firebase Console, go to **Realtime Database**
2. Click on **Rules** tab
3. Replace with these security rules:

```json
{
  "rules": {
    "aquarium": {
      ".read": "auth != null",
      ".write": "auth != null",
      "sensors": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "devices": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "alerts": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "commands": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "schedules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

4. Click "Publish"

---

## Step 7: Initialize Database Structure

1. In **Realtime Database**, click "+" to add data
2. Use this initial structure:

```json
{
  "aquarium": {
    "sensors": {
      "temperature": 26.5,
      "turbidity": 15,
      "timestamp": 0
    },
    "devices": {
      "lights": {
        "status": "OFF",
        "mode": "auto",
        "color": "#4A90E2",
        "brightness": 80
      },
      "pump": {
        "status": "OFF",
        "mode": "auto",
        "duration": 10,
        "interval": 60
      },
      "feeder": {
        "lastFed": 0,
        "nextFeed": 0,
        "interval": 6,
        "mode": "auto"
      }
    },
    "alerts": {},
    "commands": {
      "feedNow": false,
      "stopBuzzer": false
    },
    "schedules": {
      "lightStart": "06:00",
      "lightEnd": "20:00",
      "pumpDuration": 10,
      "pumpInterval": 60
    }
  }
}
```

---

## Step 8: Install Firebase SDK

In your project directory:

```bash
npm install firebase
```

---

## Step 9: Update Component Files

Update the component files to use Firebase:

### Example: Dashboard.jsx

```javascript
import { useEffect, useState } from "react";
import { database, sensorRef } from "../firebase/config";
import { onValue } from "firebase/database";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setSensorData(data);
    });

    return () => unsubscribe();
  }, []);

  // ... rest of component
};
```

### Example: Controls.jsx

```javascript
import { sendCommand } from "../firebase/config";

const handleFeedNow = async () => {
  try {
    await sendCommand("feedNow", true);
    alert("Feeding initiated!");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to feed");
  }
};
```

---

## Step 10: Test Connection

1. Start your dev server: `npm run dev`
2. Open browser console (F12)
3. Check for Firebase connection messages
4. Test reading data from database
5. Test writing data to database

---

## ESP32 Configuration

### Install ESP32 Firebase Library

In Arduino IDE:

1. Go to **Sketch > Include Library > Manage Libraries**
2. Search for "Firebase ESP32"
3. Install "Firebase ESP32 Client" by Mobizt

### ESP32 Code Example

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// WiFi credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Firebase credentials
#define FIREBASE_HOST "smart-aquarium-abc123-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"

FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected!");

  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Read sensors
  float temp = readTemperature();
  int turbidity = readTurbidity();

  // Update Firebase
  Firebase.setFloat(firebaseData, "/aquarium/sensors/temperature", temp);
  Firebase.setInt(firebaseData, "/aquarium/sensors/turbidity", turbidity);

  // Check for commands
  if (Firebase.getBool(firebaseData, "/aquarium/commands/feedNow")) {
    if (firebaseData.boolData()) {
      triggerFeeding();
      Firebase.setBool(firebaseData, "/aquarium/commands/feedNow", false);
    }
  }

  delay(5000); // Update every 5 seconds
}
```

---

## Troubleshooting

### Error: Permission Denied

- Check authentication is enabled
- Verify user is logged in
- Review database rules

### Error: Network Request Failed

- Check internet connection
- Verify Firebase config values
- Check firewall settings

### Error: Module Not Found

- Run `npm install firebase`
- Restart dev server
- Clear node_modules and reinstall

---

## Security Best Practices

1. **Never commit `config.js` to Git**

   - Add to `.gitignore`
   - Use environment variables in production

2. **Use Firebase Security Rules**

   - Restrict read/write access
   - Validate data types
   - Set data size limits

3. **Implement Rate Limiting**

   - Prevent abuse
   - Set quotas in Firebase Console

4. **Monitor Usage**
   - Check Firebase Usage tab
   - Set up billing alerts
   - Review audit logs

---

## Next Steps

1. ✅ Firebase configured
2. ✅ Database structure created
3. ✅ Authentication enabled
4. 🔲 Connect ESP32 to Firebase
5. 🔲 Test real-time data flow
6. 🔲 Deploy to Firebase Hosting
7. 🔲 Set up monitoring and alerts

---

**Need help?** Check [Firebase Documentation](https://firebase.google.com/docs)
