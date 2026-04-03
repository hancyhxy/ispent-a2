import MonthPicker from '../shared/MonthPicker';
import { getGreeting, formatDate, getTodayString } from '../../utils/helpers';

export default function Header({ selectedMonth, onMonthChange }) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 h-16 shrink-0">
      {/* Greeting - hidden on mobile */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-text-primary" style={{ lineHeight: '1.4' }}>
          {getGreeting()}
        </h1>
        <p className="text-xs font-medium text-text-muted" style={{ lineHeight: '1.4' }}>
          {formatDate(getTodayString())}
        </p>
      </div>

      {/* Month Picker - centered on mobile */}
      <div className="flex-1 flex md:flex-none justify-center md:justify-end">
        <MonthPicker value={selectedMonth} onChange={onMonthChange} />
      </div>
    </header>
  );
}
