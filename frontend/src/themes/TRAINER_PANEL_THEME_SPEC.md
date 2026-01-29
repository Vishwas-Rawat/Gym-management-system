# Trainer Panel Theme Specification

**Target Platform:** Native / Web Trainer Panel
**Design System:** "Gym Management" Design System
**Font Family:** `'Inter', system-ui, sans-serif`

This document provides a comprehensive specification for both **Dark** (Default) and **Light** themes for the Trainer Panel. It focuses on dashboard consistency, data visualization (workouts/diets), and form controls.

---

## 1. Global Design Tokens (Shared)

These values apply to **both** themes to ensure structural consistency.

### Typography

| Variant           | Weight          | Level                   |
| :---------------- | :-------------- | :---------------------- |
| **Page Title**    | 900 (Black)     | Main Page Headers       |
| **Section Title** | 800 (ExtraBold) | Card/Section Headers    |
| **Subtitle**      | 500 (Medium)    | Descriptions            |
| **Body**          | 400 (Regular)   | Standard Text           |
| **Label**         | 700 (Bold)      | Form Labels (Uppercase) |

### Shapes & Spacing

- **Base Padding:** System Responsive Default
- **Card Border Radius:** Large Rounded
- **Input Border Radius:** Standard Rounded
- **Button Border Radius:** Standard Rounded
- **Grid Gap:** System Responsive Default

---

## 2. Dark Theme (Default)

The native dark mode, optimized for low-light environments and "dashboard" feel.

### Color Palette (Dark)

| Token                | Hex/Value                                           | Description                      |
| :------------------- | :-------------------------------------------------- | :------------------------------- |
| **Background Main**  | `#0f172a`                                           | Deep Slate (Main Screen Bg)      |
| **Background Card**  | `#111827` (`var(--db-card)`)                        | Dark Gray/Blue for containers    |
| **Input Background** | `rgba(0,0,0,0.2)`                                   | Semi-transparent dark for inputs |
| **Text Primary**     | `#e5e7eb`                                           | Light Gray (High contrast text)  |
| **Text Secondary**   | `#94a3b8`                                           | Muted Slate (Subtitles, Labels)  |
| **Border**           | `#1f2933` (`var(--db-border)`)                      | Subtle borders                   |
| **Primary Gradient** | `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)` | Blue 500 -> Blue 600 (Actions)   |
| **Text Gradient**    | `linear-gradient(to right, #38bdf8, #818cf8)`       | Sky -> Indigo (Titles)           |

### Component Styles (Dark)

- **Cards:**
  - Border: `1px solid var(--db-border)`
  - Shadow: None (Flat look)
- **Inputs:**
  - Border: `1px solid var(--db-border)`
  - Placeholder: `#475569`
  - Focus: `border-color: var(--db-blue)`, `box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1)`
- **Buttons (Primary):**
  - Solid blue gradient
  - Text: White
  - Hover: Increased shadow

---

## 3. Light Theme

Activated via class `.light-theme`. Offers a clean, high-contrast "paper" aesthetic.

### Color Palette (Light)

| Token                | Hex/Value                                     | Description                                 |
| :------------------- | :-------------------------------------------- | :------------------------------------------ |
| **Background Main**  | `#f8fafc`                                     | Slate 50 (Very light paper white)           |
| **Background Card**  | `#ffffff`                                     | Pure White                                  |
| **Input Background** | `#f8fafc`                                     | Light Slate                                 |
| **Text Primary**     | `#0f172a`                                     | Deep Navy (High legibility)                 |
| **Text Secondary**   | `#475569`                                     | Slate 600 (Darker than dark mode secondary) |
| **Border**           | `rgba(0,0,0,0.1)`                             | Very subtle gray                            |
| **Primary Gradient** | No change (Blue Gradient)                     | Consistent branding                         |
| **Text Gradient**    | `linear-gradient(to right, #0ea5e9, #4f46e5)` | Slightly darker Sky -> Indigo               |

### Component Styles (Light)

- **Cards:**
  - Border: `1px solid rgba(0,0,0,0.05)`
  - Shadow: `0 10px 30px -10px rgba(0,0,0,0.05)` (Soft ambient shadow)
- **Inputs:**
  - Bg: `#f8fafc`
  - Border: `rgba(0,0,0,0.1)`
- **Lists/Items:**
  - Hover Bg: `#f1f5f9` (Slate 100)
- **Buttons:**
  - Shadow: `0 4px 6px -1px rgba(0,0,0,0.1)`

---

## 4. Theme Token Implementation Guide

Use CSS variables to handle theming dynamically.

```css
:root {
  /* Default (Dark) */
  --bg-main: #0f172a;
  --db-card: #111827;
  --db-text-primary: #e5e7eb;
  --db-text-secondary: #94a3b8;
  --db-border: #1f2933;
}

.light-theme {
  /* Light Overrides */
  --bg-main: #f8fafc;
  --db-card: #ffffff;
  --db-text-primary: #0f172a;
  --db-text-secondary: #475569;
  --db-border: rgba(0, 0, 0, 0.1);
}
```

### Usage Example

```css
.card {
  background: var(--db-card);
  color: var(--db-text-primary);
  border: 1px solid var(--db-border);
}
```

---

## 5. Background Assets

Share these image references with the native team.

| Theme              | Context      | Asset Name                   | Description                            |
| :----------------- | :----------- | :--------------------------- | :------------------------------------- |
| **Dark (Default)** | Login / Hero | `gym_background.png`         | Dark gym interior for auth screens     |
| **Dark (Default)** | Dashboard    | `gymkro_modern_light_bg.png` | Abstract modern bg (used with overlay) |
| **Light**          | All Screens  | `gym_light_background.png`   | Light/White texture background         |
