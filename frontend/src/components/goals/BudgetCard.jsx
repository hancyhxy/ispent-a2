/* Author: Xinyi */
import { CATEGORY_MAP } from '../../constants/categories';
import { formatCurrency } from '../../utils/helpers';

export default function BudgetCard({ budget, onClick }) {
  const cat = CATEGORY_MAP[budget.category] || { icon: '💡', name: budget.category };
  const pct = budget.percentage;
  const barWidth = Math.min(pct, 100);

  let barColor = '#22C55E'; // success
  if (pct >= 100) barColor = '#DC2626'; // error
  else if (pct >= 70) barColor = '#F97316'; // warning

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-3xl p-6 text-left hover:bg-[var(--c-hover)] transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-sm font-medium text-text-primary">{cat.name}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-text-primary">
            {formatCurrency(budget.spent)} / {formatCurrency(budget.budgetAmount)}
          </span>
          <span className="text-xs text-text-muted ml-2">{pct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full bg-surface overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${barWidth}%`, backgroundColor: barColor }}
        />
      </div>
    </button>
  );
}
