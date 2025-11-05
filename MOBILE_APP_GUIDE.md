# 🐠 Smart Aquarium Mobile App - User Guide

## Overview

A mobile-first IoT application for managing and monitoring your smart aquarium system. Built with React, Tailwind CSS, and designed for optimal mobile experience.

---

## 📱 App Features

### 1. **Dashboard (Home)**

The main control center showing real-time aquarium status:

- **Water Temperature Monitor**
  - Live temperature display with status indicator (Cold/Optimal/Hot)
  - Color-coded status badges
- **Water Quality Indicator**
  - Real-time turbidity sensor readings
  - Quality status: Good (Green), Moderate (Yellow), Bad (Red)
- **Device Status Cards**
  - RGB LED lighting status
  - Air pump oxygenation status
- **Feeding Schedule**
  - Last feeding time
  - Next scheduled feeding countdown
- **System Status**
  - ESP32 connection status
  - Firebase synchronization
  - Auto mode indicators

### 2. **Controls**

Comprehensive device control panel:

#### 🍽️ Feeding System

- **Automatic Mode**
  - Set feeding interval (1-24 hours)
  - Automated servo motor control
  - Schedule-based feeding
- **Manual Mode**
  - "Feed Now" instant button
  - Adjustable portion control

#### 💡 RGB Lighting

- **Auto Day/Night Cycle**
  - Programmable sunrise/sunset times
  - Natural light simulation
- **Manual Control**
  - Color picker with custom colors
  - Preset color palette (Red, Green, Blue, Yellow, Magenta, Cyan)
  - Brightness slider (0-100%)
  - Emergency red alert mode for poor water quality

#### 💨 Air Pump (Oxygenation)

- **Scheduled Mode**
  - Configurable on/off cycles
  - Default: 10 min ON every hour
- **Manual Control**
  - Direct start/stop control
  - Real-time pump status display

### 3. **Alerts & Notifications**

Comprehensive alert management system:

- **Active Buzzer Control**
  - Visual and audio alerts for critical conditions
  - One-tap buzzer stop and reset
- **Push Notifications**
  - Toggle on/off for device notifications
  - Water quality warnings
  - Temperature alerts
  - Feeding completion notifications
- **Alert Categories**
  - Critical (Red): Immediate attention required
  - Warning (Yellow): Check soon
  - Info (Blue): Status updates
- **Alert History**
  - Timestamped alert logs
  - Dismiss individual alerts
  - Clear all active alerts button
- **Threshold Settings**
  - Customizable temperature range
  - Turbidity threshold configuration

### 4. **Settings**

System configuration and management:

#### 👤 User Profile

- Account information display
- Secure Firebase authentication
- Logout functionality

#### 📡 Connection Status

- ESP32 device connection (with IP address)
- Firebase realtime sync status
- Internet connectivity
- Test connection button

#### ⏰ Automation Schedules

- **Light Schedule**
  - Set start time (sunrise)
  - Set end time (sunset)
  - Automatic day/night cycle
- **Pump Schedule**
  - Operation duration (minutes)
  - Repeat interval (minutes)
  - Visual schedule summary

#### 🔧 Device Management

- Restart ESP32
- View system logs
- Calibrate sensors
- Factory reset option

#### ℹ️ System Information

- App version
- Device ID
- Firmware version
- Last update timestamp
- Data points collected

---

## 🎨 UI/UX Features

### Mobile-First Design

- **Optimized for touchscreens** with large tap targets
- **Responsive grid layouts** that adapt to screen size
- **Bottom navigation** for easy one-handed use
- **Pull-to-refresh** capability (future enhancement)

### Visual Design Elements

- **Color-coded status indicators**

  - Green: Good/Optimal
  - Yellow: Warning/Moderate
  - Red: Critical/Bad
  - Blue: Info/Normal operation

- **Gradient backgrounds** for featured cards
- **Smooth animations** and transitions
- **Shadow effects** for depth perception
- **Icon-based navigation** for intuitive use

### Accessibility

- High contrast ratios
- Clear typography hierarchy
- Touch-friendly button sizes (minimum 44x44px)
- Visual feedback for all interactions

---

## 📊 Real-Time Data Flow

```
ESP32 Sensors → Firebase Realtime DB → React App → UI Updates
                                    ↓
User Actions → React App → Firebase → ESP32 Actuators
```

### Data Points Monitored:

1. Water temperature (°C)
2. Turbidity level (NTU)
3. Light status (ON/OFF)
4. Pump status (ON/OFF)
5. Feeding logs
6. Alert events

---

## 🔔 Alert System Logic

### Water Quality Alerts

- **Good (< 20 NTU)**: Normal LED colors
- **Moderate (20-30 NTU)**: LED turns red + app notification
- **Bad (> 30 NTU)**: LED stays red + continuous buzzer + push alert

### Temperature Alerts

- **Cold (< 24°C)**: Blue indicator + notification
- **Optimal (24-28°C)**: Green indicator
- **Hot (> 28°C)**: Red indicator + notification

### System Alerts

- ESP32 disconnection
- Firebase sync failure
- Feeding system errors
- Sensor calibration needed

---

## 🚀 Quick Start Guide

### First Time Setup

1. **Login** with Firebase credentials
2. **Check connection status** in Settings
3. **Configure schedules** for lights and pump
4. **Set alert thresholds** for temperature and turbidity
5. **Enable push notifications** for alerts

### Daily Usage

1. Open app to view **Dashboard** status
2. Check water quality and temperature
3. Use **Controls** for manual operations
4. Review **Alerts** for any issues
5. Adjust **Settings** as needed

### Maintenance Mode

1. Stop all automation (switch to Manual mode)
2. Perform aquarium maintenance
3. Reset alerts after cleaning
4. Re-enable automation
5. Monitor status for 24 hours

---

## 📱 Navigation Bar

Bottom navigation with 4 main sections:

| Icon       | Section   | Badge | Purpose                |
| ---------- | --------- | ----- | ---------------------- |
| 🏠 Home    | Dashboard | -     | Real-time monitoring   |
| 🎛️ Sliders | Controls  | -     | Device control         |
| 🔔 Bell    | Alerts    | Count | Notifications & alerts |
| ⚙️ Gear    | Settings  | -     | Configuration          |

---

## 🎯 Key Interactions

### Tap Actions

- **Status cards**: View detailed information
- **Control buttons**: Toggle device states
- **Alert cards**: Dismiss or view details
- **Schedule inputs**: Adjust timing

### Swipe Actions (Future)

- Swipe alert cards to dismiss
- Pull down to refresh data
- Swipe between tabs

### Long Press (Future)

- Long press on status cards for history
- Long press controls for advanced options

---

## 🔒 Security Features

- **Firebase Authentication**: Secure user login
- **Read/Write Rules**: Owner-only access
- **HTTPS Communication**: Encrypted data transfer
- **Session Management**: Auto-logout on inactivity

---

## 📈 Performance Optimizations

- **Real-time updates** every 5 seconds
- **Lazy loading** for components
- **Optimized re-renders** with React hooks
- **Minimal bundle size** with tree shaking
- **Fast initial load** with code splitting

---

## 🐛 Troubleshooting

### Connection Issues

1. Check WiFi connection
2. Verify ESP32 is powered on
3. Test connection in Settings
4. Restart ESP32 device

### Alert Not Working

1. Enable notifications in Settings
2. Check alert thresholds
3. Verify Firebase sync
4. Clear browser cache

### Controls Not Responding

1. Check connection status
2. Switch between Auto/Manual modes
3. Refresh the app
4. Check Firebase permissions

---

## 🔮 Future Enhancements

- [ ] Historical data charts
- [ ] Water change reminders
- [ ] Fish health tracking
- [ ] Multiple aquarium support
- [ ] Voice control integration
- [ ] Offline mode with sync
- [ ] Share access with family members
- [ ] Integration with smart home systems

---

## 📞 Support

For technical issues or feature requests:

- Check system logs in Settings
- Review connection status
- Reset to factory defaults if needed
- Contact: owner@aquarium.com

---

**Made with ❤️ for Aquarium Enthusiasts**
_Powered by ESP32, Firebase & React_
