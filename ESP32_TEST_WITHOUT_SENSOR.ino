// ================================================
// ESP32 IoT Aquarium - TEST VERSION (No Sensors)
// ================================================
// This version sends SIMULATED data to test Firebase
// connection without needing hardware sensors

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
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
#define API_KEY "AIzaSyDZoH0kiII9-NzBEBGZecjjlHSaFzDiVfM"
#define DATABASE_URL "https://smart-aquarium-80c3d-default-rtdb.asia-southeast1.firebasedatabase.app"
#define USER_EMAIL "akib@gmail.com"
#define USER_PASSWORD "123123"

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

// LED state variables
bool lightStatus = false;
String lightMode = "manual";
int brightness = 80;

// Simulated temperature
float simulatedTemp = 26.5;

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 IoT Aquarium Test (No Sensors) ===");
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("✓ Connected with IP: ");
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
  
  Serial.println("✓ Firebase initialized!");
  Serial.println("\n--- Sending simulated data every 5 seconds ---\n");
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
}

// ========================
// Update Sensor Data (Simulated)
// ========================
void updateSensorData() {
  // Simulate temperature variation (25-28°C)
  simulatedTemp = 26.5 + (random(-10, 10) / 10.0);
  
  // Update temperature in Firebase
  if (Firebase.RTDB.setFloat(&fbdo, "aquarium/sensors/temperature", simulatedTemp)) {
    Serial.print("✓ Temperature: ");
    Serial.print(simulatedTemp);
    Serial.println("°C [SIMULATED]");
  } else {
    Serial.println("✗ Failed to update temperature: " + fbdo.errorReason());
  }
  
  // Update timestamp
  if (Firebase.RTDB.setInt(&fbdo, "aquarium/sensors/timestamp", millis() / 1000)) {
    Serial.println("✓ Timestamp updated");
  }
  
  Serial.println("---");
}

// ========================
// Check Firebase Commands
// ========================
void checkCommands() {
  // Check feed now command
  if (Firebase.RTDB.getBool(&fbdo, "aquarium/commands/feedNow")) {
    if (fbdo.boolData()) {
      Serial.println("\n🐟 FEED NOW command received from web app!");
      Serial.println("   (Servo would move here)");
      
      // Update last fed time
      Firebase.RTDB.setInt(&fbdo, "aquarium/devices/feeder/lastFed", millis() / 1000);
      
      // Reset command
      Firebase.RTDB.setBool(&fbdo, "aquarium/commands/feedNow", false);
      Serial.println("---\n");
    }
  }
  
  // Check light settings
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/lights/status")) {
    String newStatus = fbdo.stringData();
    if (newStatus != (lightStatus ? "ON" : "OFF")) {
      lightStatus = (newStatus == "ON");
      Serial.print("💡 Light status changed to: ");
      Serial.println(newStatus);
    }
  }
  
  if (Firebase.RTDB.getString(&fbdo, "aquarium/devices/lights/color")) {
    String color = fbdo.stringData();
    Serial.print("🎨 Light color changed to: ");
    Serial.println(color);
  }
  
  if (Firebase.RTDB.getInt(&fbdo, "aquarium/devices/lights/brightness")) {
    int newBrightness = fbdo.intData();
    if (newBrightness != brightness) {
      brightness = newBrightness;
      Serial.print("🔆 Brightness changed to: ");
      Serial.print(brightness);
      Serial.println("%");
    }
  }
}
