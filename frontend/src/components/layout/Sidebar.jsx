import { Receipt, BarChart3, Target, Shield } from 'lucide-react';

const BASE_NAV = [
  { key: 'bills', label: 'Bills', icon: Receipt },
  { key: 'analysis', label: 'Analysis', icon: BarChart3 },
  { key: 'goals', label: 'Goals', icon: Target },
];

// Appended only for admins (see below). Kept at module scope so the JSX
// usage of its `icon` is resolved the same way as BASE_NAV's.
const ADMIN_NAV_ITEM = { key: 'admin', label: 'Admin', icon: Shield };

// The Admin tab is appended only for admins. This is a UX concern, not a
// security boundary — the real enforcement is requireAdmin on the server.
export default function Sidebar({ currentPage, onNavigate, isAdmin }) {
  const NAV_ITEMS = isAdmin ? [...BASE_NAV, ADMIN_NAV_ITEM] : BASE_NAV;

  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 bg-card
      lg:w-[148px] md:w-[56px] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 justify-center h-16">
        <img src="/favicon.svg" alt="iSpent logo" className="w-7 h-7" />
        <span className="text-xl font-bold text-primary lg:inline md:hidden">iSpent</span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 px-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const { key, label } = item;
          const isActive = currentPage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 lg:px-4 md:px-0 md:justify-center lg:justify-start
                py-3 rounded-2xl transition-colors text-sm font-medium focus:outline-none
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface hover:text-text-secondary'}`}
            >
              <Icon size={20} />
              <span className="lg:inline md:hidden">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
