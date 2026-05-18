import { LogOut, Sun, Moon, Shield } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

// The "Me" page — account identity plus preferences. It is the single
// home for actions that act on the account rather than on financial
// data, reachable from the Sidebar footer (desktop) and the bottom tab
// bar (mobile), so both layouts share one destination.
export default function AccountPage({ user, onLogout }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  // First letter of the name as a simple avatar fallback.
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="max-w-md mx-auto pt-2 md:pt-0">
      {/* Identity card doubles as the page header — no separate title,
          the avatar + name is the heading. */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary
            flex items-center justify-center text-2xl font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-text-primary truncate">
              {user?.name}
            </p>
            <p className="text-sm text-text-muted truncate">{user?.email}</p>
          </div>
          {user?.role === 'admin' && (
            <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1
              rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
              <Shield size={12} />
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card rounded-3xl p-2 shadow-card mb-4">
        <button
          onClick={toggle}
          aria-pressed={isDark}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl
            text-text-primary hover:bg-[var(--c-hover)] transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm font-medium">
            {isDark ? 'Light mode' : 'Dark mode'}
          </span>
          <span className="ml-auto text-xs text-text-muted">
            {isDark ? 'On' : 'Off'}
          </span>
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3
          rounded-2xl bg-card shadow-card text-error text-sm font-semibold
          hover:bg-[var(--c-hover)] transition-colors"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  );
}
