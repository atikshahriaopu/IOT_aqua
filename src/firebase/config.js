import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDZoH0kiII9-NzBEBGZecjjlHSaFzDiVfM",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "smart-aquarium-80c3d.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://smart-aquarium-80c3d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smart-aquarium-80c3d",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "smart-aquarium-80c3d.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "269008492561",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:269008492561:web:0453c65d0d32e04be639b0",
};

// Initialize Firebase
console.log("🔄 Initializing Firebase...");
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
console.log("✅ Firebase Initialized:", app);

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
