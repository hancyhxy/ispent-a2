require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRouter = require('./routes/auth');
const recordsRouter = require('./routes/records');
const budgetsRouter = require('./routes/budgets');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://192.168.0.211:5173'] }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/stats', statsRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
