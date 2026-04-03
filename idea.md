# iSpent

> A modern, casual-feeling finance tracker that turns daily bookkeeping into an effortless habit — youthful and approachable on the surface, structured and data-precise underneath.

---

## Problem

International students and young professionals juggle diverse spending categories (food, transport, tuition, entertainment) on a limited budget. Most existing tools are either too complex or too generic to provide quick, meaningful insights into where the money goes.

## Target User

International students and young working professionals who need a fast, intuitive way to log daily transactions and understand their spending patterns at a glance.

## Solution

iSpent is a single-page web application that combines quick transaction logging, visual spending analysis, and category-based budget tracking in a modern, approachable interface. No accounts, no clutter — just open and start tracking.

---

## Core Pages

| Page | Purpose |
|------|---------|
| **Bills** | Log income and expenses, view transaction history grouped by date |
| **Analysis** | Visualize spending breakdown (donut chart), daily trends (bar chart), and monthly summary |
| **Goals** | Set monthly budgets per category, track progress with color-coded progress bars |

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | React + Vite | Fast dev server, course-approved |
| Styling | Tailwind CSS | Utility-first, rapid UI development |
| Charts | Recharts | React-native charting, donut + bar charts |
| Backend | Node.js + Express | Unified JS stack front-to-back |
| Database | MongoDB | Flexible schema, JSON-friendly |

---

## Course Knowledge Mapping (Week 1-7)

This project integrates all core topics from Week 1 through Week 7:

### Week 1 — Semantic HTML & CSS Layouts

| Topic | Application |
|-------|-------------|
| CSS Box Model | Card components, list items, modal spacing |
| `box-sizing: border-box` | Global consistent layout calculation |
| External CSS + class binding | Tailwind utility classes via className |
| Responsive layout | Sidebar + content area adapts to viewport |

### Week 2 — JavaScript & Interactive Logic

| Topic | Application |
|-------|-------------|
| DOM selection | React's virtual DOM abstraction |
| Content modification | JSX dynamic rendering |
| Style/class toggling | Category selection highlight, nav active state |
| Element creation/removal | Adding/removing records in the list |
| Event handling | onClick, onChange, onSubmit across all forms |
| Form validation | Amount > 0, category required, date validation |

### Week 3 — React Fundamentals

| Topic | Application |
|-------|-------------|
| Conditional rendering | Empty states, modal show/hide |
| List rendering (`map` + `key`) | Transaction list, category grid, budget list |
| Event handlers | All button and form interactions |
| `useState` | Current page, form inputs, modal state, selected month |
| Controlled components | All form inputs bound to state |
| Props | Parent-child data flow across components |

### Week 4 — Advanced React Hooks

| Topic | Application |
|-------|-------------|
| `useEffect` data fetching | Load records/budgets/stats from API |
| `useEffect` dependency array | Re-fetch on month change, `[]` for initial load |
| `useRef` DOM access | Auto-focus amount input in modal |
| `useState` vs `useRef` | Form state (re-render) vs focus (no re-render) |

### Week 5 — Python & FastAPI Foundations

| Topic | Application |
|-------|-------------|
| RESTful API design | CRUD endpoint patterns applied to Express |
| HTTP methods | GET/POST/PUT/DELETE for records and budgets |
| Request body & path params | POST body for new records, `:id` for update/delete |
| Data validation | Input validation on both client and server |
| Error handling | 400/404/409/500 status codes |

> Note: Course demos use Python + FastAPI; project uses Node.js + Express with identical API design principles.

### Week 6 — Data Persistence: SQL

| Topic | Application |
|-------|-------------|
| Database concepts (DBMS, CRUD) | Why persistent storage over in-memory arrays |
| SQL CRUD operations | MongoDB equivalents: find/insertOne/updateOne/deleteOne |
| Connect → Query → Close | MongoDB connection lifecycle in Express |
| ORM concepts | Mongoose Schema/Model as MongoDB ORM |
| Data model design | Record and Budget document field definitions |

### Week 7 — Data Persistence: NoSQL (MongoDB)

| Topic | Application |
|-------|-------------|
| Collection & Document | `records` and `budgets` collections |
| CRUD operations | insertOne, find, updateOne, deleteOne |
| Query filters ($gte, $lte) | Date range filtering for monthly views |
| Query filters ($eq, $in) | Category filtering for stats |
| Logical operators ($and) | Combined category + date filtering |
| Async/await | All database operations in Express routes |
| Schema-free flexibility | Easy to add fields (e.g., payment method) later |

---

## Document Index

| Document | Purpose |
|----------|---------|
| [`design-system.md`](./design-system.md) | Visual design specification: colors, typography, spacing, layout, components |
| [`feature-spec.md`](./feature-spec.md) | Feature specification: complete CRUD flows, API endpoints, data models, edge cases |
| [`rubric.md`](./rubric.md) | Assignment grading criteria |
