/* Author: Xinyi */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Goal = require('../models/Goal');
const Record = require('../models/Record');
const { logActivity } = require('../models/UserActivity');

// Resolve the [start, end) date strings for a spending_limit period,
// anchored on today. Weekly = last 7 days; monthly = current calendar
// month; yearly = current calendar year.
function periodRange(period) {
  const now = new Date();
  const y = now.getFullYear();
  const pad = (n) => String(n).padStart(2, '0');

  if (period === 'weekly') {
    const past = new Date(now);
    past.setDate(now.getDate() - 6);
    const start = `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())}`;
    const end = `${y}-${pad(now.getMonth() + 1)}-${pad(now.getDate() + 1)}`;
    return { start, end };
  }
  if (period === 'yearly') {
    return { start: `${y}-01-01`, end: `${y + 1}-01-01` };
  }
  // monthly (default)
  const m = now.getMonth() + 1;
  const start = `${y}-${pad(m)}-01`;
  const end = m === 12 ? `${y + 1}-01-01` : `${y}-${pad(m + 1)}-01`;
  return { start, end };
}

// Attach a computed `spent` to spending_limit goals by aggregating the
// user's expense records in that category over the current period.
// Other types return as-is. Keeps progress real-time and unstored,
// mirroring how budgets compute spent (feature-spec.md §3.1.3).
async function withProgress(goal, userId) {
  const g = goal.toObject ? goal.toObject() : goal;
  if (g.type !== 'spending_limit') return g;

  const { start, end } = periodRange(g.period || 'monthly');
  const agg = await Record.aggregate([
    {
      $match: {
        // aggregate() skips Mongoose casting — convert to ObjectId explicitly
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        category: g.limitCategory,
        date: { $gte: start, $lt: end }
      }
    },
    { $group: { _id: null, spent: { $sum: '$amount' } } }
  ]);
  return { ...g, spent: agg.length ? agg[0].spent : 0 };
}

// Validate the type-specific fields. Returns an error string or null.
function validateGoal({ type, title, targetAmount, limitCategory }) {
  if (!type || !title) return 'Type and title are required';
  if (!['savings', 'spending_limit', 'simple_todo'].includes(type)) {
    return 'Type must be savings, spending_limit, or simple_todo';
  }
  if (type === 'savings' && (!targetAmount || targetAmount <= 0)) {
    return 'A savings goal needs a target amount greater than 0';
  }
  if (type === 'spending_limit') {
    if (!targetAmount || targetAmount <= 0) {
      return 'A spending limit needs an amount greater than 0';
    }
    if (!limitCategory) {
      return 'A spending limit needs a category to track';
    }
  }
  return null;
}

// Create goal
router.post('/', async (req, res) => {
  try {
    const err = validateGoal(req.body);
    if (err) return res.status(400).json({ error: err });

    const { type, title, icon, category, targetAmount, deadline,
            limitCategory, period } = req.body;

    const goal = await Goal.create({
      userId: req.user.id,
      type,
      title,
      icon: icon || undefined,
      category: category || '',
      targetAmount: type === 'simple_todo' ? undefined : targetAmount,
      deadline: type === 'savings' ? (deadline || '') : '',
      limitCategory: type === 'spending_limit' ? limitCategory : '',
      period: type === 'spending_limit' ? (period || 'monthly') : undefined
    });

    logActivity({
      userId: req.user.id,
      action: 'create',
      entity: 'goal',
      detail: `${goal.type}: ${goal.title}`
    });
    res.status(201).json(await withProgress(goal, req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// List the user's goals (newest first), with live progress computed
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const result = await Promise.all(goals.map((g) => withProgress(g, req.user.id)));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Update goal — only fields that make sense for the goal's type are applied.
// Scoped by userId so a user can never mutate another user's goal.
router.put('/:id', async (req, res) => {
  try {
    const { title, icon, category, targetAmount, currentAmount,
            deadline, limitCategory, period, done, archived } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    if (title !== undefined) goal.title = title;
    if (icon !== undefined) goal.icon = icon;
    if (category !== undefined) goal.category = category;
    if (archived !== undefined) goal.archived = archived;

    if (goal.type === 'savings') {
      if (targetAmount !== undefined) goal.targetAmount = targetAmount;
      if (currentAmount !== undefined) goal.currentAmount = currentAmount;
      if (deadline !== undefined) goal.deadline = deadline;
    } else if (goal.type === 'spending_limit') {
      if (targetAmount !== undefined) goal.targetAmount = targetAmount;
      if (limitCategory !== undefined) goal.limitCategory = limitCategory;
      if (period !== undefined) goal.period = period;
    } else if (goal.type === 'simple_todo') {
      if (done !== undefined) goal.done = done;
    }

    await goal.save();
    logActivity({
      userId: req.user.id,
      action: 'update',
      entity: 'goal',
      detail: `${goal.type}: ${goal.title}`
    });
    res.json(await withProgress(goal, req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal (scoped by userId)
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    logActivity({
      userId: req.user.id,
      action: 'delete',
      entity: 'goal',
      detail: `${goal.type}: ${goal.title}`
    });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
