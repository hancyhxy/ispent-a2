/* Author: Xinyi */
import MonthPicker from '../shared/MonthPicker';
import { getGreeting, formatDate, getTodayString } from '../../utils/helpers';

// Header carries the greeting and the global month picker. The month
// picker only makes sense on the data pages (Bills/Analysis/Goals), so
// App opts out of it on the Me page via showMonthPicker=false. When
// there is nothing left to show (no picker, and the greeting is
// hidden on mobile anyway) the header collapses entirely instead of
// leaving a blank 64px strip.
export default function Header({ selectedMonth, onMonthChange, user, showMonthPicker = true }) {
  // Mobile + no picker => header would be empty; don't render it at all.
  if (!showMonthPicker) {
    return (
      <header className="hidden md:flex items-center px-6 lg:px-8 h-16 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-text-primary" style={{ lineHeight: '1.4' }}>
            {getGreeting()}{user ? `, ${user.name}` : ''}
          </h1>
          <p className="text-xs font-medium text-text-muted" style={{ lineHeight: '1.4' }}>
            {formatDate(getTodayString())}
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 h-16 shrink-0">
      {/* Greeting - hidden on mobile */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-text-primary" style={{ lineHeight: '1.4' }}>
          {getGreeting()}{user ? `, ${user.name}` : ''}
        </h1>
        <p className="text-xs font-medium text-text-muted" style={{ lineHeight: '1.4' }}>
          {formatDate(getTodayString())}
        </p>
      </div>

      {/* Right side: the sole global filter control */}
      <div className="flex-1 flex md:flex-none items-center justify-center md:justify-end gap-3">
        <MonthPicker value={selectedMonth} onChange={onMonthChange} />
      </div>
    </header>
  );
}
