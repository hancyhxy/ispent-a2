/* Author: Xinyi */
const mongoose = require('mongoose');

/**
 * UserActivity is iSpent's fourth entity, and the one that exists purely
 * for the admin role: it is an append-only audit log of what every user
 * does. Regular users never read or write it directly — it is populated
 * as a side effect of auth and CRUD routes (see logActivity below) and
 * only ever read through the admin routes.
 *
 * Why a separate collection instead of a field on User: an activity log
 * is high-volume, append-only, and time-ordered. Modelling it as its own
 * document keeps User small and lets the admin view paginate/filter by
 * user without loading an ever-growing array into every User read.
 */
const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Denormalised so the admin table can show who did it without a join,
  // and so the row survives even if the user is later deleted.
  userEmail: {
    type: String,
    default: ''
  },
  // What happened, e.g. 'login', 'logout', 'create', 'update', 'delete'.
  action: {
    type: String,
    required: true
  },
  // Which entity the action targeted: 'auth', 'record', 'goal', 'budget'.
  entity: {
    type: String,
    required: true
  },
  // Free-text human-readable summary, e.g. "expense $12.50 (food)".
  detail: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

/**
 * Record one activity row. Deliberately fire-and-forget: an audit-log
 * write must never fail or slow down the business operation that
 * triggered it. Callers do NOT await this — any error is swallowed with
 * a warning so a logging hiccup can't turn a successful POST into a 500.
 */
function logActivity({ userId, userEmail = '', action, entity, detail = '' }) {
  UserActivity.create({ userId, userEmail, action, entity, detail })
    .catch((err) => console.warn('Failed to log activity:', err.message));
}

module.exports = UserActivity;
module.exports.logActivity = logActivity;
