# "My Gyms" Page - Light Theme Specification (Native)

Based on the current admin panel design, this document specifies the exact light theme styling for the "My Gyms" page for native implementation.

---

## Page Structure

### 1. Background Layer

- **Base Background Color:** `#F8FAFC` (Slate 50)
- **Hero Image:** Blurred gym environment photo with a subtle white overlay
  - Overlay: `rgba(255, 255, 255, 0.75)` to maintain light theme while showing gym context
  - Position: Cover the top 40-50% of the screen
  - Blur: `8-12px`

---

## 2. Header (Top Navigation Bar)

**Container:**

- Background: `#FFFFFF` with subtle shadow
- Shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Padding: `16px 24px`

**Logo (Left Side):**

- Text: "**GYMS** PANEL"
- "GYMS" color: `#0F172A` (Slate 900)
- "PANEL" color: `#F97316` (Orange 500)
- Font Weight: 700
- Font Size: 20px

**Right Side:**

- **Theme Toggle Icon:**
  - Color: `#64748B` (Slate 500)
  - Icon: Moon/Sun
  - Size: 24px
- **User Profile Badge:**
  - "Administrator" text: `#F97316` (Orange 500), weight 600
  - "SYSTEM ADMIN" text: `#64748B` (Slate 500), weight 400, size 12px
  - Avatar: Circular, 40px diameter
  - Background: Orange gradient or user photo

---

## 3. Page Title Section

**Container:**

- Background: Transparent (over hero image)
- Padding: `32px 24px`

**"My Gyms" Heading:**

- Color: `#0F172A` (Slate 900)
- Font Size: 32px
- Font Weight: 800
- Position: Left aligned

**"+ Add New Gym" Button:**

- Position: Top right
- Background: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`
- Text: `#FFFFFF`
- Font Weight: 600
- Padding: `12px 24px`
- Border Radius: `8px`
- Shadow: `0 4px 6px -1px rgba(249, 115, 22, 0.4)`
- Icon: Plus (+) in white, 16px

---

## 4. Gym Cards (Grid Layout)

**Grid Container:**

- Columns: 2 cards per row (desktop), 1 card (mobile)
- Gap: `24px`
- Padding: `24px`

### Individual Card Styling

**Card Container:**

- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border Radius: `16px`
- Padding: `20px`
- Shadow (Default): `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Shadow (Hover): `0 10px 15px -3px rgba(0, 0, 0, 0.1)` + `translateY(-4px)`
- Transition: `all 0.2s ease-in-out`

**Card Header:**

- Icon: Orange dumbbell/gym icon
  - Color: `#F97316`
  - Size: 20px
  - Background: `#FED7AA` (Orange 200) with `border-radius: 8px`, padding `8px`
- Gym Name:
  - Color: `#0F172A` (Slate 900)
  - Font Weight: 600
  - Font Size: 18px
  - Margin Top: 12px

**Card Details (Info Rows):**
Each row contains an icon + text:

- Icon Color: `#64748B` (Slate 500)
- Icon Size: 16px
- Text Color: `#475569` (Slate 600)
- Font Size: 14px
- Line Height: 1.8

Example rows:

1. 📍 Address (location icon)
2. 📞 Phone (phone icon)
3. ✉️ Email (mail icon)
4. 🕒 Hours (clock icon)

**Card Actions (Bottom):**

- Container: Flex row, right-aligned
- Gap: `16px`

- **Edit Icon:**
  - Color: `#F97316` (Orange)
  - Size: 20px
  - Background: `#FFF7ED` (Orange 50) circle, 36px diameter
  - Hover: Darken to `#EA580C`

- **Delete Icon:**
  - Color: `#EF4444` (Red 500)
  - Size: 20px
  - Background: `#FEF2F2` (Red 50) circle, 36px diameter
  - Hover: Darken to `#DC2626`

---

## 5. Empty State (No Gyms)

If no gyms exist:

- Icon: Large gym/plus icon in `#CBD5E1` (Slate 300)
- Text: "No gyms added yet" in `#64748B`
- CTA Button: Same style as "+ Add New Gym"

---

## Color Reference Summary

| Element         | Light Theme Color |
| --------------- | ----------------- |
| Page Background | `#F8FAFC`         |
| Card Background | `#FFFFFF`         |
| Primary Text    | `#0F172A`         |
| Secondary Text  | `#64748B`         |
| Metadata Text   | `#475569`         |
| Primary Brand   | `#F97316`         |
| Border          | `#E2E8F0`         |
| Error/Delete    | `#EF4444`         |
