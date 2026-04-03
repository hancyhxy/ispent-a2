import { Receipt, BarChart3, Target } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'bills', label: 'Bills', icon: Receipt },
  { key: 'analysis', label: 'Analysis', icon: BarChart3 },
  { key: 'goals', label: 'Goals', icon: Target },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 bg-card
      lg:w-[200px] md:w-[56px] shrink-0">
      {/* Logo */}
      <div className="flex items-center lg:px-6 md:px-0 md:justify-center h-16">
        <span className="text-xl font-bold text-primary">
          <span className="lg:inline md:hidden">iSpent</span>
          <span className="lg:hidden md:inline">iS</span>
        </span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 px-2 mt-4">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = currentPage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 lg:px-4 md:px-0 md:justify-center lg:justify-start
                py-3 rounded-2xl transition-colors text-sm font-medium
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
