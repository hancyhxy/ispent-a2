import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthDisplay, getPrevMonth, getNextMonth, getCurrentMonth } from '../../utils/helpers';

export default function MonthPicker({ value, onChange }) {
  const current = getCurrentMonth();
  const isCurrentMonth = value === current;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(getPrevMonth(value))}
        className="p-2 rounded-xl hover:bg-surface transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} className="text-text-secondary" />
      </button>

      <span className="text-sm font-medium text-text-primary min-w-[140px] text-center">
        {formatMonthDisplay(value)}
      </span>

      <button
        onClick={() => !isCurrentMonth && onChange(getNextMonth(value))}
        disabled={isCurrentMonth}
        className="p-2 rounded-xl hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next month"
      >
        <ChevronRight size={18} className="text-text-secondary" />
      </button>
    </div>
  );
}
