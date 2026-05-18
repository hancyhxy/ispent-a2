/* Author: Xinyi */
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  note: {
    type: String,
    default: ''
  },
  // Stored as a "YYYY-MM-DD" string, NOT a Date, on purpose: the stats
  // aggregations rely on lexicographic === chronological ordering for fast
  // half-open range matching with no timezone math (see routes/stats.js).
  // Changing this to Date would break every stats range query.
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Record', recordSchema);
