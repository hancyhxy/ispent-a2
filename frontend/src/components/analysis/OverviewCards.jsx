/* Author: Xinyi */
import { formatCurrency } from '../../utils/helpers';

const cards = [
  { key: 'totalExpense', label: 'Total Expense', colorClass: 'text-decline' },
  { key: 'totalIncome', label: 'Total Income', colorClass: 'text-growth' },
  { key: 'balance', label: 'Balance', colorClass: null },
  { key: 'count', label: 'Records', colorClass: 'text-text-primary' },
];

export default function OverviewCards({ data }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, colorClass }) => {
        const value = data[key];
        let displayColor = colorClass;
        if (key === 'balance') {
          displayColor = value >= 0 ? 'text-growth' : 'text-decline';
        }

        return (
          <div key={key} className="bg-card rounded-3xl p-6">
            <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
            <p className={`text-2xl font-bold ${displayColor}`}>
              {key === 'count' ? value : formatCurrency(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
