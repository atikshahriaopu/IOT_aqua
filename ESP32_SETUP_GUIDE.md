# 🔌 ESP32 Setup Guide - IoT Smart Aquarium

## 📋 Table of Contents
1. [Hardware Requirements](#hardware-requirements)
2. [Wiring Diagram](#wiring-diagram)
3. [Software Setup](#software-setup)
4. [ESP32 Code](#esp32-code)
5. [Firebase Connection](#firebase-connection)
6. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🛠️ Hardware Requirements

### ESP32 Board
- **ESP32 DevKit V1** (recommended) or any ESP32 board
- USB cable for programming

### Sensors
- **DS18B20** - Waterproof temperature sensor with 4.7kΩ pull-up resistor

### Actuators
- **Servo Motor (SG90)** - For automatic food dispenser
- **WS2812B RGB LED Strip** - For aquarium lighting
- **5V Buzzer** - For alerts (optional)

### Power Supply
- **5V 3A Power Adapter** - For ESP32 and peripherals
- **Breadboard & Jumper Wires**
- **Logic Level Converter** (if using 5V devices with 3.3V ESP32 pins)

---

## 🔌 Wiring Diagram

### Pin Configuration

```
ESP32 Pin Layout:
┌─────────────────────────────────┐
│  ESP32 DevKit V1                │
├─────────────────────────────────┤
│  GPIO4   ──→  DS18B20 Data      │
│  GPIO18  ──→  Servo Signal      │
│  GPIO5   ──→  WS2812B Data In   │
│  GPIO19  ──→  Buzzer (+)        │
│  3.3V    ──→  DS18B20 VCC       │
│  5V      ──→  Servo/LED VCC     │
│  GND     ──→  All GND           │
└─────────────────────────────────┘
```

### Detailed Connections

#### 1. DS18B20 Temperature Sensor
```
DS18B20          ESP32
───────          ─────
Red (VCC)    →   3.3V
Black (GND)  →   GND
Yellow (Data)→   GPIO4
               + 4.7kΩ resistor between VCC and Data
```

#### 2. Servo Motor (Feeder)
```
Servo            ESP32
─────            ─────
Red (VCC)    →   5V
Brown (GND)  →   GND
Orange (Sig) →   GPIO18
```

#### 3. WS2812B RGB LED Strip
```
LED Strip        ESP32
─────────        ─────
5V           →   5V (external power for long strips)
GND          →   GND
DIN          →   GPIO5
```
**Note:** For LED strips >30 LEDs, use external 5V power supply.

#### 4. Buzzer (Optional)
```
Buzzer           ESP32
──────           ─────
+            →   GPIO19
-            →   GND
```

---

## 💻 Software Setup

### 1. Install Arduino IDE
1. Download from [arduino.cc](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - Go to **File → Preferences**
   - Add to Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools → Board → Boards Manager**
   - Search "ESP32" and install "esp32 by Espressif Systems"

### 2. Install Required Libraries
Go to **Sketch → Include Library → Manage Libraries**, then install:

- **Firebase ESP32 Client** by Mobizt (v4.x.x)
- **OneWire** by Paul Stoffregen
- **DallasTemperature** by Miles Burton
- **ESP32Servo** by Kevin Harrington
- **Adafruit NeoPixel** by Adafruit

---

## 📝 ESP32 Code

Create a new Arduino sketch and copy this code:

```cpp
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h>
#include <Adafruit_NeoPixel.h>

// Provide the token generation process info
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ========================
// WiFi Credentials
// ========================
#define WIFI_SSID "Sikder's House 6.2G"
#define WIFI_PASSWORD "madminadmin"

// ========================
// Firebase Configuration
// ========================
// From your web firebaseConfig
#define API_KEY "AIzaSyDZoH0kiII9-NzBEBGZecjjlHSaFzDiVfM"
#define DATABASE_URL "https://smart-aquarium-80c3d-default-rtdb.asia-southeast1.firebasedatabase.app"

// Use an email/password you’ve created in Firebase Authentication:
#define USER_EMAIL "akib@gmail.com"
#define USER_PASSWORD "123123"

// ========================
// Pin Definitions
// ========================
#define TEMP_PIN 4          // DS18B20 temperature sensor
#define SERVO_PIN 18        // Servo motor for feeder
#define LED_PIN 5           // WS2812B LED strip
#define BUZZER_PIN 19       // Buzzer for alerts

// ========================
// LED Configuration
// ========================
#define NUM_LEDS 30         // Number of LEDs in strip
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// ========================
// Sensor & Actuator Objects
// ========================
OneWire oneWire(TEMP_PIN);
DallasTemperature sensors(&oneWire);
Servo feederServo;

// ========================
// Firebase Objects
// ========================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ========================
// Global Variables
// ========================
unsigned long sendDataPrevMillis = 0;
unsigned long checkCommandsPrevMillis = 0;
bool signupOK = false;

// LED state variables
bool lightStatus = false;
String lightMode = "auto";
uint32_t currentColor = strip.Color(74, 144, 226); // #4A90E2
int brightness = 80;

// Feeder state
unsigned long lastFeedTime = 0;
int feedInterval = 6; // hours

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  
  // Initialize sensors
  sensors.begin();
  
  // Initialize servo
  feederServo.attach(SERVO_PIN);
  feederServo.write(0); // Initial position
  
  // Initialize LED strip
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  strip.setBrightness(brightness * 255 / 100);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  
  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  
  // Sign in to Firebase
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  
  // Assign the callback function for token generation  
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  Serial.println("Firebase initialized!");
  delay(1000);
}

void loop() {
  // Send sensor data to Firebase every 5 seconds
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    updateSensorData();
  }
  
  // Check for commands from Firebase every 1 second
  if (Firebase.ready() && (millis() - checkCommandsPrevMillis > 1000 || checkCommandsPrevMillis == 0)) {
    checkCommandsPrevMillis = millis();
    checkCommands();
  }
  
  // Handle automatic lighting based on mode
  handleLighting();
  
  // Handle automatic feeding
  handleAutoFeeding();
}

// ========================
// Update Sensor Data
// ========================
void updateSensorData() {
  // Read temperature
  sensors.requestTemperatures();
  float temperature = sensors.getTempCByIndex(0);
  
  Serial.print("Raw temperature reading: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  if (temperature != DEVICE_DISCONNECTED_C && temperature > -100) {
    // Update temperature in Firebase
    if (Firebase.RTDB.setFloat(&fbdo, "aquarium/sensors/temperature", temperature)) {
      Serial.print("✓ Temperature uploaded: ");
      Serial.print(temperature);
      Serial.println("°C");
      
      // Check temperature alert
      checkTemperatureAlert(temperature);
    } else {
      Serial.println("Failed to update temperature: " + fbdo.errorReason());
    }
  } else {
    Serial.println("⚠️ DS18B20 sensor not detected! Check wiring.");
    // Still update timestamp so web app knows ESP32 is connected
  }
  
  // Update timestamp
  Firebase.RTDB.setInt(&fbdo, "aquarium/sensors/timestamp", millis() / 1000);
}

// ========================
// Check Firebase Commands
// ========================
void checkCommands() {
  // Check feed now command
  if (Firebase.RTDB.getBool(&fbdo, "aquarium/commands/feedNow")) {
    if (fbdo.boolData()) {
      Serial.println("Feed now command received!");
      feedFish();
      Firebase.RTDB.setBool(&fbdo, "aquarium/commands/feedNow", false);
    }
  }
  
  // Check stop buzzer command
  if (Firebase.RTDB.getBool(&fbdo, "aquarium/commands/stopBuzzer")) {
    if (fbdo.boolData()) {
      Serial.println("Stop buzzer command received!");
      digitalWrite(BUZZER_PIN, LOW);
      Firebase.RTDB.setBool(&fbdo, "aquarium/commands/stopBuzzer", false);
    }
  }
  
  // Get light settings
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/lights/status")) {
    lightStatus = (fbdo.stringData() == "ON");
  }
  
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/lights/mode")) {
    lightMode = fbdo.stringData();
  }
  
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/lights/color")) {
    String colorHex = fbdo.stringData();
    currentColor = hexToColor(colorHex);
  }
  
  if (Firebase.RTDB.getInt(&fbdo, "aquarium/devices/lights/brightness")) {
    brightness = fbdo.intData();
    strip.setBrightness(brightness * 255 / 100);
  }
  
  // Get feeder settings
  if (Firebase.RTDB.getInt(&fbdo, "aquarium/devices/feeder/interval")) {
    feedInterval = fbdo.intData();
  }
}

// ========================
// Feed Fish Function
// ========================
void feedFish() {
  Serial.println("Feeding fish...");
  
  // Rotate servo to dispense food
  feederServo.write(90);
  delay(500);
  feederServo.write(0);
  
  // Update last fed time in Firebase
  lastFeedTime = millis();
  Firebase.RTDB.setInt(&fbdo, "aquarium/devices/feeder/lastFed", millis() / 1000);
  
  Serial.println("Feeding complete!");
}

// ========================
// Handle Automatic Feeding
// ========================
void handleAutoFeeding() {
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/feeder/mode")) {
    if (fbdo.stringData() == "auto") {
      unsigned long currentTime = millis();
      if (lastFeedTime == 0 || (currentTime - lastFeedTime >= feedInterval * 3600000)) {
        feedFish();
      }
    }
  }
}

// ========================
// Handle Lighting
// ========================
void handleLighting() {
  if (lightMode == "auto") {
    // Implement day/night cycle based on schedules from Firebase (future)
  } else if (lightMode == "manual") {
    if (lightStatus) {
      // Set all LEDs to current color
      for (int i = 0; i < NUM_LEDS; i++) {
        strip.setPixelColor(i, currentColor);
      }
      strip.show();
    } else {
      // Turn off all LEDs
      strip.clear();
      strip.show();
    }
  }
}

// ========================
// Helper: Convert Hex to RGB Color
// ========================
uint32_t hexToColor(String hex) {
  // Remove '#' if present
  if (hex.charAt(0) == '#') {
    hex = hex.substring(1);
  }
  
  // Convert hex string to RGB values
  long number = strtol(hex.c_str(), NULL, 16);
  int r = (number >> 16) & 0xFF;
  int g = (number >> 8) & 0xFF;
  int b = number & 0xFF;
  
  return strip.Color(r, g, b);
}

// ========================
// Alert Function (Temperature)
// ========================
void checkTemperatureAlert(float temp) {
  if (temp < 24.0 || temp > 28.0) {
    // Trigger buzzer
    digitalWrite(BUZZER_PIN, HIGH);
    
    // Update alert in Firebase
    Firebase.RTDB.setString(&fbdo, "aquarium/alerts/temperature", "Temperature out of range!");
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    Firebase.RTDB.setString(&fbdo, "aquarium/alerts/temperature", "");
  }
}

```

---

## 🔥 Firebase Connection

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Under **Your apps**, find **Web API Key** - this is your `API_KEY`
5. Go to **Realtime Database** section
6. Copy the database URL - this is your `DATABASE_URL`

### 2. Create Firebase User

1. In Firebase Console, go to **Authentication**
2. Enable **Email/Password** sign-in method
3. Create a user with email and password
4. Use these credentials in your ESP32 code

### 3. Set Database Rules

Go to **Realtime Database → Rules** and set:

```json
{
  "rules": {
    "aquarium": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

---

## 🧪 Testing & Troubleshooting

### Serial Monitor Testing

1. Upload code to ESP32
2. Open Serial Monitor (115200 baud)
3. You should see:
   ```
   Connecting to WiFi....
   Connected with IP: 192.168.1.xxx
   Firebase initialized!
   Temperature: 26.5°C
   ```

### Common Issues

#### ❌ WiFi Won't Connect
- Check SSID and password
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Try moving closer to router

#### ❌ Firebase Authentication Failed
- Verify API_KEY and DATABASE_URL
- Check email/password credentials
- Ensure Authentication is enabled in Firebase Console

#### ❌ Temperature Reads -127°C
- Check DS18B20 wiring
- Verify 4.7kΩ pull-up resistor is connected
- Try different GPIO pin

#### ❌ Servo Not Moving
- Check if servo is getting 5V power
- Verify GPIO18 connection
- Test servo with example code first

#### ❌ LEDs Not Working
- Check power supply (WS2812B needs 5V)
- Verify data line connection
- Add 330Ω resistor between ESP32 and LED data pin (optional but recommended)

### Testing Commands

Use Firebase Console to manually test:

1. Go to **Realtime Database**
2. Navigate to `aquarium/commands/feedNow`
3. Set value to `true`
4. Servo should rotate immediately

---

## 📊 Monitoring

### View Real-Time Data

In Firebase Console, watch the data update:
```
aquarium/
  sensors/
    temperature: 26.5
    timestamp: 1234567890
  devices/
    lights/
      status: "ON"
      color: "#4A90E2"
```

### Web App Connection

1. Run your React app: `npm run dev`
2. Open in browser
3. Data should sync automatically between ESP32 and web app
4. Test controls from web app

---

## 🎓 Next Steps

1. **Add More Sensors**: pH sensor, water level sensor
2. **Implement Scheduling**: Use NTP for accurate time-based automation
3. **Add OTA Updates**: Update ESP32 code wirelessly
4. **Power Optimization**: Use deep sleep for battery operation
5. **Add Camera**: ESP32-CAM for live monitoring

---

## 📚 Additional Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Firebase ESP32 Library](https://github.com/mobizt/Firebase-ESP32)
- [WS2812B Guide](https://learn.adafruit.com/adafruit-neopixel-uberguide)
- [DS18B20 Tutorial](https://randomnerdtutorials.com/esp32-ds18b20-temperature-arduino-ide/)

---

**🔌 Happy Building! 🐠**
