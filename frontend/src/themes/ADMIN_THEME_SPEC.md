# Admin Panel Theme Specification

**Target Platform:** Native / Web Admin Panel  
**Design System:** "Gym Management" Design System  
**Font Family:** `'Inter', sans-serif`

This document provides a comprehensive specification for both **Dark** (Default) and **Light** themes. The system relies on a shared set of typography and layout tokens, with distinct color palettes for each mode.

---

## 1. Global Design Tokens (Shared)

These values apply to **both** themes.

### Typography

| Variant       | Weight          | Size (px/rem)   | Level           |
| ------------- | --------------- | --------------- | --------------- |
| **H4**        | 800 (ExtraBold) | 34px / 2.125rem | Page Titles     |
| **H5**        | 700 (Bold)      | 24px / 1.5rem   | Section Headers |
| **H6**        | 600 (SemiBold)  | 20px / 1.25rem  | Card Titles     |
| **Subtitle1** | 600 (SemiBold)  | 16px / 1rem     | Sub-headers     |
| **Body1**     | 400 (Regular)   | 16px / 1rem     | Main Text       |
| **Button**    | 600 (SemiBold)  | 14px / 0.875rem | Actions         |

### Shapes & Spacing

- **Base Border Radius:** `12px` (General UI elements)
- **Card Border Radius:** `16px`
- **Button Border Radius:** `8px`
- **Scrollbar Width:** `8px` (Thumb Radius: `10px`)

---

## 2. Dark Theme (Current Default)

Based on `darkDashboardTheme.js`

### Color Palette (Dark)

| Token                  | Hex Value                   | Description                        |
| ---------------------- | --------------------------- | ---------------------------------- |
| **Background Default** | `#0b0f19`                   | Deepest blue/black main background |
| **Background Paper**   | `#151c2c`                   | Navy blue for cards/surfaces       |
| **Text Primary**       | `#ffffff`                   | Pure white for headings/body       |
| **Text Secondary**     | `#94a3b8`                   | Muted slate for metadata           |
| **Primary Main**       | `#fb923c`                   | Orange accent (Orange 400)         |
| **Primary Light**      | `#fdba74`                   | Lighter orange (Orange 300)        |
| **Primary Dark**       | `#ea580c`                   | Darker orange (Orange 600)         |
| **Secondary Main**     | `#4dabf7`                   | Blue accent                        |
| **Divider**            | `rgba(255, 255, 255, 0.08)` | Subtle separators                  |

### Component Styles (Dark)

- **Cards:**
  - Bg: `#151c2c`
  - Border: `1px solid rgba(255, 255, 255, 0.05)`
  - Shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)` (Hover: Increased shadow + Lift)

- **Buttons (Primary):**
  - Gradient: `linear-gradient(135deg, #fb923c 0%, #f97316 100%)`
  - Shadow: `0 4px 14px 0 rgba(251, 146, 60, 0.39)`
  - Text: `#ffffff`

- **Tables:**
  - Header Bg: `rgba(255, 255, 255, 0.02)`
  - Header Text: `#94a3b8` (Uppercase)
  - Row Border: `1px solid rgba(255, 255, 255, 0.05)`

---

## 3. Light Theme

Proposed specification for "Light Mode" toggle.

### Color Palette (Light)

| Token                  | Hex Value | Description                                              |
| ---------------------- | --------- | -------------------------------------------------------- |
| **Background Default** | `#F8FAFC` | Slate 50 (Very light gray/white)                         |
| **Background Paper**   | `#FFFFFF` | Pure White for cards                                     |
| **Text Primary**       | `#0F172A` | Slate 900 (Deep navy/black)                              |
| **Text Secondary**     | `#64748B` | Slate 500 (Medium grey)                                  |
| **Primary Main**       | `#F97316` | Orange 500 (Slightly darker than dark mode for contrast) |
| **Primary Light**      | `#FDBA74` | Orange 300                                               |
| **Primary Dark**       | `#EA580C` | Orange 600                                               |
| **Secondary Main**     | `#3B82F6` | Blue 500                                                 |
| **Divider**            | `#E2E8F0` | Slate 200                                                |

### Component Styles (Light)

- **Cards:**
  - Bg: `#FFFFFF`
  - Border: `1px solid #E2E8F0`
  - Shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`

- **Buttons (Primary):**
  - Gradient: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`
  - Shadow: `0 4px 6px -1px rgba(249, 115, 22, 0.4)`
  - Text: `#FFFFFF`

- **Tables:**
  - Header Bg: `#F1F5F9` (Slate 100)
  - Header Text: `#64748B`
  - Row Border: `1px solid #E2E8F0`

---

## 4. Theme Token Mapping (For Native Devs)

Use this mapping to switch themes programmatically.

| Semantic Name    | Dark Mode Value          | Light Mode Value |
| ---------------- | ------------------------ | ---------------- |
| `bg_screen`      | `#0b0f19`                | `#F8FAFC`        |
| `bg_surface`     | `#151c2c`                | `#FFFFFF`        |
| `text_primary`   | `#ffffff`                | `#0F172A`        |
| `text_secondary` | `#94a3b8`                | `#64748B`        |
| `border_subtle`  | `rgba(255,255,255,0.05)` | `#E2E8F0`        |
| `primary_main`   | `#fb923c`                | `#F97316`        |
| **Scroll Track** | `#0b0f19`                | `#F1F5F9`        |
| **Scroll Thumb** | `#1e293b`                | `#CBD5E1`        |
