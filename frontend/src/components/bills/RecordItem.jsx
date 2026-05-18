/* Author: Xinyi */
import { CATEGORY_MAP } from '../../constants/categories';
import { formatCurrency } from '../../utils/helpers';

export default function RecordItem({ record, onClick }) {
  const cat = CATEGORY_MAP[record.category] || { icon: '💡', name: record.category };
  const isExpense = record.type === 'expense';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl
        hover:bg-[var(--c-hover)] transition-colors text-left"
    >
      <span className="text-2xl w-10 h-10 flex items-center justify-center shrink-0">
        {cat.icon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{cat.name}</p>
        {record.note && (
          <p className="text-xs text-text-muted truncate">{record.note}</p>
        )}
      </div>

      <span className={`text-sm font-semibold shrink-0 ${isExpense ? 'text-decline' : 'text-growth'}`}>
        {isExpense ? '-' : '+'}{formatCurrency(record.amount)}
      </span>
    </button>
  );
}
