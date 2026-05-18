<p align="center">
  <img src="screenshots/00-banner.png" alt="iSpent Banner" width="100%" />
</p>

# iSpent — Goal-Driven Personal Expense Tracker

A modern, single-page finance tracker that turns daily bookkeeping into an effortless habit. iSpent pairs frictionless transaction logging with a goal-driven board, so every entry visibly moves the user toward a savings target, a spending limit, or a financial to-do.

<p align="center">
  <img src="screenshots/flow.png" alt="iSpent App Flow" width="100%" />
</p>

<p align="center">
  <img src="screenshots/web.gif" alt="iSpent Web Demo" width="100%" />
</p>

## The Problem It Solves

International students and young professionals juggle diverse spending categories (food, transport, tuition, entertainment) on a limited budget. Most tools are either too complex or too generic to give quick, meaningful insight into where the money goes — and the typical "log → look at a report" loop gives no sense of *progress*, so users stop logging after a few days.

iSpent attacks both halves of that problem:

- **Frictionless logging** — adding a transaction takes a few seconds, with per-category quick-note tags so common entries need no typing.
- **A reason to come back** — every record feeds a **Goal** card (savings / spending-limit / financial to-do), so the user always sees forward momentum, not just a static balance.

It is a multi-user web app: each account's data is fully isolated, and an **admin** role can manage all accounts and review a cross-user activity log.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | SPA framework with fast HMR |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Charts | Recharts | Donut chart and bar chart visualizations |
| Routing | React state-based | SPA page switching without page reloads |
| Auth | JWT + bcryptjs | Stateless token auth, hashed passwords |
| Backend | Node.js + Express | RESTful API server |
| Database | MongoDB + Mongoose | NoSQL document storage |

## Core Entities (CRUD)

iSpent applies full Create / Read / Update / Delete operations across **four** conceptual entities:

| Entity | Description | Access |
|--------|-------------|--------|
| **user** | Account with `user` / `admin` role | Self (register/login); admin manages all |
| **record** | An income or expense transaction | Owner only, scoped by `userId` |
| **goal** | A savings target, spending limit, or financial to-do card | Owner only |
| **user_activity** | Append-only audit log of logins, logouts, and CRUD actions | Admin read-only |

## Key Features

- **Authentication** — email-first register / login, passwords hashed with bcrypt, stateless JWT (7-day expiry), automatic logout on token expiry.
- **Per-user data isolation** — every record / goal / budget query is scoped by `userId`; a user can never read or mutate another user's data (guards against IDOR).
- **Admin dashboard** — admins get an extra tab to list all accounts, promote/demote roles, delete a user (cascade-deletes their data), and review an activity log filterable by user.
- **Live search** — the Bills and Goals pages filter results in real time as the user types, entirely client-side for instant feedback.
- **Full CRUD** — records (income/expense) and goals (three card types) with create / edit / delete flows and confirmation dialogs.
- **Analysis** — category donut chart, daily expense-trend bar chart with an average line, monthly overview cards.
- **SPA experience** — one `index.html`; pages swap via React state, no full reloads; a global month picker re-fetches the active page's data.
- **Responsive** — desktop sidebar, tablet icon rail, mobile bottom tab bar, accessible (ARIA, keyboard, focus management).
- **Robust error handling** — a single fetch wrapper surfaces every API/network failure as a toast; the UI never shows a blank screen on error; input validated on both client and server.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
MONGODB_URI=mongodb://localhost:27017/ispent
PORT=3001
JWT_SECRET=replace-with-a-long-random-string
```

Seed sample data (creates demo + admin accounts) and start the server:

```bash
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173> in a browser.

### Demo Accounts

`npm run seed` creates two ready-to-use accounts:

| Role | Email | Password |
|------|-------|----------|
| User | `demo@ispent.app` | `demo1234` |
| Admin | `admin@ispent.app` | `admin1234` |

Log in as the admin to see the **Admin** tab (user management + activity log).

### Database Export

A database export is provided at `backend/data/sample-data.json` — the same records, budgets, goals, and seed activity used by `seed.js`.

## Folder Structure

```
ispent-a2/
├── frontend/                  # React + Vite single-page app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Header, BottomTabBar (role-aware nav)
│   │   │   ├── auth/          # AuthPage — email-first login / register
│   │   │   ├── bills/         # BillsPage, RecordList/Item/Modal, QuickNoteManager
│   │   │   ├── analysis/      # AnalysisPage, OverviewCards, DonutChart, BarChart, CategoryRanking
│   │   │   ├── goals/         # GoalsPage, GoalCard/FormModal, BudgetCard/List/Modal
│   │   │   ├── admin/         # AdminPage — user management + activity log
│   │   │   └── shared/        # Modal, Toast, ConfirmDialog, MonthPicker, EmptyState
│   │   ├── hooks/             # useAuth, useAdmin, useRecords, useBudgets, useGoals, useStats, useQuickNotes
│   │   ├── services/          # api.js — unified fetch wrapper + 401 handling
│   │   ├── utils/             # currency/date helpers
│   │   └── constants/         # categories, chart colors
│   ├── index.html
│   └── vite.config.js
│
├── backend/                   # Express + MongoDB REST API
│   ├── server.js              # App entry, CORS, route mounting, auth gating
│   ├── db.js                  # MongoDB (Mongoose) connection
│   ├── middleware/
│   │   └── auth.js            # requireAuth (JWT verify) + requireAdmin (role gate)
│   ├── routes/
│   │   ├── auth.js            # register / login / logout / me
│   │   ├── records.js         # /api/records CRUD
│   │   ├── budgets.js         # /api/budgets CRUD + spent aggregation
│   │   ├── goals.js           # /api/goals CRUD (three goal types)
│   │   ├── stats.js           # /api/stats/* read-only analytics
│   │   └── admin.js           # /api/admin/* — users + activity (admin only)
│   ├── models/
│   │   ├── User.js            # Account schema (role: user | admin)
│   │   ├── Record.js          # Transaction schema (scoped by userId)
│   │   ├── Budget.js          # Budget schema, compound unique index
│   │   ├── Goal.js            # Goal schema — savings / spending_limit / simple_todo
│   │   └── UserActivity.js    # Audit-log schema + logActivity() helper
│   ├── data/
│   │   └── sample-data.json   # Database export
│   └── seed.js                # Seeds demo + admin accounts and sample data
│
├── feature-spec.md            # Full CRUD flows, endpoints, data models
├── design-system.md           # Visual design specification
└── README.md
```

## Security Notes

- Passwords are hashed with bcrypt (cost 10); plaintext is never stored or returned.
- JWT is signed with a server-side secret read from `.env` (not committed; `.env` is git-ignored).
- Every business route runs behind `requireAuth`; admin routes additionally run behind `requireAdmin`. The frontend hiding the Admin tab for non-admins is a UX nicety only — access is enforced server-side.
- An admin cannot delete or demote their own account, preventing the system from being locked out of all admin access.

## Workload Allocation

This assignment was originally registered as a two-person group (Xinyi Han and a teammate). It was subsequently **approved for individual submission** by the subject coordinator (confirmed by Xianzhi Wang via email, 15 May 2026). As an approved individual submission, the group component is assessed as an individual component per the assignment specification.

**All source code, design, documentation, and the demo recording were written solely by Xinyi Han.** Authorship is traceable through the Git commit history (incremental, meaningfully-messaged commits throughout — not a single bulk upload) and via `/* Author: Xinyi */` header comments on the entity files added for Assignment 2.

| Area | Author |
|------|--------|
| Project scaffold (React + Vite + Express + MongoDB) | Xinyi Han |
| Auth (JWT, bcrypt, email-first flow, per-user isolation) | Xinyi Han |
| Records / Budgets / Goals entities + CRUD (front & back) | Xinyi Han |
| `user_activity` entity + admin dashboard | Xinyi Han |
| Analysis charts, responsive layout, shared components | Xinyi Han |
| README, feature spec, design system, demo recording | Xinyi Han |

## Notes on Technical Choices

- **SPA without React Router** — page state and the shared month picker live at the `App` level; child pages re-fetch when the month changes. Kept the dependency surface small for a project this size.
- **`useState` vs `useRef`** — form fields use `useState` (need re-render); the amount input's auto-focus uses `useRef` (DOM access without re-render).
- **Real-time aggregation, not stored totals** — budget `spent` and spending-limit progress are computed on read via a MongoDB aggregation pipeline over the user's records, so they can never drift out of sync with the underlying transactions.
- **Audit log as its own collection** — `user_activity` is append-only and high-volume, so it is a separate collection rather than an array on `User`, keeping user reads cheap and the admin view paginatable. Logging is fire-and-forget: an audit-write failure can never turn a successful CRUD operation into an error.
