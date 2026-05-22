/* Author: Xinyi */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Record = require('./models/Record');
const Budget = require('./models/Budget');
const Goal = require('./models/Goal');
const UserActivity = require('./models/UserActivity');

// Anchor all seed data on the *current* month so demo data and the
// spending-limit goals (which track the current calendar month, see
// routes/goals.js periodRange) always line up — open the app and the
// data, the budgets, and the limit cards are all in the same month.
const pad = (n) => String(n).padStart(2, '0');
const NOW = new Date();
const THIS_Y = NOW.getFullYear();
const THIS_M = NOW.getMonth() + 1;            // 1-based
const MONTH = `${THIS_Y}-${pad(THIS_M)}`;     // e.g. "2026-05"

// Day in the current month -> "YYYY-MM-DD" (clamped to a safe 1..28 range
// so it is valid in every month, February included).
const d = (day) => `${MONTH}-${pad(Math.min(day, 28))}`;

// Same day, one month back — for the cross-month context rows that the
// Analysis page uses to compare against last month.
const PREV = new Date(THIS_Y, THIS_M - 2, 1); // THIS_M is 1-based; -2 => prev month
const PREV_MONTH = `${PREV.getFullYear()}-${pad(PREV.getMonth() + 1)}`;
const pd = (day) => `${PREV_MONTH}-${pad(Math.min(day, 28))}`;

// A ready-to-use demo account so the app has data on first run
// (and reviewers can log straight in).
const DEMO_USER = {
  email: 'demo@ispent.app',
  password: 'demo1234',
  name: 'Demo User',
  role: 'user'
};

// An admin account so reviewers can log in and see the admin dashboard
// (user management + activity log) without any manual DB editing.
const ADMIN_USER = {
  email: 'admin@ispent.app',
  password: 'admin1234',
  name: 'Admin',
  role: 'admin'
};

const records = [
  { type: 'expense', category: 'food', amount: 12.50, note: 'lunch', date: d(1) },
  { type: 'expense', category: 'transport', amount: 4.80, note: 'bus to campus', date: d(1) },
  { type: 'expense', category: 'food', amount: 18.00, note: 'dinner', date: d(1) },
  { type: 'income', category: 'salary', amount: 2500.00, note: 'Monthly salary', date: d(1) },
  { type: 'expense', category: 'shopping', amount: 45.99, note: 'New headphones', date: d(2) },
  { type: 'expense', category: 'food', amount: 9.50, note: 'grocery', date: d(2) },
  { type: 'expense', category: 'entertainment', amount: 15.00, note: 'Movie ticket', date: d(2) },
  { type: 'expense', category: 'food', amount: 14.00, note: 'lunch', date: d(3) },
  { type: 'expense', category: 'daily', amount: 8.90, note: 'Shampoo', date: d(3) },
  { type: 'expense', category: 'transport', amount: 35.00, note: 'Opal top-up', date: d(3) },
  { type: 'income', category: 'freelance', amount: 350.00, note: 'Logo design gig', date: d(3) },
  { type: 'expense', category: 'education', amount: 29.99, note: 'Udemy course', date: d(4) },
  { type: 'expense', category: 'food', amount: 22.00, note: 'dinner', date: d(4) },
  { type: 'expense', category: 'health', amount: 65.00, note: 'Gym membership', date: d(5) },
  { type: 'expense', category: 'food', amount: 11.00, note: 'lunch', date: d(5) },
  { type: 'expense', category: 'housing', amount: 320.00, note: 'Weekly rent', date: d(6) },
  { type: 'expense', category: 'food', amount: 55.00, note: 'grocery', date: d(6) },
  { type: 'expense', category: 'shopping', amount: 89.00, note: 'Winter jacket', date: d(7) },
  { type: 'income', category: 'transfer', amount: 200.00, note: 'From parents', date: d(7) },
  { type: 'expense', category: 'food', amount: 16.50, note: 'lunch', date: d(8) },
  { type: 'expense', category: 'entertainment', amount: 12.99, note: 'Spotify subscription', date: d(8) },
  // Previous-month data for cross-month context on the Analysis page
  { type: 'expense', category: 'food', amount: 280.00, note: 'Monthly food total', date: pd(15) },
  { type: 'expense', category: 'housing', amount: 1280.00, note: 'Last month rent', date: pd(1) },
  { type: 'income', category: 'salary', amount: 2500.00, note: 'Last month salary', date: pd(1) },
];

const budgets = [
  { category: 'food', budgetAmount: 500, month: MONTH },
  { category: 'transport', budgetAmount: 150, month: MONTH },
  { category: 'shopping', budgetAmount: 200, month: MONTH },
  { category: 'entertainment', budgetAmount: 100, month: MONTH },
  { category: 'housing', budgetAmount: 1400, month: MONTH },
];

// Savings deadline ~6 months out from today, so the card's "N months
// left" stays sensible no matter when the seed is run.
const SIX_MONTHS = new Date(THIS_Y, THIS_M - 1 + 6, 1);
const DEADLINE = `${SIX_MONTHS.getFullYear()}-${pad(SIX_MONTHS.getMonth() + 1)}-01`;

// One of each goal type so all three card shapes render on first run.
const goals = [
  {
    type: 'savings', icon: '🛫', title: `Japan Trip ${SIX_MONTHS.getFullYear()}`, category: 'Travel',
    targetAmount: 5000, currentAmount: 3000, deadline: DEADLINE
  },
  {
    type: 'spending_limit', icon: '🍱', title: 'Eating Out', category: 'Food',
    targetAmount: 400, limitCategory: 'food', period: 'monthly'
  },
  {
    type: 'simple_todo', icon: '📊', title: 'Research one ETF before tax season',
    category: 'Investing', done: false
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Record.deleteMany({});
    await Budget.deleteMany({});
    await Goal.deleteMany({});
    await UserActivity.deleteMany({});
    console.log('Cleared existing data');

    const hash = await bcrypt.hash(DEMO_USER.password, 10);
    const user = await User.create({ ...DEMO_USER, password: hash });
    console.log(`Created demo user: ${user.email} / ${DEMO_USER.password}`);

    const adminHash = await bcrypt.hash(ADMIN_USER.password, 10);
    const admin = await User.create({ ...ADMIN_USER, password: adminHash });
    console.log(`Created admin user: ${admin.email} / ${ADMIN_USER.password}`);

    const withUser = (rows) => rows.map((r) => ({ ...r, userId: user._id }));

    await Record.insertMany(withUser(records));
    console.log(`Inserted ${records.length} records`);

    await Budget.insertMany(withUser(budgets));
    console.log(`Inserted ${budgets.length} budgets`);

    await Goal.insertMany(withUser(goals));
    console.log(`Inserted ${goals.length} goals`);

    // A few seed activity rows so the admin dashboard has something to
    // show on first run. Real activity accrues automatically afterwards
    // as users log in and perform CRUD.
    const now = Date.now();
    const minutesAgo = (m) => new Date(now - m * 60000);
    const activities = [
      { userId: user._id, userEmail: user.email, action: 'login', entity: 'auth', detail: '', createdAt: minutesAgo(120) },
      { userId: user._id, userEmail: user.email, action: 'create', entity: 'record', detail: 'expense $12.50 (food)', createdAt: minutesAgo(118) },
      { userId: user._id, userEmail: user.email, action: 'create', entity: 'goal', detail: 'savings: Japan Trip 2026', createdAt: minutesAgo(110) },
      { userId: user._id, userEmail: user.email, action: 'update', entity: 'record', detail: 'expense $18.00 (food)', createdAt: minutesAgo(95) },
      { userId: user._id, userEmail: user.email, action: 'logout', entity: 'auth', detail: '', createdAt: minutesAgo(90) },
      { userId: admin._id, userEmail: admin.email, action: 'login', entity: 'auth', detail: '', createdAt: minutesAgo(15) },
    ];
    await UserActivity.insertMany(activities);
    console.log(`Inserted ${activities.length} activity log entries`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
