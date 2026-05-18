/* Author: Xinyi */
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { logActivity } = require('../models/UserActivity');

// Create record
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;

    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Type, category, amount, and date are required' });
    }
    if (!['expense', 'income'].includes(type)) {
      return res.status(400).json({ error: 'Type must be expense or income' });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const record = await Record.create({
      userId: req.user.id, type, category, amount, note: note || '', date
    });
    logActivity({
      userId: req.user.id,
      action: 'create',
      entity: 'record',
      detail: `${type} $${amount} (${category})`
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Get records by month
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required (YYYY-MM)' });
    }

    const [year, m] = month.split('-').map(Number);
    const start = `${month}-01`;
    const nextMonth = m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`;
    const end = `${nextMonth}-01`;

    const records = await Record.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end }
    }).sort({ date: -1, createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Update record
router.put('/:id', async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Scope by userId so a user can only update their own records
    // (prevents IDOR via a guessed/leaked record id).
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { type, category, amount, note, date },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    logActivity({
      userId: req.user.id,
      action: 'update',
      entity: 'record',
      detail: `${record.type} $${record.amount} (${record.category})`
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Delete record
router.delete('/:id', async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({
      _id: req.params.id, userId: req.user.id
    });
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    logActivity({
      userId: req.user.id,
      action: 'delete',
      entity: 'record',
      detail: `${record.type} $${record.amount} (${record.category})`
    });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;
