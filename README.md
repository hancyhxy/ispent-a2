# iSpent — Personal Expense Tracker

A modern, single-page finance tracker that turns daily bookkeeping into an effortless habit. Built for international students and young professionals who need a fast, intuitive way to log transactions and understand spending patterns at a glance.

## Problem

International students and young professionals juggle diverse spending categories (food, transport, tuition, entertainment) on a limited budget. Most existing tools are either too complex or too generic to provide quick, meaningful insights into where the money goes. iSpent offers a streamlined, no-account-needed experience to log, analyze, and budget daily finances.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | SPA framework with fast HMR |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Charts | Recharts | Donut chart, bar chart visualizations |
| Routing | React state-based | SPA page switching without page reloads |
| Backend | Node.js + Express | RESTful API server |
| Database | MongoDB + Mongoose | NoSQL document storage |

## Features

- Single-page application with seamless page transitions
- Full CRUD operations for expense/income records and budget goals
- Date-grouped transaction list with daily subtotals
- Category-based spending analysis with interactive donut chart
- Daily expense trend bar chart with average line
- Monthly budget goals with color-coded progress tracking
- Global month picker to filter all data across pages
- Responsive design — desktop sidebar, mobile bottom tab bar
- Keyboard accessible with ARIA-compliant components
- Toast notifications for all user actions
- Input validation on both client and server side

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Header, BottomTabBar
│   │   ├── bills/           # BillsPage, RecordList, RecordItem, RecordModal
│   │   ├── analysis/        # AnalysisPage, OverviewCards, DonutChart, BarChart, CategoryRanking
│   │   ├── goals/           # GoalsPage, BudgetList, BudgetCard, BudgetModal
│   │   └── shared/          # Modal, Toast, ConfirmDialog, MonthPicker, EmptyState
│   ├── hooks/               # useRecords, useBudgets, useStats
│   ├── services/            # api.js — unified fetch wrapper
│   ├── utils/               # formatCurrency, formatDate, getGreeting
│   └── constants/           # categories, chart colors
├── index.html
└── vite.config.js

backend/
├── server.js                # Express entry, CORS, JSON parser
├── db.js                    # MongoDB connection
├── routes/
│   ├── records.js           # /api/records CRUD
│   ├── budgets.js           # /api/budgets CRUD + spent aggregation
│   └── stats.js             # /api/stats/* read-only analytics
├── models/
│   ├── Record.js            # Mongoose schema
│   └── Budget.js            # Mongoose schema with compound unique index
└── seed.js                  # Sample data for demo
```

## Challenges Overcome

Building a cohesive SPA without React Router required managing page state and shared month-picker context at the App level, ensuring all child pages re-fetch data when the month changes. The budget progress feature was challenging because spent amounts are not stored — they are calculated in real time by aggregating expense records from MongoDB, which required designing an efficient aggregation pipeline that joins data across the Records and Budgets collections. Implementing the responsive layout with three breakpoints (mobile bottom tab bar, tablet icon-only sidebar, desktop full sidebar) using Tailwind CSS utility classes demanded careful conditional styling without CSS duplication. The modal system needed to work as both a centered overlay on desktop and a bottom sheet on mobile, while maintaining focus trapping and keyboard accessibility across both modes.
