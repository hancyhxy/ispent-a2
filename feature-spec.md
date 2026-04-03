# iSpent — Feature Specification

> Complete feature definitions for all three pages, covering every CRUD state, interaction flow, and edge case.

---

## 1. Bills

### 1.1 Top Summary Area

- Monthly total expense (display size, decline color `#EF4444`)
- Monthly total income (display size, growth color `#10B981`)
- Data syncs with the global month picker

### 1.2 Record List

#### Grouping Rules

- Grouped by date, reverse chronological (newest first)
- Group header: date + daily expense subtotal + daily income subtotal

#### Single Record Display

- Left: category icon (emoji)
- Center: category name + note (note in `text_muted`)
- Right: amount (expense in decline color with `-`, income in growth color with `+`)

#### Empty State

- When no records: "No records yet. Tap + to add your first one."

#### Record Interaction

- Tap a record → open Edit Modal (see 1.4)
- No swipe-to-delete; deletion is handled inside the Edit Modal

### 1.3 Create Record (Create)

**Entry point**: "+ Add Record" button at the top-right of the page

Opens a Modal with the following sections:

#### 1.3.1 Type Selection

- Expense / Income tabs
- Defaults to Expense
- Switching tabs updates the category grid below

#### 1.3.2 Category Selection

- Icon grid layout (3–4 columns)
- Selected state: highlighted (primary color 10% background + primary color icon border)
- Required — cannot save without selecting

**Expense categories (9)**:

| Icon | Key | Name |
|------|-----|------|
| 🍕 | food | Food |
| 🛒 | shopping | Shopping |
| 🚗 | transport | Transport |
| 🎮 | entertainment | Entertainment |
| 🏠 | housing | Housing |
| 📚 | education | Education |
| 💊 | health | Health |
| 🧴 | daily | Daily |
| 💡 | other | Other |

**Income categories (5)**:

| Icon | Key | Name |
|------|-----|------|
| 💰 | salary | Salary |
| 💼 | freelance | Freelance |
| 🧧 | transfer | Transfer |
| 🔙 | refund | Refund |
| 💡 | other | Other |

#### 1.3.3 Amount Input

- Auto-focus on Modal open (useRef)
- Numeric input, supports decimals (up to 2 places)
- Required — cannot save if 0 or empty
- Prefix: `$` symbol

#### 1.3.4 Note Input

- Single-line text field, placeholder: "Add a note..."
- Optional, can be left blank
- Quick-note tags:
  - Presets: lunch / dinner / grocery / daily / transport
  - Tap a tag → auto-fills the note field
  - Manual input overrides the tag content

#### 1.3.5 Date Picker

- Defaults to today
- Tap to open a calendar date picker
- Past dates allowed, future dates disabled

#### 1.3.6 Save Actions

**"Save" button**:
- Validation passes → `POST /api/records`
- Success → Toast "Record added" + close Modal + refresh list
- Failure → Toast "Failed to save" (error color)

**"Save & Add Another" button**:
- On success, keeps the Modal open
- Clears amount and note, retains type and category selection
- Toast "Record added" + cursor returns to amount input

**Close / Cancel**:
- Tap overlay to close
- Unsaved content → no confirmation needed, close immediately (reduce friction)
- Modal close animation: fade out

#### 1.3.7 Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Category | Required | "Please select a category" |
| Amount | Required & > 0 | "Please enter a valid amount" |
| Note | Optional | — |
| Date | Required, defaults to today, no future dates | — |

### 1.4 Edit Record (Update)

**Entry point**: Tap any record in the list

Opens an Edit Modal (reuses the Create Modal structure):
- All fields pre-filled with the current record data
- Type (Expense/Income) can be switched
- Category can be reselected
- Amount can be modified
- Note can be modified
- Date can be modified

**Save**:
- "Save" → `PUT /api/records/:id`
- Success → Toast "Record updated" + close + refresh list
- Failure → Toast "Failed to update"

**Note**: Edit Modal does not have a "Save & Add Another" button

**Delete entry point**: Inside the Edit Modal (see 1.5)

### 1.5 Delete Record (Delete)

**Entry point**: "Delete" button at the bottom of the Edit Modal (error color text)

**Confirmation dialog**:
- Title: "Delete this record?"
- Content: shows a summary of the record to be deleted (category + amount + date)
- "Cancel" → closes the dialog, returns to Edit Modal
- "Delete" → `DELETE /api/records/:id`

**Result**:
- Success → Toast "Record deleted" + close Edit Modal + refresh list
- Failure → Toast "Failed to delete"

### 1.6 Data Query (Read)

**On page load**:
- `GET /api/records?month=current_month`

**On month change**:
- `GET /api/records?month=selected_month` → list and summary refresh simultaneously

**Frontend data processing**:
- Group by date
- Calculate top summary (total expense, total income)
- Sort by date descending

### 1.7 API Endpoints

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create record | POST | `/api/records` |
| Query list | GET | `/api/records?month=2026-04` |
| Update record | PUT | `/api/records/:id` |
| Delete record | DELETE | `/api/records/:id` |

### 1.8 Data Model

```json
{
  "_id": "ObjectId",
  "type": "expense | income",
  "category": "food",
  "amount": 15.00,
  "note": "Campus cafeteria",
  "date": "2026-04-03",
  "createdAt": "2026-04-03T17:44:00Z"
}
```

---

## 2. Analysis

> Display-only page — no CRUD entry points.

### 2.1 Monthly Overview Cards

4 cards in a horizontal row:

#### 2.1.1 Total Expense

- Label: "Total Expense" (caption, `text_muted`)
- Amount: display size, decline color
- Data: `sum(amount)` of all type=expense records for the current month

#### 2.1.2 Total Income

- Label: "Total Income"
- Amount: display size, growth color
- Data: `sum(amount)` of all type=income records for the current month

#### 2.1.3 Balance

- Label: "Balance"
- Amount: display size
- Positive → growth color, negative → decline color
- Calculation: total income − total expense

#### 2.1.4 Record Count

- Label: "Records"
- Value: display size, `text_primary` color
- Data: count of all records for the current month

### 2.2 Category Breakdown

#### 2.2.1 Toggle Tabs

- Expense / Income toggle
- Defaults to Expense
- Switching updates both the donut chart and the ranking list

#### 2.2.2 Donut Chart

- Wide stroke (32px+) to maintain breathing room
- Center displays total amount (e.g., "$2,408")
- Each category gets one color segment (assigned from a predefined palette)
- Hover highlights the segment + shows tooltip (category name + amount + percentage)
- Right-side legend: color swatch + category name, stacked vertically
- No data: gray empty ring + "No expense data"

#### 2.2.3 Category Ranking List

- Positioned directly below the donut chart
- Sorted by amount descending
- Each row: category icon + category name + percentage + amount
- Percentage in `text_muted`, amount in `text_primary`
- Categories with 0 amount are hidden

### 2.3 Expense Trend

#### 2.3.1 Chart Type

- Bar chart with rounded endpoints

#### 2.3.2 Data Dimensions

- X-axis: each day of the current month (1, 2, 3 ... 30)
- Y-axis: amount
- Each bar = total expense for that day
- Days with no expense have a 0-height bar (not hidden)

#### 2.3.3 Average Line

- Horizontal dashed line, labeled "Avg: $XX"
- Calculation: monthly total expense / number of elapsed days

#### 2.3.4 Interaction

- Hover a bar → tooltip shows date + daily amount
- Empty month → empty chart + "No data for this month"

#### 2.3.5 Chart Styling

- Bar color: primary
- Average line: warning color, dashed
- Axis labels: caption size, `text_muted` color

### 2.4 Income vs Expense — Optional

> Build if time permits; not a core feature.

- Chart type: grouped bar chart
- X-axis: last 6 months by name
- Two bars per month: Expense (decline color) + Income (growth color)
- Hover → tooltip shows month + both amounts
- Legend: Expense / Income

### 2.5 Data Queries

**On page load**:
- `GET /api/stats/monthly?month=current_month` → overview cards
- `GET /api/stats/categories?month=current_month&type=expense` → category breakdown
- `GET /api/stats/daily?month=current_month` → expense trend

**On month change**:
- All above endpoints re-fetched

**On Expense/Income tab switch**:
- `GET /api/stats/categories?month=current_month&type=switched_type`

**Income vs Expense (if built)**:
- `GET /api/stats/trend?months=6`

### 2.6 API Endpoints

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Monthly summary | GET | `/api/stats/monthly?month=2026-04` |
| Category stats | GET | `/api/stats/categories?month=2026-04&type=expense` |
| Daily trend | GET | `/api/stats/daily?month=2026-04` |
| Cross-month comparison | GET | `/api/stats/trend?months=6` |

---

## 3. Goals (Budget)

### 3.1 Budget List

#### 3.1.1 Card Display

One card per category budget:
- Left: category icon (emoji) + category name
- Right: spent amount / budget amount (e.g., "$320 / $500") + percentage
- Below: progress bar

#### 3.1.2 Progress Bar Color Logic

| Percentage | Color | Status |
|------------|-------|--------|
| < 70% | success `#22C55E` | Safe |
| 70% – 100% | warning `#F97316` | Warning |
| > 100% | error `#DC2626` | Overspent — overflow portion uses a deeper error shade |

#### 3.1.3 Spent Amount Calculation

- Aggregated from records: current month + matching category + type=expense → `sum(amount)`
- Not stored — calculated in real time

#### 3.1.4 Sort Order

- By percentage descending (closest to or over budget appears first)

#### 3.1.5 Empty State

- "No budgets set. Tap + to create your first budget goal."

### 3.2 Create Budget (Create)

**Entry point**: "+ Add Budget" button at the top-right of the page

Opens a Modal:

#### 3.2.1 Select Category

- Icon grid, expense categories only (9)
- Categories with an existing budget are grayed out and unselectable (one budget per category per month)
- Required

#### 3.2.2 Enter Budget Amount

- Numeric input, supports decimals (up to 2 places)
- Required & > 0
- Prefix: `$` symbol

#### 3.2.3 Month

- Automatically uses the global month picker's current month — cannot be changed independently

#### 3.2.4 Save

- "Save" → `POST /api/budgets`
- Success → Toast "Budget created" + close Modal + refresh list
- Failure → Toast "Failed to create budget"

#### 3.2.5 Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Category | Required | "Please select a category" |
| Amount | Required & > 0 | "Please enter a valid budget amount" |
| Duplicate check | Budget already exists for this month + category | Frontend: grayed out; Backend: returns 409 |

### 3.3 Edit Budget (Update)

**Entry point**: Tap a budget card

Opens an Edit Modal:
- Category displayed but not editable (read-only, with icon)
- Budget amount can be modified
- Month cannot be changed

**Save**:
- "Save" → `PUT /api/budgets/:id`
- Success → Toast "Budget updated" + close + refresh list
- Failure → Toast "Failed to update"

**Delete entry point**: Inside the Edit Modal (see 3.4)

### 3.4 Delete Budget (Delete)

**Entry point**: "Delete" button at the bottom of the Edit Modal (error color text)

**Confirmation dialog**:
- Title: "Delete this budget?"
- Content: "Remove the $500 budget for Food?"
- "Cancel" → returns to Edit Modal
- "Delete" → `DELETE /api/budgets/:id`

**Result**:
- Success → Toast "Budget deleted" + close Modal + refresh list
- Failure → Toast "Failed to delete"

### 3.5 Data Query (Read)

**On page load**:
- `GET /api/budgets?month=current_month` → budget list
- Spent amount for each budget is returned via backend aggregation

**On month change**:
- Re-fetch → budget list and progress fully updated

### 3.6 API Endpoints

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create budget | POST | `/api/budgets` |
| Query budget list | GET | `/api/budgets?month=2026-04` |
| Update budget | PUT | `/api/budgets/:id` |
| Delete budget | DELETE | `/api/budgets/:id` |

### 3.7 Data Model

```json
{
  "_id": "ObjectId",
  "category": "food",
  "budgetAmount": 500.00,
  "month": "2026-04"
}
```

---

## 4. CRUD Coverage Overview

| Operation | Bills | Analysis | Goals |
|-----------|-------|----------|-------|
| Create | Add a record (Modal) | — | Create a budget (Modal) |
| Read | Record list + summary | All charts and cards | Budget progress list |
| Update | Edit record (Modal) | — | Edit budget amount (Modal) |
| Delete | Delete record (confirmation) | — | Delete budget (confirmation) |

---

## 5. Global Behaviors

### 5.1 Month Picker

- Located at the top-right of the header bar — the sole global filter control
- Switching refreshes all data on the current page
- Defaults to the current month

### 5.2 Modal — General Rules

- Centered overlay with a frosted-glass backdrop
- Tap backdrop to close
- No unsaved-content confirmation on close

### 5.3 Toast — General Rules

- Appears at the top-right after success/failure
- Auto-dismisses (2–3 seconds)
- Success: default style; Failure: error color

### 5.4 Confirmation Dialog — General Rules

- Triggered only for delete operations
- Dialog must clearly describe what will be deleted
- Two buttons: "Cancel" + "Delete"

---

## 6. Project Structure

### 6.1 Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Header, BottomTabBar
│   │   ├── bills/           # RecordList, RecordModal, RecordItem
│   │   ├── analysis/        # OverviewCards, DonutChart, BarChart, CategoryRanking
│   │   ├── goals/           # BudgetList, BudgetCard, BudgetModal
│   │   └── shared/          # Modal, Toast, ConfirmDialog, MonthPicker, EmptyState
│   ├── hooks/               # useRecords, useBudgets, useStats, useMonthPicker
│   ├── services/            # api.js (unified fetch wrapper + error handling)
│   ├── utils/               # formatCurrency, formatDate, categoryMap
│   ├── constants/           # categories, colors, routes
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### 6.2 Backend

```
backend/
├── server.js                # Express app entry, middleware, CORS
├── db.js                    # MongoDB connection (Mongoose)
├── routes/
│   ├── records.js           # /api/records CRUD
│   ├── budgets.js           # /api/budgets CRUD
│   └── stats.js             # /api/stats/* read-only aggregations
├── models/
│   ├── Record.js            # Mongoose schema for records
│   └── Budget.js            # Mongoose schema for budgets
└── package.json
```

### 6.3 API Error Handling

**Backend** — all routes return errors in a standard format:

```json
{ "error": "Human-readable error message" }
```

With appropriate HTTP status codes: `400` (validation), `404` (not found), `409` (conflict), `500` (server error).

**Frontend** — `services/api.js` provides a unified wrapper:

- All API calls go through this module
- On success: return parsed data
- On failure: throw error with message from response body
- Components catch errors and display via Toast (never a blank screen)
