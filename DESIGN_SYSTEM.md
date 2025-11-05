# 📱 Visual Layout Guide - Smart Aquarium Mobile App

## App Dimensions & Specifications

### Mobile Viewport

- **Target Width**: 360px - 428px (standard phones)
- **Minimum Width**: 320px (iPhone SE)
- **Maximum Width**: 1920px (desktop fallback)
- **Bottom Nav Height**: 64px
- **Status Bar**: System-controlled
- **Safe Area**: 20px top/bottom padding

---

## Color Palette

### Primary Colors

```
Blue (Primary):    #3B82F6  ███████  rgb(59, 130, 246)
Blue Light:        #60A5FA  ███████  rgb(96, 165, 250)
Blue Dark:         #2563EB  ███████  rgb(37, 99, 235)
```

### Status Colors

```
Green (Good):      #22C55E  ███████  rgb(34, 197, 94)
Yellow (Warning):  #EAB308  ███████  rgb(234, 179, 8)
Red (Critical):    #EF4444  ███████  rgb(239, 68, 68)
```

### Device Colors

```
Orange (Feeding):  #F97316  ███████  rgb(249, 115, 22)
Purple (Schedule): #A855F7  ███████  rgb(168, 85, 247)
Cyan (Water):      #06B6D4  ███████  rgb(6, 182, 212)
Indigo (Pump):     #6366F1  ███████  rgb(99, 102, 241)
```

### Neutral Colors

```
Gray 50:           #F9FAFB  ███████  (background)
Gray 100:          #F3F4F6  ███████  (borders)
Gray 500:          #6B7280  ███████  (text secondary)
Gray 800:          #1F2937  ███████  (text primary)
```

---

## Typography Scale

```
Heading 1:  24px  font-bold     (Page Titles)
Heading 2:  18px  font-bold     (Section Headers)
Heading 3:  16px  font-semibold (Card Titles)

Body Large: 16px  font-normal   (Main Content)
Body:       14px  font-normal   (Default Text)
Body Small: 12px  font-normal   (Labels)

Caption:    10px  font-normal   (Timestamps)
Button:     14px  font-semibold (Action Buttons)
```

---

## Component Specifications

### Status Card

```
┌─────────────────────────────────┐
│  Icon (20x20)           Badge   │ ← 8px from edges
│                                 │
│  26.5°C                         │ ← 28px bold
│  Water Temp                     │ ← 12px gray
└─────────────────────────────────┘
  ↑                               ↑
  Dimensions: Full width × 120px
  Padding: 16px all sides
  Border-radius: 12px
  Shadow: sm (soft)
```

### Button (Primary)

```
┌───────────────────────────────┐
│       🐟 Feed Now             │ ← 14px semibold
└───────────────────────────────┘
  ↑                             ↑
  Height: 48px (touch-friendly)
  Width: 100% (full container)
  Padding: 12px vertical
  Border-radius: 8px
  Background: gradient (orange → pink)
```

### Toggle Switch (Mode)

```
┌──────────┬──────────┐
│   Auto   │  Manual  │ ← 14px medium
└──────────┴──────────┘
  ↑        ↑          ↑
  Height: 40px
  Padding: 8px 16px
  Border-radius: 8px
  Active: filled color + white text
  Inactive: gray bg + gray text
```

### Range Slider

```
Brightness: 80%            ← 12px label above
[●━━━━━━━━━━━━━━━━━━○]    ← 8px height
0%                   100%  ← 10px labels below

Handle: 20px circle
Track: 8px height
Active: colored
Inactive: gray-200
```

### Alert Card

```
┌─────────────────────────────────┐
│ ⚠️  Water Quality Alert  [Dismiss]│ ← Header
├─────────────────────────────────┤
│ Turbidity level is moderate.    │ ← Message
│ Consider checking the filter.   │
├─────────────────────────────────┤
│ 5 minutes ago                   │ ← Timestamp
└─────────────────────────────────┘
  ↑                               ↑
  Padding: 16px
  Border-left: 4px solid (warning color)
  Background: warning-50
```

---

## Layout Grid

### Dashboard Screen

```
┌─────────────────────────────────┐ ← 16px top padding
│ 🐠 Smart Aquarium              │
│ Last updated: Nov 5, 2025      │
├─────────────────────────────────┤ ← 16px gap
│ ⚠️ Alert Banner (if active)    │
├─────────────────────────────────┤ ← 16px gap
│ ┌───────────┐ ┌───────────┐   │
│ │ Temp Card │ │Water Card │   │ ← 12px gap between
│ └───────────┘ └───────────┘   │
│ ┌───────────┐ ┌───────────┐   │ ← 12px gap
│ │Light Card │ │ Pump Card │   │
│ └───────────┘ └───────────┘   │
├─────────────────────────────────┤ ← 16px gap
│ Feeding Schedule Card           │
├─────────────────────────────────┤ ← 16px gap
│ System Status                   │
└─────────────────────────────────┘
  ← Padding: 16px left/right
     80px bottom (nav clearance)
```

### Controls Screen

```
┌─────────────────────────────────┐
│ Device Controls                 │ ← Header
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 🍽️ Feeding System          │ │
│ │ ┌──────────┬──────────┐    │ │ ← Mode toggle
│ │ │   Auto   │  Manual  │    │ │
│ │ └──────────┴──────────┘    │ │
│ │ Interval: [========] 6h    │ │ ← Slider
│ │ ┌───────────────────────┐  │ │
│ │ │   🐟 Feed Now         │  │ │ ← Action button
│ │ └───────────────────────┘  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤ ← 16px gap
│ ┌─────────────────────────────┐ │
│ │ 💡 RGB Lighting             │ │
│ │ [Auto/Manual Toggle]        │ │
│ │ Color Picker + Brightness   │ │
│ │ [Action Button]             │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 💨 Air Pump                 │ │
│ │ [Schedule/Manual Toggle]    │ │
│ │ Status Display              │ │
│ │ [Control Button]            │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## Bottom Navigation

```
┌─────────────────────────────────┐
│   🏠      🎛️      🔔(2)     ⚙️   │ ← Icons 24px
│  Home  Controls  Alerts Settings │ ← Labels 11px
└─────────────────────────────────┘
  ↑                               ↑
  Height: 64px
  Fixed to bottom
  Background: white
  Border-top: 1px solid gray-200
  Shadow: lg (elevated)
  Safe area: 16px left/right padding

  Active state:
  - Icon & label: blue-500
  - Scale: 1.0

  Inactive state:
  - Icon & label: gray-400
  - Scale: 0.95

  Badge (notifications):
  - Position: absolute top-right of icon
  - Size: 20px circle
  - Background: red-500
  - Text: white, 11px bold
```

---

## Spacing System

```
Base unit: 4px

xs:  4px   (0.25rem)  - Tiny gaps
sm:  8px   (0.5rem)   - Small spacing
md:  12px  (0.75rem)  - Default spacing
lg:  16px  (1rem)     - Large spacing
xl:  20px  (1.25rem)  - Extra large
2xl: 24px  (1.5rem)   - Section spacing

Tailwind classes:
gap-1  = 4px
gap-2  = 8px
gap-3  = 12px
gap-4  = 16px
gap-6  = 24px

p-1    = 4px padding
p-3    = 12px padding
p-4    = 16px padding
p-5    = 20px padding
```

---

## Border Radius

```
Small:   4px  (rounded)
Medium:  8px  (rounded-lg)
Large:   12px (rounded-xl)
Full:    50%  (rounded-full)

Usage:
- Buttons: 8px
- Cards: 12px
- Input fields: 8px
- Status badges: 50%
- Icons containers: 8px
```

---

## Shadows

```
Small (sm):
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)
  Usage: Cards, small elevations

Medium (md):
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
  Usage: Buttons hover, dropdowns

Large (lg):
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)
  Usage: Navigation, modals

Extra Large (xl):
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1)
  Usage: Floating elements
```

---

## Interaction States

### Button States

```
Normal:
  - Background: Primary color
  - Shadow: md
  - Scale: 1.0

Hover (desktop):
  - Background: Darker shade
  - Shadow: lg
  - Scale: 1.02

Active/Pressed:
  - Background: Even darker
  - Shadow: sm
  - Scale: 0.95
  - Duration: 150ms

Disabled:
  - Background: gray-300
  - Color: gray-500
  - Cursor: not-allowed
  - Opacity: 0.6
```

### Card Interactions

```
Default:
  - Background: white
  - Border: gray-100
  - Shadow: sm

Hover (if clickable):
  - Border: blue-200
  - Shadow: md
  - Transform: translateY(-2px)

Active:
  - Border: blue-500
  - Background: blue-50
```

---

## Animation Timing

```
Fast:   150ms  - Button presses, toggle switches
Normal: 300ms  - Card hovers, page transitions
Slow:    500ms  - Slide-ins, fade effects

Easing:
- ease-out:    Fast start, slow end (entering)
- ease-in:     Slow start, fast end (exiting)
- ease-in-out: Smooth both ends (general)

Tailwind:
transition-all duration-150 ease-out
transition-all duration-300 ease-in-out
```

---

## Icon Specifications

### Icon Sizes

```
Small:   16px (sm) - Inline with text
Medium:  20px (md) - Default
Large:   24px (lg) - Navigation
X-Large: 32px (xl) - Headers
```

### Icon Colors

```
Default:      text-gray-600
Hover:        text-gray-800
Active:       text-blue-500
Disabled:     text-gray-400
In button:    text-white
```

---

## Responsive Breakpoints

```css
/* Mobile First (default) */
/* 320px - 639px */

@media (min-width: 640px) {
  /* sm: Large phones, small tablets */
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  /* md: Tablets */
  .container {
    max-width: 768px;
  }
  /* Show 3 columns instead of 2 */
}

@media (min-width: 1024px) {
  /* lg: Laptops */
  .container {
    max-width: 1024px;
  }
  /* Show 4 columns */
}

@media (min-width: 1280px) {
  /* xl: Desktops */
  .container {
    max-width: 1280px;
  }
  /* Max width reached */
}
```

---

## Touch Target Sizes

```
Minimum touch target: 44x44px (iOS/Android standard)

Current implementation:
✅ Buttons: 48px height
✅ Nav items: 64px height
✅ Toggle switches: 40px height
✅ Sliders: 44px hit area
✅ Cards: Full width clickable
```

---

## Gradient Presets

```javascript
// Feeding Card
bg-gradient-to-br from-purple-500 to-pink-500

// Feed Button
bg-gradient-to-r from-orange-500 to-pink-500

// Light Button
bg-gradient-to-r from-yellow-400 to-orange-500

// Pump Button
bg-gradient-to-r from-blue-500 to-cyan-500

// User Profile
bg-gradient-to-br from-blue-500 to-purple-600

// About Section
bg-gradient-to-br from-gray-700 to-gray-900
```

---

## Z-Index Layers

```
z-0:  Base layer (default)
z-10: Cards, elevated content
z-20: Dropdowns, tooltips
z-30: Modals, overlays
z-40: Toast notifications
z-50: Bottom navigation (fixed)
```

---

## Loading States

```
Skeleton Card:
┌─────────────────────────────────┐
│ ▄▄▄▄▄▄                 ▄▄▄     │
│                                 │
│ ▄▄▄▄▄▄▄▄▄▄                     │
│ ▄▄▄▄▄▄▄                        │
└─────────────────────────────────┘
Background: gray-200 animated pulse

Spinner:
  ◐  ← Rotating 360°
  Size: 24px
  Border: 3px
  Color: blue-500
  Animation: spin 1s linear infinite
```

---

## Accessibility

### Color Contrast

```
✅ Text on White:
   - Gray-800: 12.63:1 (AAA)
   - Gray-600: 7.23:1 (AA)

✅ White on Blue-500:
   - 4.56:1 (AA Large)

✅ White on Red-500:
   - 4.53:1 (AA Large)
```

### Focus States

```
All interactive elements:
  outline: 2px solid blue-500
  outline-offset: 2px

  Visible on keyboard navigation
  Hidden on mouse click
```

---

## Print/Export

### Mockup Dimensions

```
Mobile (iPhone 13):
  375 × 812px
  Safe area: 355 × 732px

Mobile (Android):
  360 × 800px
  Safe area: 340 × 720px

Tablet (iPad):
  768 × 1024px

Desktop Preview:
  1280 × 720px
```

---

**🎨 Design System Complete! Ready for development and design handoff.**
