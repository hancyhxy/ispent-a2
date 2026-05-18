/* Author: Xinyi */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Record = require('../models/Record');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const UserActivity = require('../models/UserActivity');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Every route here is admin-only. requireAuth verifies the JWT and
// attaches req.user; requireAdmin then rejects anyone whose role is not
// 'admin' with 403. Applying both at the router level means no individual
// handler can accidentally be left unprotected.
router.use(requireAuth, requireAdmin);

// GET /api/admin/users — list every account (password never returned).
// Includes a per-user activity count so the table can show who is active.
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const result = await Promise.all(
      users.map(async (u) => ({
        id: u._id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        activityCount: await UserActivity.countDocuments({ userId: u._id })
      }))
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/role — promote/demote a user.
// Guard: an admin cannot change their own role, otherwise they could
// lock the last admin out of the system with no way back in.
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin"' });
    }
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE /api/admin/users/:id — remove a user and cascade-delete all of
// their data so no orphaned records/goals/budgets/activity remain.
// Guard: an admin cannot delete their own account.
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cascade: remove everything owned by this user in one sweep.
    await Promise.all([
      Record.deleteMany({ userId: user._id }),
      Budget.deleteMany({ userId: user._id }),
      Goal.deleteMany({ userId: user._id }),
      UserActivity.deleteMany({ userId: user._id }),
      User.deleteOne({ _id: user._id })
    ]);

    res.json({ message: 'User and all their data deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/admin/activities — the audit log across all users.
// Optional ?userId= filter; capped + sorted newest-first so the admin
// view stays fast even as the log grows.
router.get('/activities', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const activities = await UserActivity.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router;
