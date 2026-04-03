import { Receipt, BarChart3, Target } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'bills', label: 'Bills', icon: Receipt },
  { key: 'analysis', label: 'Analysis', icon: BarChart3 },
  { key: 'goals', label: 'Goals', icon: Target },
];

export default function BottomTabBar({ currentPage, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card z-40
      flex items-center justify-around h-16 safe-area-bottom">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = currentPage === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 min-w-[64px]
              min-h-[44px] transition-colors
              ${isActive ? 'text-primary' : 'text-text-muted'}`}
          >
            <Icon size={20} />
            <span className="text-[11px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
