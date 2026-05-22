/* Author: Xinyi */
import { Receipt, BarChart3, Target, Shield, User } from 'lucide-react';

const BASE_NAV = [
  { key: 'bills', label: 'Bills', icon: Receipt },
  { key: 'analysis', label: 'Analysis', icon: BarChart3 },
  { key: 'goals', label: 'Goals', icon: Target },
];

const ADMIN_NAV_ITEM = { key: 'admin', label: 'Admin', icon: Shield };

// "Me" is always last — the conventional spot for the account tab. On
// mobile this is the only entry point for theme/sign-out (no sidebar).
const ACCOUNT_NAV_ITEM = { key: 'account', label: 'Me', icon: User };

// Admin tab shown only to admins (UX gate; server enforces real access).
export default function BottomTabBar({ currentPage, onNavigate, isAdmin }) {
  const NAV_ITEMS = [
    ...BASE_NAV,
    ...(isAdmin ? [ADMIN_NAV_ITEM] : []),
    ACCOUNT_NAV_ITEM,
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card z-40">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const { key, label } = item;
          const isActive = currentPage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={isActive ? 'page' : undefined}
              data-tour={`nav-${key}`}
              className={`flex flex-col items-center gap-0.5 py-2 px-4 min-w-[64px]
                min-h-[44px] transition-colors
                ${isActive ? 'text-primary' : 'text-text-muted'}`}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
