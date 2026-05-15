import { LogOut } from 'lucide-react';
import MonthPicker from '../shared/MonthPicker';
import { getGreeting, formatDate, getTodayString } from '../../utils/helpers';

export default function Header({ selectedMonth, onMonthChange, user, onLogout }) {
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

      {/* Right side: month picker + logout */}
      <div className="flex-1 flex md:flex-none items-center justify-center md:justify-end gap-3">
        <MonthPicker value={selectedMonth} onChange={onMonthChange} />
        {user && (
          <button
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            className="p-2 rounded-xl text-text-muted hover:bg-card hover:text-text-secondary transition-colors"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
