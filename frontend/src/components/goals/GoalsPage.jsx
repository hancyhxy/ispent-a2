import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import useGoals from '../../hooks/useGoals';
import GoalCard from './GoalCard';
import GoalFormModal from './GoalFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'savings', label: 'Savings' },
  { key: 'spending_limit', label: 'Limits' },
  { key: 'simple_todo', label: 'To-do' },
  { key: 'achieved', label: 'Achieved' },
];

// Goals is iSpent's third entity: a goal-driven board where savings,
// spending limits, and financial to-dos all live as cards.
export default function GoalsPage() {
  const { goals, loading, addGoal, removeGoal, contribute, toggleTodo } = useGoals();

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const isAchieved = (g) => g.status === 'completed' || g.done;

  // Filter pills + live search, applied client-side over the loaded goals
  // so results update instantly as the user types.
  const filtered = useMemo(() => {
    let list = goals;

    if (filter === 'achieved') {
      list = list.filter(isAchieved);
    } else if (filter !== 'all') {
      list = list.filter((g) => g.type === filter);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          (g.category && g.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [goals, filter, query]);

  const activeGoals = filtered.filter((g) => !isAchieved(g));
  const achievedGoals = filtered.filter(isAchieved);

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await removeGoal(confirmDelete._id);
      setConfirmDelete(null);
    }
  };

  const renderCard = (goal) => (
    <GoalCard
      key={goal._id}
      goal={goal}
      onContribute={(delta) => contribute(goal._id, delta)}
      onToggleTodo={() => toggleTodo(goal._id)}
      onDelete={() => setConfirmDelete(goal)}
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header + action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">My Goals</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Keep tracking — log it in seconds, stay on track.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-light
            text-white text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Goal</span>
        </button>
      </div>

      {/* Live search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search goals..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border
            text-sm text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${filter === key
                ? 'bg-primary text-white'
                : 'bg-card text-text-secondary hover:bg-surface border border-border'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-sm">No goals yet. Set your first one to start tracking.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 text-primary text-sm font-medium hover:underline"
          >
            + Add Goal
          </button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {activeGoals.map(renderCard)}
            </div>
          )}

          {achievedGoals.length > 0 && filter !== 'achieved' && (
            <section className="mt-8">
              <h3 className="text-sm font-semibold text-text-muted mb-3 flex items-center gap-2">
                <span>Achieved 🎉</span>
                <span className="text-xs font-normal">({achievedGoals.length})</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {achievedGoals.map(renderCard)}
              </div>
            </section>
          )}

          {filter === 'achieved' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {achievedGoals.map(renderCard)}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <p className="text-sm">No goals match your filter.</p>
              <button
                onClick={() => { setFilter('all'); setQuery(''); }}
                className="mt-3 text-primary text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}

      <GoalFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={async (draft) => {
          const ok = await addGoal(draft);
          if (ok) setShowAddModal(false);
        }}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this goal?"
        message={confirmDelete ? `Remove "${confirmDelete.title}"?` : ''}
      />
    </div>
  );
}
