require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const { requireAuth } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const recordsRouter = require('./routes/records');
const budgetsRouter = require('./routes/budgets');
const statsRouter = require('./routes/stats');
const goalsRouter = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://192.168.0.211:5173'] }));
app.use(express.json());

// Auth routes are public (register / login / check-email).
app.use('/api/auth', authRouter);

// Everything below requires a valid JWT. requireAuth runs before each
// router, short-circuiting with 401 and attaching req.user = { id, role }.
app.use('/api/records', requireAuth, recordsRouter);
app.use('/api/budgets', requireAuth, budgetsRouter);
app.use('/api/stats', requireAuth, statsRouter);
app.use('/api/goals', requireAuth, goalsRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
