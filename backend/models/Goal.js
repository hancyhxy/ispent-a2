/* Author: Xinyi */
const mongoose = require('mongoose');

/**
 * Goal is iSpent's third core entity. One schema backs three card types
 * (see a2-handover/CONTRACT.md §0):
 *
 *   - savings        : progress bar toward targetAmount by a deadline
 *   - spending_limit  : cap on a category's spend within a period
 *   - simple_todo     : a checkbox financial task, no amount
 *
 * Type-specific fields are optional at the schema level and validated
 * per-type in routes/goals.js, leveraging MongoDB's schema flexibility.
 */
const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['savings', 'spending_limit', 'simple_todo'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  category: {
    type: String,
    default: ''
  },

  // savings / spending_limit only
  targetAmount: {
    type: Number,
    min: 0.01
  },
  // savings: amount saved so far is tracked directly on the goal
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // savings: ISO date string (YYYY-MM-DD)
  deadline: {
    type: String,
    default: ''
  },
  // spending_limit: which expense category to aggregate against
  limitCategory: {
    type: String,
    default: ''
  },
  // spending_limit: monthly | weekly | yearly
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    default: 'monthly'
  },

  // simple_todo only
  done: {
    type: Boolean,
    default: false
  },

  archived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', goalSchema);
