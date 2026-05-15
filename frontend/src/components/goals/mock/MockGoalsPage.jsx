import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import MockGoalCard from './MockGoalCard';
import AddGoalModal from './AddGoalModal';
import { MOCK_GOALS, FILTERS } from './mockData';

// Interactive prototype for A2 Goals page.
// Pure in-memory state — refresh = reset. No backend, no persistence.

export default function MockGoalsPage() {
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // ── Mutations ─────────────────────────────────────────────
  const addGoal = (goalDraft) => {
    const newGoal = {
      id: 'g' + Date.now(),
      ...goalDraft,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id, patch) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addAmount = (id, delta) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newAmount = (g.currentAmount || 0) + delta;
      const pct = (newAmount / g.targetAmount) * 100;

      let status = g.status;
      if (g.type === 'savings') {
        if (pct >= 100) status = 'completed';
        else if (pct >= 80) status = 'near_complete';
        else status = 'in_progress';
      } else if (g.type === 'spending_limit') {
        if (pct > 100) status = 'overdue';
        else if (pct >= 80) status = 'near_complete';
        else status = 'in_progress';
      }
      return { ...g, currentAmount: newAmount, status };
    }));
  };

  const toggleTodo = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const nextCompleted = !g.isCompleted;
      return {
        ...g,
        isCompleted: nextCompleted,
        status: nextCompleted ? 'completed' : 'in_progress',
        completedAt: nextCompleted ? new Date().toISOString().slice(0, 10) : undefined,
      };
    }));
  };

  // ── Filter + search ───────────────────────────────────────
  const filtered = useMemo(() => {
    let list = goals;

    if (filter === 'achieved') {
      list = list.filter(g => g.status === 'completed' || g.isCompleted);
    } else if (filter !== 'all') {
      list = list.filter(g => g.type === filter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        (g.category && g.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [goals, filter, query]);

  const activeGoals = filtered.filter(g => g.status !== 'completed' && !g.isCompleted);
  const completedGoals = filtered.filter(g => g.status === 'completed' || g.isCompleted);

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">My Goals</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Keep tracking — 顺手记一笔，持续往目标走
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

      {/* ── Search ─────────────────────────────────────────── */}
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

      {/* ── Filter pills ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map(({ key, label }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary text-white'
                  : 'bg-card text-text-secondary hover:bg-surface border border-border'}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Active grid ────────────────────────────────────── */}
      {activeGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {activeGoals.map(goal => (
            <MockGoalCard
              key={goal.id}
              goal={goal}
              onAddAmount={(delta) => addAmount(goal.id, delta)}
              onToggleTodo={() => toggleTodo(goal.id)}
              onDelete={() => deleteGoal(goal.id)}
              onUpdate={(patch) => updateGoal(goal.id, patch)}
            />
          ))}
        </div>
      )}

      {/* ── Achieved section ───────────────────────────────── */}
      {completedGoals.length > 0 && filter !== 'achieved' && (
        <section className="mt-8">
          <h3 className="text-sm font-semibold text-text-muted mb-3 flex items-center gap-2">
            <span>Achieved 🎉</span>
            <span className="text-xs font-normal">({completedGoals.length})</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedGoals.map(goal => (
              <MockGoalCard
                key={goal.id}
                goal={goal}
                onAddAmount={(delta) => addAmount(goal.id, delta)}
                onToggleTodo={() => toggleTodo(goal.id)}
                onDelete={() => deleteGoal(goal.id)}
                onUpdate={(patch) => updateGoal(goal.id, patch)}
              />
            ))}
          </div>
        </section>
      )}

      {filter === 'achieved' && completedGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {completedGoals.map(goal => (
            <MockGoalCard
              key={goal.id}
              goal={goal}
              onAddAmount={(delta) => addAmount(goal.id, delta)}
              onToggleTodo={() => toggleTodo(goal.id)}
              onDelete={() => deleteGoal(goal.id)}
              onUpdate={(patch) => updateGoal(goal.id, patch)}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────── */}
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

      {/* ── Footer note ────────────────────────────────────── */}
      <p className="mt-12 text-xs text-text-muted text-center">
        🎨 Interactive mock · State held in memory · Refresh resets · For A2 design alignment
      </p>

      {/* ── Add Goal modal ─────────────────────────────────── */}
      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={(draft) => { addGoal(draft); setShowAddModal(false); }}
      />
    </div>
  );
}
