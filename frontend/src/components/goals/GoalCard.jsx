/* Author: Xinyi */
import { useState } from 'react';
import { Plus, MoreHorizontal, Check, Sparkles, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

// One card, three shapes. `goal` is a backend goal already decorated by
// useGoals (status / progressPct / deadlineLabel computed there).
export default function GoalCard({ goal, onContribute, onToggleTodo, onDelete }) {
  if (goal.type === 'simple_todo') {
    return <TodoCard goal={goal} onToggleTodo={onToggleTodo} onDelete={onDelete} />;
  }
  return <ProgressCard goal={goal} onContribute={onContribute} onDelete={onDelete} />;
}

/* ── savings + spending_limit ─────────────────────────────── */

function ProgressCard({ goal, onContribute, onDelete }) {
  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // spending_limit spend comes from the server-aggregated `spent`;
  // savings progress comes from `currentAmount`.
  const current = goal.type === 'savings' ? (goal.currentAmount || 0) : (goal.spent || 0);
  const pct = goal.targetAmount > 0
    ? Math.round((current / goal.targetAmount) * 100)
    : 0;

  const overspent = goal.type === 'spending_limit' && pct > 100;
  const isCompleted = goal.status === 'completed';
  const isNearComplete = goal.status === 'near_complete';
  const isOverdue = goal.status === 'overdue' || overspent;

  let barColor = '#22C55E';
  if (isOverdue) barColor = '#DC2626';
  else if (isNearComplete) barColor = '#F97316';
  else if (isCompleted) barColor = '#10B981';

  const cardClass = [
    'group relative w-full bg-card rounded-3xl p-6 text-left transition-all',
    isCompleted ? 'opacity-80' : 'hover:shadow-lg hover:-translate-y-0.5',
    isNearComplete ? 'ring-2 ring-warning/40' : '',
    isOverdue ? 'ring-2 ring-error/30' : '',
  ].join(' ');

  const handleAdd = () => {
    const v = Number(amount);
    if (v > 0) onContribute(v);
    setAmount('');
    setShowInput(false);
  };

  // Only savings can be "contributed" to — spending_limit spend is derived
  // from real expense records, not manually bumped.
  const canContribute = goal.type === 'savings' && !isCompleted;

  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-2xl shrink-0">{goal.icon}</span>
          <div className="min-w-0">
            <h3 className={`text-base font-semibold text-text-primary truncate ${isCompleted ? 'line-through' : ''}`}>
              {goal.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-text-muted">{goal.category}</span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-xs text-growth font-medium">
                  <Check size={12} />Completed
                </span>
              )}
              {isOverdue && <span className="text-xs text-error font-medium">Over limit</span>}
              {isNearComplete && <span className="text-xs text-warning font-medium">Almost there</span>}
            </div>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(v => !v)}
            className="p-1.5 -m-1.5 rounded-full text-text-muted hover:bg-surface"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => { setShowMenu(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/5"
              >
                <Trash2 size={14} />Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="w-full h-2 rounded-full bg-surface overflow-hidden mb-2"
        role="progressbar"
        aria-valuenow={Math.min(pct, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="font-semibold text-text-primary">{formatCurrency(current)}</span>
          <span className="text-text-muted"> / {formatCurrency(goal.targetAmount)}</span>
          <span className="text-text-muted ml-2">· {pct}%</span>
        </div>
        <span className="text-xs text-text-muted">
          {goal.type === 'savings' ? goal.deadlineLabel : `This ${goal.period || 'month'}`}
        </span>
      </div>

      {canContribute && (
        <div className="mt-5">
          {showInput ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd();
                    if (e.key === 'Escape') { setShowInput(false); setAmount(''); }
                  }}
                  placeholder="Amount to save"
                  autoFocus
                  className="w-full pl-7 pr-3 py-2 rounded-2xl bg-surface border border-border text-sm
                    text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={handleAdd}
                className="px-3 py-2 rounded-2xl bg-primary text-white text-sm font-medium hover:bg-primary-light"
              >
                Add
              </button>
              <button
                onClick={() => { setShowInput(false); setAmount(''); }}
                className="p-2 rounded-2xl text-text-muted hover:bg-surface"
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl
                bg-primary/5 hover:bg-primary/10 text-primary text-sm font-medium transition-colors"
            >
              <Plus size={14} />
              Add to this goal
            </button>
          )}
        </div>
      )}

      {goal.type === 'spending_limit' && !isCompleted && (
        <p className="mt-4 text-xs text-text-muted">
          Tracks <span className="font-medium">{goal.limitCategory}</span> expenses automatically.
        </p>
      )}

      {isCompleted && goal.type === 'savings' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-growth">
          <Sparkles size={12} />
          <span>Achieved 🎉</span>
        </div>
      )}
    </article>
  );
}

/* ── simple_todo ──────────────────────────────────────────── */

function TodoCard({ goal, onToggleTodo, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = goal.done;

  return (
    <article className={`group relative w-full bg-card rounded-3xl p-5 transition-all
      ${isCompleted ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTodo}
          className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all
            ${isCompleted
              ? 'bg-growth text-white'
              : 'border-2 border-text-muted/40 hover:border-primary hover:bg-primary/5'}`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{goal.icon}</span>
            <h3 className={`text-base font-medium text-text-primary truncate
              ${isCompleted ? 'line-through text-text-muted' : ''}`}>
              {goal.title}
            </h3>
          </div>
          {goal.category && (
            <div className="flex items-center gap-2 mt-0.5 ml-7">
              <span className="text-xs text-text-muted">{goal.category}</span>
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(v => !v)}
            className="p-1.5 rounded-full text-text-muted hover:bg-surface"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-2xl shadow-lg overflow-hidden min-w-[140px]"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => { setShowMenu(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/5"
              >
                <Trash2 size={14} />Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
