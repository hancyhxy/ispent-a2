const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budgetAmount: {
    type: Number,
    required: true,
    min: 0.01
  },
  month: {
    type: String,
    required: true
  }
});

budgetSchema.index({ category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
