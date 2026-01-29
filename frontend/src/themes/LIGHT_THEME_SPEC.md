# Light Theme Specification (Admin Panel)

**Target Platform:** Native / Web Admin Panel  
**Base Style:** Clean, Modern, Slate & Orange  
**Font Family:** 'Inter', sans-serif

---

## 1. Color Palette

The light theme uses a **Slate** neutral palette with **Orange** as the primary brand color, consistent with the dark mode branding but optimized for light backgrounds.

### Brand Colors

| Token                | Hex Value                                           | Usage                                                |
| -------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| **Primary Main**     | `#F97316`                                           | Main buttons, active states, highlights (Orange 500) |
| **Primary Light**    | `#FDBA74`                                           | Hover states, secondary accents (Orange 300)         |
| **Primary Dark**     | `#EA580C`                                           | Pressed states, high contrast text (Orange 600)      |
| **Primary Gradient** | `linear-gradient(135deg, #F97316 0%, #EA580C 100%)` | Primary Actions / Call-to-Action                     |

### Secondary Colors

| Token              | Hex Value | Usage                                            |
| ------------------ | --------- | ------------------------------------------------ |
| **Secondary Main** | `#3B82F6` | Links, info states, secondary buttons (Blue 500) |
| **Success**        | `#22C55E` | Completion, positive trends (Green 500)          |
| **Warning**        | `#F59E0B` | Alerts, pending states (Amber 500)               |
| **Error**          | `#EF4444` | Deletions, critical errors (Red 500)             |

### Backgrounds & Surfaces

| Token                  | Hex Value | Description                                          |
| ---------------------- | --------- | ---------------------------------------------------- |
| **Background Default** | `#F8FAFC` | Main application background (Slate 50)               |
| **Background Paper**   | `#FFFFFF` | Cards, Sidebar, Modals, Dropdowns (White)            |
| **Surface Hover**      | `#F1F5F9` | Hover state for table rows or list items (Slate 100) |

### Text & Icons

| Token              | Hex Value | Description                               |
| ------------------ | --------- | ----------------------------------------- |
| **Text Primary**   | `#0F172A` | Headings, main body text (Slate 900)      |
| **Text Secondary** | `#64748B` | Subtitles, captions, metadata (Slate 500) |
| **Text Contrast**  | `#FFFFFF` | Text on Primary/Dark backgrounds          |
| **Icon Default**   | `#64748B` | Standard icon color (Slate 500)           |
| **Icon Active**    | `#F97316` | Active/Selected icon color                |

### Dividers & Borders

| Token              | Hex Value             | Description                     |
| ------------------ | --------------------- | ------------------------------- |
| **Divider**        | `#E2E8F0`             | Structural dividers (Slate 200) |
| **Border Subtle**  | `rgba(0, 0, 0, 0.05)` | Very subtle borders for cards   |
| **Border Default** | `#E2E8F0`             | Standard inputs and separators  |

---

## 2. Typography

**Font Family:** `'Inter', sans-serif`

| Variant       | Weight          | Size     | Line Height | Usage                            |
| ------------- | --------------- | -------- | ----------- | -------------------------------- |
| **H4**        | 800 (ExtraBold) | 2.125rem | 1.235       | Major Page Titles                |
| **H5**        | 700 (Bold)      | 1.5rem   | 1.334       | Section Headers                  |
| **H6**        | 600 (SemiBold)  | 1.25rem  | 1.6         | Card Titles                      |
| **Subtitle1** | 600 (SemiBold)  | 1rem     | 1.75        | Subsections, emphasized body     |
| **Body1**     | 400 (Regular)   | 1rem     | 1.5         | Standard copy                    |
| **Body2**     | 400 (Regular)   | 0.875rem | 1.43        | Dense copy, secondary info       |
| **Button**    | 600 (SemiBold)  | 0.875rem | 1.75        | Action labels (Case: Mixed/None) |

---

## 3. UI Component Styles

### Cards (`MuiCard`, `MuiPaper`)

Cards should have a clean, lifted look with subtle borders.

- **Background:** `#FFFFFF`
- **Border Radius:** `16px`
- **Border:** `1px solid #E2E8F0` (or `rgba(0, 0, 0, 0.05)`)
- **Shadow (Default):** `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
- **Shadow (Hover):**
  - **Transform:** `translateY(-4px)`
  - **Shadow:** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
- **Transition:** `transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out`

### Buttons (`MuiButton`)

Primary actions should pop with the brand gradient.

- **Border Radius:** `8px`
- **Padding:** `8px 20px`
- **Primary Contained:**
  - **Background:** `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`
  - **Text Color:** `#FFFFFF`
  - **Shadow:** `0 4px 6px -1px rgba(249, 115, 22, 0.4)`
  - **Hover State:** Switch gradient direction or slightly lighten; Boost shadow to `0 10px 15px -3px rgba(249, 115, 22, 0.4)`.

### Data Tables (`MuiTable`)

Clean, readable data presentation.

- **Header Background:** `#F1F5F9` (Slate 100)
- **Header Text:** `#64748B`, FontWeight 700, Uppercase, Tracking `0.05em`, Size `0.75rem`.
- **Row Border:** `1px solid #E2E8F0`
- **Cell Text:** `#334155` (Slate 700)

### Scrollbars

Custom styled scrollbars for web views to match the theme.

- **Width:** `8px`
- **Track:** `#F1F5F9`
- **Thumb:** `#CBD5E1` (Slate 300)
- **Thumb Radius:** `10px`
- **Thumb Hover:** `#94A3B8` (Slate 400)

---

## 4. Global Overrides

### Body

- **Background:** `#F8FAFC`
- **Text Color:** `#0F172A`

### Shape

- **Global Border Radius:** `12px` (Inputs, Dialogs, etc.)
