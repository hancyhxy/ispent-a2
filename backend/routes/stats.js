const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

function getMonthRange(month) {
  const [year, m] = month.split('-').map(Number);
  const start = `${month}-01`;
  const nextMonth = m === 12 ? `${year + 1}-01` : `${year}-${String(m + 1).padStart(2, '0')}`;
  const end = `${nextMonth}-01`;
  return { start, end };
}

// Monthly summary
router.get('/monthly', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const { start, end } = getMonthRange(month);

    const result = await Record.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalExpense = 0, totalIncome = 0, count = 0;
    result.forEach(item => {
      if (item._id === 'expense') {
        totalExpense = item.total;
      } else {
        totalIncome = item.total;
      }
      count += item.count;
    });

    res.json({
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      count
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
});

// Category breakdown
router.get('/categories', async (req, res) => {
  try {
    const { month, type } = req.query;
    if (!month || !type) {
      return res.status(400).json({ error: 'Month and type parameters are required' });
    }

    const { start, end } = getMonthRange(month);

    const result = await Record.aggregate([
      {
        $match: {
          type,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { amount: -1 } }
    ]);

    const total = result.reduce((sum, item) => sum + item.amount, 0);

    const categories = result.map(item => ({
      category: item._id,
      amount: item.amount,
      percentage: total > 0 ? Math.round((item.amount / total) * 1000) / 10 : 0
    }));

    res.json({ categories, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category stats' });
  }
});

// Daily trend
router.get('/daily', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }

    const { start, end } = getMonthRange(month);
    const [year, m] = month.split('-').map(Number);
    const daysInMonth = new Date(year, m, 0).getDate();

    const result = await Record.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { $substr: ['$date', 8, 2] },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    const dayMap = {};
    result.forEach(item => {
      dayMap[parseInt(item._id)] = item.amount;
    });

    const daily = [];
    for (let d = 1; d <= daysInMonth; d++) {
      daily.push({ day: d, amount: dayMap[d] || 0 });
    }

    const totalExpense = daily.reduce((sum, d) => sum + d.amount, 0);
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === m;
    const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
    const average = elapsedDays > 0 ? Math.round((totalExpense / elapsedDays) * 100) / 100 : 0;

    res.json({ daily, average, totalExpense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
});

module.exports = router;
