# "Members" Page - Light Theme Specification (Native)

Based on the current admin panel design, this document specifies the exact light theme styling for the "All Members" page for native implementation.

---

## Page Structure

### 1. Background Layer

- **Base Background Color:** `#F8FAFC` (Slate 50)
- **Hero Image:** Blurred gym environment photo with people working out
  - Overlay: `rgba(255, 255, 255, 0.75)` to maintain light theme
  - Position: Full background or top 40% of screen
  - Blur: `8-12px`

---

## 2. Header (Top Navigation Bar)

**Container:**

- Background: `#FFFFFF` with subtle shadow
- Shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Padding: `16px 24px`

**Logo (Left Side):**

- Text: "**MEMBERS** PANEL"
- "MEMBERS" color: `#0F172A` (Slate 900)
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

---

## 3. Control Panel Section

**Container:**

- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border Radius: `16px`
- Padding: `20px 24px`
- Shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Margin: `24px`

**Left Side - "All Members" Info:**

- Icon: Orange users icon
  - Color: `#F97316`
  - Background: `#FED7AA` (Orange 200), `border-radius: 8px`, padding `8px`
  - Size: 20px
- Heading: "All Members"
  - Color: `#0F172A` (Slate 900)
  - Font Weight: 700
  - Font Size: 18px
- Sub-text: "2 Active records"
  - Color: `#64748B` (Slate 500)
  - Font Size: 13px

**Center - Filters:**

1. **Gym Dropdown:**
   - Background: `#F8FAFC` (Slate 50)
   - Border: `1px solid #E2E8F0`
   - Border Radius: `8px`
   - Padding: `10px 16px`
   - Text: `#475569` (Slate 600)
   - Font Size: 14px
   - Icon: Chevron down in `#64748B`

2. **Search Input:**
   - Background: `#F8FAFC` (Slate 50)
   - Border: `1px solid #E2E8F0`
   - Border Radius: `8px`
   - Padding: `10px 16px 10px 40px`
   - Placeholder: "Filter name, email..." in `#94A3B8` (Slate 400)
   - Text: `#0F172A`
   - Icon: Search/filter icon in `#64748B`, left side

**Right Side - Add Button:**

- Background: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`
- Text: "+ Add Member" in `#FFFFFF`
- Font Weight: 600
- Padding: `10px 20px`
- Border Radius: `8px`
- Shadow: `0 4px 6px -1px rgba(249, 115, 22, 0.4)`
- Icon: Plus (+) in white, 16px

---

## 4. Members Table

**Table Container:**

- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border Radius: `12px`
- Margin: `24px`
- Overflow: Hidden (for rounded corners)

### Table Header

**Container:**

- Background: `#F1F5F9` (Slate 100)
- Border Bottom: `1px solid #E2E8F0`
- Padding: `16px 24px`

**Column Headers:**

- Text: "MEMBER DETAILS", "PLAN", "WORKOUT", "ACTIONS"
- Color: `#64748B` (Slate 500)
- Font Weight: 700
- Font Size: 12px
- Letter Spacing: `0.05em`
- Text Transform: Uppercase

### Table Rows

**Row Container:**

- Background: `#FFFFFF`
- Border Bottom: `1px solid #E2E8F0`
- Padding: `20px 24px`
- Hover State:
  - Background: `#F8FAFC`
  - Transition: `background-color 0.15s ease`

**Member Details Column:**

1. **Avatar:**
   - Size: 40px diameter circle
   - Background: `#FED7AA` (Orange 200)
   - Icon: User silhouette in `#F97316`

2. **Contact Info (stacked):**
   - Email:
     - Color: `#0F172A` (Slate 900)
     - Font Size: 14px
     - Font Weight: 500
   - Phone:
     - Color: `#64748B` (Slate 500)
     - Font Size: 13px

**Plan Column:**

- Badge(s) displayed as pills
- Background: `#DBEAFE` (Blue 100)
- Text: `#1E40AF` (Blue 800)
- Border Radius: `6px`
- Padding: `4px 12px`
- Font Size: 12px
- Font Weight: 600
- Example: "6 MONTHS", "6 MONTHS + 1 FREE"

**Workout Column:**

- Badge(s) displayed as pills
- Background: `#DBEAFE` (Blue 100)
- Text: `#1E40AF` (Blue 800)
- Border Radius: `6px`
- Padding: `4px 12px`
- Font Size: 12px
- Font Weight: 600
- Time range: "6:30 AM to 9:45 AM"
- Color: `#475569` (Slate 600)

**Actions Column:**

Action icons arranged horizontally:

1. **View Icon (Eye):**
   - Color: `#64748B` (Slate 500)
   - Size: 20px
   - Hover: `#475569` (Slate 600)

2. **Edit Icon (Pencil):**
   - Color: `#64748B` (Slate 500)
   - Size: 20px
   - Hover: `#F97316` (Orange)

3. **Payment Icon (Dollar):**
   - Color: `#22C55E` (Green 500)
   - Size: 20px
   - Hover: `#16A34A` (Green 600)

4. **Delete Icon (Trash):**
   - Color: `#64748B` (Slate 500)
   - Size: 20px
   - Hover: `#EF4444` (Red 500)

Spacing between icons: `12px`

---

## 5. Empty State

If no members exist:

- Icon: Large user-plus icon in `#CBD5E1` (Slate 300)
- Heading: "No members yet" in `#64748B`
- Sub-text: "Add your first member to get started" in `#94A3B8`
- CTA Button: Same style as "+ Add Member"

---

## Color Reference Summary

| Element                 | Light Theme Color |
| ----------------------- | ----------------- |
| Page Background         | `#F8FAFC`         |
| Card/Table Background   | `#FFFFFF`         |
| Table Header Background | `#F1F5F9`         |
| Row Hover               | `#F8FAFC`         |
| Primary Text            | `#0F172A`         |
| Secondary Text          | `#64748B`         |
| Metadata Text           | `#475569`         |
| Primary Brand           | `#F97316`         |
| Border                  | `#E2E8F0`         |
| Badge Background        | `#DBEAFE`         |
| Badge Text              | `#1E40AF`         |
| Success/Payment         | `#22C55E`         |
| Error/Delete            | `#EF4444`         |
