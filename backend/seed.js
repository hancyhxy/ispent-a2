require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Record = require('./models/Record');
const Budget = require('./models/Budget');
const Goal = require('./models/Goal');

const MONTH = '2026-04';

// A ready-to-use demo account so the app has data on first run
// (and reviewers can log straight in).
const DEMO_USER = {
  email: 'demo@ispent.app',
  password: 'demo1234',
  name: 'Demo User',
  role: 'user'
};

const records = [
  { type: 'expense', category: 'food', amount: 12.50, note: 'lunch', date: '2026-04-01' },
  { type: 'expense', category: 'transport', amount: 4.80, note: 'bus to campus', date: '2026-04-01' },
  { type: 'expense', category: 'food', amount: 18.00, note: 'dinner', date: '2026-04-01' },
  { type: 'income', category: 'salary', amount: 2500.00, note: 'Monthly salary', date: '2026-04-01' },
  { type: 'expense', category: 'shopping', amount: 45.99, note: 'New headphones', date: '2026-04-02' },
  { type: 'expense', category: 'food', amount: 9.50, note: 'grocery', date: '2026-04-02' },
  { type: 'expense', category: 'entertainment', amount: 15.00, note: 'Movie ticket', date: '2026-04-02' },
  { type: 'expense', category: 'food', amount: 14.00, note: 'lunch', date: '2026-04-03' },
  { type: 'expense', category: 'daily', amount: 8.90, note: 'Shampoo', date: '2026-04-03' },
  { type: 'expense', category: 'transport', amount: 35.00, note: 'Opal top-up', date: '2026-04-03' },
  { type: 'income', category: 'freelance', amount: 350.00, note: 'Logo design gig', date: '2026-04-03' },
  { type: 'expense', category: 'education', amount: 29.99, note: 'Udemy course', date: '2026-04-04' },
  { type: 'expense', category: 'food', amount: 22.00, note: 'dinner', date: '2026-04-04' },
  { type: 'expense', category: 'health', amount: 65.00, note: 'Gym membership', date: '2026-04-05' },
  { type: 'expense', category: 'food', amount: 11.00, note: 'lunch', date: '2026-04-05' },
  { type: 'expense', category: 'housing', amount: 320.00, note: 'Weekly rent', date: '2026-04-06' },
  { type: 'expense', category: 'food', amount: 55.00, note: 'grocery', date: '2026-04-06' },
  { type: 'expense', category: 'shopping', amount: 89.00, note: 'Winter jacket', date: '2026-04-07' },
  { type: 'income', category: 'transfer', amount: 200.00, note: 'From parents', date: '2026-04-07' },
  { type: 'expense', category: 'food', amount: 16.50, note: 'lunch', date: '2026-04-08' },
  { type: 'expense', category: 'entertainment', amount: 12.99, note: 'Spotify subscription', date: '2026-04-08' },
  // March data for cross-month context
  { type: 'expense', category: 'food', amount: 280.00, note: 'Monthly food total', date: '2026-03-15' },
  { type: 'expense', category: 'housing', amount: 1280.00, note: 'March rent', date: '2026-03-01' },
  { type: 'income', category: 'salary', amount: 2500.00, note: 'March salary', date: '2026-03-01' },
];

const budgets = [
  { category: 'food', budgetAmount: 500, month: MONTH },
  { category: 'transport', budgetAmount: 150, month: MONTH },
  { category: 'shopping', budgetAmount: 200, month: MONTH },
  { category: 'entertainment', budgetAmount: 100, month: MONTH },
  { category: 'housing', budgetAmount: 1400, month: MONTH },
];

// One of each goal type so all three card shapes render on first run.
const goals = [
  {
    type: 'savings', icon: '🛫', title: 'Japan Trip 2026', category: 'Travel',
    targetAmount: 5000, currentAmount: 3000, deadline: '2026-12-01'
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
    console.log('Cleared existing data');

    const hash = await bcrypt.hash(DEMO_USER.password, 10);
    const user = await User.create({ ...DEMO_USER, password: hash });
    console.log(`Created demo user: ${user.email} / ${DEMO_USER.password}`);

    const withUser = (rows) => rows.map((r) => ({ ...r, userId: user._id }));

    await Record.insertMany(withUser(records));
    console.log(`Inserted ${records.length} records`);

    await Budget.insertMany(withUser(budgets));
    console.log(`Inserted ${budgets.length} budgets`);

    await Goal.insertMany(withUser(goals));
    console.log(`Inserted ${goals.length} goals`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
