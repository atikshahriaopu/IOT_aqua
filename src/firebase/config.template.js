// Firebase configuration template
// Copy this to src/firebase/config.js and add your Firebase credentials

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// Get these values from Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Authentication
export const auth = getAuth(app);

// Database references
export const sensorRef = ref(database, "aquarium/sensors");
export const devicesRef = ref(database, "aquarium/devices");
export const alertsRef = ref(database, "aquarium/alerts");
export const commandsRef = ref(database, "aquarium/commands");

// Helper functions for database operations
export const updateSensorData = (data) => {
  return update(sensorRef, data);
};

export const updateDeviceStatus = (device, status) => {
  return update(ref(database, `aquarium/devices/${device}`), status);
};

export const sendCommand = (command, value) => {
  return update(commandsRef, { [command]: value, timestamp: Date.now() });
};

export const createAlert = (alert) => {
  const alertId = `alert_${Date.now()}`;
  return set(ref(database, `aquarium/alerts/${alertId}`), {
    ...alert,
    timestamp: Date.now(),
    active: true,
  });
};

// Authentication helpers
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export default app;
