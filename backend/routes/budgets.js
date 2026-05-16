const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Budget = require('../models/Budget');
const Record = require('../models/Record');

// Create budget
router.post('/', async (req, res) => {
  try {
    const { category, budgetAmount, month } = req.body;

    if (!category || !budgetAmount || !month) {
      return res.status(400).json({ error: 'Category, budget amount, and month are required' });
    }
    if (budgetAmount <= 0) {
      return res.status(400).json({ error: 'Budget amount must be greater than 0' });
    }

    const budget = await Budget.create({
      userId: req.user.id, category, budgetAmount, month
    });
    res.status(201).json(budget);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A budget for this category already exists this month' });
    }
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Get budgets by month with spent amounts
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required (YYYY-MM)' });
    }

    const budgets = await Budget.find({ userId: req.user.id, month });

    // Calculate spent amounts from records
    const [year, m] = month.split('-').map(Number);
    const start = `${month}-01`;
    const nextMonth = m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`;
    const end = `${nextMonth}-01`;

    const spentByCategory = await Record.aggregate([
      {
        $match: {
          // aggregate() skips Mongoose casting — convert to ObjectId explicitly
          userId: new mongoose.Types.ObjectId(req.user.id),
          type: 'expense',
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spentMap = {};
    spentByCategory.forEach(item => {
      spentMap[item._id] = item.spent;
    });

    const result = budgets.map(b => ({
      _id: b._id,
      category: b.category,
      budgetAmount: b.budgetAmount,
      month: b.month,
      spent: spentMap[b.category] || 0
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const { budgetAmount } = req.body;

    if (budgetAmount !== undefined && budgetAmount <= 0) {
      return res.status(400).json({ error: 'Budget amount must be greater than 0' });
    }

    // Scoped by userId — a user can only update their own budgets.
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { budgetAmount },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id, userId: req.user.id
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

module.exports = router;
