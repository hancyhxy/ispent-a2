// Mock data for A2 Goals page visual prototype.
// Hard-coded — no backend, no persistence. Used only for design alignment with Rhea.

export const MOCK_GOALS = [
  // ── savings × 3 ─────────────────────────────────────────────
  {
    id: 'g1',
    type: 'savings',
    icon: '🛫',
    title: 'Japan Trip 2026',
    category: 'Travel',
    currentAmount: 3000,
    targetAmount: 5000,
    deadline: '2026-12-01',
    deadlineLabel: '4 months left',
    status: 'in_progress',
  },
  {
    id: 'g2',
    type: 'savings',
    icon: '🛟',
    title: 'Emergency Fund',
    category: 'Saving',
    currentAmount: 750,
    targetAmount: 3000,
    deadline: '2027-05-01',
    deadlineLabel: '12 months left',
    status: 'in_progress',
  },
  {
    id: 'g3',
    type: 'savings',
    icon: '💻',
    title: 'Buy MacBook Pro M5',
    category: 'Tech',
    currentAmount: 2400,
    targetAmount: 2400,
    deadline: '2026-03-12',
    deadlineLabel: 'Completed 12 Mar',
    status: 'completed',
  },

  // ── spending_limit × 3 ──────────────────────────────────────
  {
    id: 'g4',
    type: 'spending_limit',
    icon: '🍱',
    title: 'Eating Out',
    category: 'Food',
    currentAmount: 347,
    targetAmount: 400,
    period: 'monthly',
    periodLabel: '8 days left in May',
    alertThreshold: 0.8,
    status: 'near_complete',
  },
  {
    id: 'g5',
    type: 'spending_limit',
    icon: '☕️',
    title: 'Coffee',
    category: 'Food',
    currentAmount: 62,
    targetAmount: 80,
    period: 'monthly',
    periodLabel: '8 days left in May',
    alertThreshold: 0.8,
    status: 'in_progress',
  },
  {
    id: 'g6',
    type: 'spending_limit',
    icon: '🚗',
    title: 'Transport',
    category: 'Transport',
    currentAmount: 145,
    targetAmount: 120,
    period: 'monthly',
    periodLabel: '8 days left in May',
    alertThreshold: 0.8,
    status: 'overdue',  // overspent
  },

  // ── simple_todo × 2 ─────────────────────────────────────────
  {
    id: 'g7',
    type: 'simple_todo',
    icon: '📊',
    title: 'Research one ETF before tax season',
    category: 'Investing',
    isCompleted: false,
    status: 'in_progress',
  },
  {
    id: 'g8',
    type: 'simple_todo',
    icon: '🏦',
    title: 'Open offset account',
    category: 'Banking',
    isCompleted: true,
    completedAt: '2026-05-03',
    status: 'completed',
  },
];

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'savings', label: 'Savings' },
  { key: 'spending_limit', label: 'Limits' },
  { key: 'simple_todo', label: 'To-do' },
  { key: 'achieved', label: 'Achieved' },
];
