# iSpent — Design System

> A modern, casual-feeling finance tracker that makes daily bookkeeping feel as effortless as sending a message. The interface uses emoji-based category icons, generous whitespace, and soft rounded surfaces to turn a traditionally heavy financial task into a light, everyday habit. Beneath the youthful, approachable surface sits a structured, data-precise layout — card-based dashboards, clear typographic hierarchy, and borderless depth layering — preserving the professional rigor users expect from a finance tool. Inspired by the immediacy of mobile journaling apps, adapted for a web dashboard context.

---

## 1. Design Principles

1. **Breathe** — Use whitespace to separate, not lines. Cards have 24px+ padding, sections are 32px apart.
2. **Layer, don't border** — Depth comes from background color shifts (`surface` → `card_surface`), not from borders or shadows.
3. **Round everything** — Minimum 16px radius for small components, 24px for cards. No sharp corners.
4. **Data first** — Every visual element serves a data purpose. No decorative illustrations or ornamental icons.

---

## 2. Color System

### 2.1 Core Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#4B6EF5` (Modern Blue) | Brand color, primary buttons, active nav state |
| `secondary` | `#FFD147` (Gold Yellow) | Emphasis, salary/income-related categories |
| `tertiary` | `#9333EA` (Deep Purple) | Accent, non-core expenses or special categories |

### 2.2 Data State Colors

| Token | Value | Usage |
|-------|-------|-------|
| `growth` | `#10B981` (Emerald Green) | Income, upward trends |
| `decline` | `#EF4444` (Coral Red) | Expense, downward trends |

### 2.3 Semantic State Colors

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#22C55E` | Goal achieved, save success |
| `error` | `#DC2626` | Payment failed, form errors |
| `warning` | `#F97316` (Bright Orange) | Budget warning (70%–100%), low balance |

### 2.4 Neutrals & Text

| Token | Value | Usage |
|-------|-------|-------|
| `text_primary` | `#111827` (Slate Black) | Headings, body text |
| `text_secondary` | `#4B5563` (Dark Gray) | Secondary information |
| `text_muted` | `#9CA3AF` (Light Gray) | Auxiliary labels, chart axis labels |
| `border` | `#E5E7EB` (Soft Gray) | Used only for accessibility needs, at 15% opacity |
| `surface` | `#F8F9FA` | Global background canvas |
| `card_surface` | `#FFFFFF` | Card/container background |

### 2.5 "No-Line" Rule

**Do not use 1px solid borders to divide regions.** Boundaries are expressed through background color contrast: white cards (`#FFFFFF`) on a gray canvas (`#F8F9FA`) create natural layering. For high-contrast accessibility support, use the `border` token at 15% opacity.

### 2.6 Gradients & Frosted Glass

- **CTA buttons**: Subtle linear gradient from `primary` (`#4B6EF5`) to a slightly lighter blue
- **Floating elements**: `#FFFFFF` at 80% opacity + `backdrop-blur: 20px` frosted glass effect (for Modal overlays, Tooltips)

---

## 3. Typography

Global font: **Inter**

### 3.1 Headings — Guide Visual Focus

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 36px | Bold | 1.2 | Hero text, greeting "Good Morning", key monetary figures |
| `h1` | 24px | SemiBold | 1.4 | Section titles "Finance Overview", page titles |
| `h2` | 20px | SemiBold | 1.5 | Secondary titles within cards |

### 3.2 Body — Core Content

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `body-primary` | 16px | Medium | 1.6 | Primary data values, list item names |
| `body-secondary` | 14px | Regular | 1.6 | Descriptive text, secondary information |
| `caption` | 12px | Medium | 1.4 | Timestamps, small labels, unit annotations, chart axis labels |

### 3.3 Interactive — Functional Actions

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `button-text` | 14px | SemiBold | Button labels, emphasizing actions |
| `nav-label` | 14px | Medium | Navigation menu labels |

### 3.4 Text Color Rules

- Never use pure black `#000000`
- Headings / primary body: `text_primary` (`#111827`)
- Secondary information: `text_secondary` (`#4B5563`)
- Auxiliary labels: `text_muted` (`#9CA3AF`)

---

## 4. Spacing System

Based on an **8px grid**, with 4px and 12px fine-tuning:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro spacing |
| `sm` | 8px | Compact spacing |
| `md` | 12px | Vertical padding inside buttons |
| `lg` | 16px | List item spacing (replaces dividers) |
| `xl` | 24px | Card inner padding (standard) |
| `2xl` | 32px | Section spacing, Modal inner padding |
| `3xl` | 48px | Major section spacing |
| `4xl` | 64px | Page top/bottom margin |

### Padding Specs

| Component | Padding |
|-----------|---------|
| Card | 24px (`xl`) |
| Modal / Drawer | 32px (`2xl`) |
| Button | 12px 24px (`md` vertical, `xl` horizontal) |
| Section gap | 32px (`2xl`) |

---

## 5. Shape & Shadow

### Border Radius

| Component | Radius |
|-----------|--------|
| Main cards / large containers | 24px |
| Buttons, inputs, small components | 16px |
| Pill (full round) | 9999px (search bar, tags) |

**Minimum radius: 8px. No sharp corners.**

### Shadows

| Context | Value |
|---------|-------|
| Static cards | No shadow — layering via surface/card_surface color contrast |
| Floating elements (Modal/Dropdown) | `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)` |

---

## 6. Layout Framework

### 6.1 Overall Structure

```
┌────────┬─────────────────────────────────────┐
│  Logo  │  Good Morning          April 2026 ▼ │
│  (MT)  │  3rd April, 2026       (Month Picker)│
├────────┼─────────────────────────────────────┤
│        │                                     │
│  📋    │                                     │
│ Bills  │         Main Content Area           │
│        │                                     │
│  📊    │                                     │
│Analysis│                                     │
│        │                                     │
│  🎯    │                                     │
│ Goals  │                                     │
│        │                                     │
└────────┴─────────────────────────────────────┘
```

### 6.2 Left Sidebar Navigation

- Fixed width, no divider lines
- Top: Logo "MT"
- 3 primary menu items: Bills / Analysis / Goals
- **Active state**: Soft rounded background block (primary at 10% opacity) + primary color icon
- Inactive state: `text_muted` color icon

### 6.3 Top Header Bar

- Left: Dynamic greeting + date
  - 05:00–11:59 → Good Morning
  - 12:00–17:59 → Good Afternoon
  - 18:00–04:59 → Good Evening
  - Date format: `3rd April, 2026`
- Right: **Month Picker** (the sole global filter control)
- **Not included**: ~~Search~~, ~~Avatar~~, ~~Notifications~~, ~~Login/Sign-up~~

### 6.4 Month Picker

- Global state — switching updates data across all pages
- Defaults to the current month
- Affects: Bills records, Analysis charts, Goals progress

---

## 7. Global Interactions

### Modal

- Centered overlay with frosted-glass backdrop
- 32px inner padding, 24px border radius
- Tap backdrop to close

### Toast

- Appears at the top-right after an action
- Auto-dismisses (2–3 seconds)

### Confirmation Dialog

- Required for all delete operations
- Must clearly describe the item to be deleted

### Empty State

- Display guiding copy when there is no data
- Use `text_muted` color

---

## 8. Page Overview

| Page | Route | CRUD |
|------|-------|------|
| Bills | `/` (default) | C / R / U / D records |
| Analysis | `/analysis` | R statistics |
| Goals | `/goals` | C / R / U / D budgets |

SPA — page switches preserve the current month selection.

---

## 9. Responsive Design

### 9.1 Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `sm` | 640px | Small phones |
| `md` | 768px | Tablets / large phones |
| `lg` | 1024px | Desktops |

### 9.2 Mobile (<768px)

- **Navigation**: Sidebar hidden → Bottom Tab Bar (3 icons + labels, fixed to bottom)
- **Header**: Hide greeting text, show only Month Picker (centered)
- **Cards**: Full-width, single-column stack
- **Analysis charts**: Full-width, vertical stack (overview cards → donut → bar chart)
- **Modals**: Bottom sheet style — slides up from bottom, full-width, max-height 90vh
- **Category grid**: 4 columns (compact)
- **Touch targets**: Minimum 44×44px

### 9.3 Tablet (768px–1023px)

- **Navigation**: Sidebar collapses to icon-only mode (56px width)
- **Header**: Full display
- **Cards**: 2-column grid where applicable
- **Modals**: Centered overlay (same as desktop)

### 9.4 Desktop (≥1024px)

- Current design: full sidebar (200px) + content area

---

## 10. Accessibility

### 10.1 Color Contrast

- All text/background combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Verified combinations:
  - `text_primary` (#111827) on `card_surface` (#FFFFFF) → 17.4:1 ✅
  - `text_muted` (#9CA3AF) on `card_surface` (#FFFFFF) → 3.0:1 — use only for non-essential labels
  - `decline` (#EF4444) on `card_surface` (#FFFFFF) → 4.6:1 ✅

### 10.2 Focus States

- All interactive elements (buttons, inputs, links, cards, nav items) must show a visible focus ring
- Style: `outline: 2px solid primary` with `outline-offset: 2px`
- Focus ring must not be clipped by `overflow: hidden`

### 10.3 Keyboard Navigation

- Logical tab order: Sidebar → Header → Main Content
- Modal: focus trap (Tab cycles within Modal, Escape closes)
- Confirmation Dialog: focus lands on "Cancel" button by default
- Category grid: arrow key navigation

### 10.4 ARIA

| Component | Attributes |
|-----------|-----------|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Confirmation Dialog | `role="alertdialog"` |
| Nav items | `aria-current="page"` on active item |
| Charts | `aria-label` with text summary (e.g., "Donut chart: Food 40%, Transport 25%...") |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |

### 10.5 Motion

- Respect `prefers-reduced-motion`: disable transitions and animations when set to `reduce`

---

## 11. Do's & Don'ts

### Do

- Use asymmetric layouts (e.g., wide + narrow cards side by side)
- Use semantic colors to indicate rising/falling trends
- Maintain at least 24px padding inside cards
- Replace dividers with whitespace (16px gap between list items)
- Use rounded endpoints on bar chart columns
- Use wide strokes (32px+) for donut charts

### Don't

- No pure black `#000000` text
- No 1px solid divider lines
- No sharp corners (minimum 8px radius)
- No shadows on static content
