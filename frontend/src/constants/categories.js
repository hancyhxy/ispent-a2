export const EXPENSE_CATEGORIES = [
  { key: 'food', name: 'Food', icon: '🍕' },
  { key: 'shopping', name: 'Shopping', icon: '🛒' },
  { key: 'transport', name: 'Transport', icon: '🚗' },
  { key: 'entertainment', name: 'Entertainment', icon: '🎮' },
  { key: 'housing', name: 'Housing', icon: '🏠' },
  { key: 'education', name: 'Education', icon: '📚' },
  { key: 'health', name: 'Health', icon: '💊' },
  { key: 'daily', name: 'Daily', icon: '🧴' },
  { key: 'other', name: 'Other', icon: '💡' },
];

export const INCOME_CATEGORIES = [
  { key: 'salary', name: 'Salary', icon: '💰' },
  { key: 'freelance', name: 'Freelance', icon: '💼' },
  { key: 'transfer', name: 'Transfer', icon: '🧧' },
  { key: 'refund', name: 'Refund', icon: '🔙' },
  { key: 'other_income', name: 'Other', icon: '💡' },
];

export const CATEGORY_MAP = {};
[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].forEach(cat => {
  CATEGORY_MAP[cat.key] = cat;
});

export const CHART_COLORS = [
  '#4B6EF5', '#10B981', '#F97316', '#EF4444', '#9333EA',
  '#FFD147', '#06B6D4', '#EC4899', '#8B5CF6', '#14B8A6',
];

export const QUICK_NOTES = ['lunch', 'dinner', 'grocery', 'daily', 'transport'];
