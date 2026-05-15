import { useState, useEffect } from 'react';
import Modal from '../../shared/Modal';

// Type-picker → form → create. Pure mock — emits a draft via onCreate, parent owns state.

const TYPE_OPTIONS = [
  {
    key: 'savings',
    label: 'Savings Goal',
    description: 'Save up to a target amount',
    icon: '🎯',
    defaultIcon: '🛫',
  },
  {
    key: 'spending_limit',
    label: 'Spending Limit',
    description: 'Cap a monthly spending category',
    icon: '🛡️',
    defaultIcon: '🍱',
  },
  {
    key: 'simple_todo',
    label: 'Financial To-do',
    description: 'A task that improves your finances',
    icon: '✅',
    defaultIcon: '📊',
  },
];

export default function AddGoalModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState('pick');     // 'pick' | 'fill'
  const [type, setType] = useState(null);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [category, setCategory] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep('pick');
      setType(null);
      setTitle('');
      setIcon('🎯');
      setCategory('');
      setTargetAmount('');
    }
  }, [isOpen]);

  const handlePickType = (t) => {
    setType(t.key);
    setIcon(t.defaultIcon);
    setStep('fill');
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    const base = {
      type,
      icon: icon || '🎯',
      title: title.trim(),
      category: category.trim() || 'Other',
      status: 'in_progress',
    };

    if (type === 'savings') {
      onCreate({
        ...base,
        currentAmount: 0,
        targetAmount: Number(targetAmount) || 0,
        deadlineLabel: 'No deadline',
      });
    } else if (type === 'spending_limit') {
      onCreate({
        ...base,
        currentAmount: 0,
        targetAmount: Number(targetAmount) || 0,
        period: 'monthly',
        periodLabel: 'This month',
        alertThreshold: 0.8,
      });
    } else {
      onCreate({
        ...base,
        isCompleted: false,
      });
    }
  };

  const canSubmit = title.trim() && (type === 'simple_todo' || Number(targetAmount) > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
      {step === 'pick' ? (
        /* ── Type picker ──────────────────────────────── */
        <div className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-1">What kind of goal?</h3>
          <p className="text-sm text-text-muted mb-5">Pick a type to get started.</p>

          <div className="flex flex-col gap-3">
            {TYPE_OPTIONS.map(t => (
              <button
                key={t.key}
                onClick={() => handlePickType(t)}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border
                  hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <span className="text-2xl shrink-0">{t.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{t.label}</div>
                  <div className="text-xs text-text-muted mt-0.5">{t.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Form ─────────────────────────────────────── */
        <div className="p-6">
          <button
            onClick={() => setStep('pick')}
            className="text-xs text-text-muted hover:text-text-secondary mb-4"
          >
            ← Pick different type
          </button>

          <div className="flex items-center gap-3 mb-5">
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value.slice(0, 2))}
              maxLength={2}
              className="w-14 h-14 text-2xl text-center rounded-2xl bg-surface border border-border focus:outline-none focus:border-primary"
              aria-label="Icon emoji"
            />
            <div className="text-xs text-text-muted">Tap to change icon</div>
          </div>

          <label className="block mb-4">
            <span className="text-xs font-medium text-text-secondary mb-1.5 block">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'savings'
                  ? 'e.g. Japan Trip 2026'
                  : type === 'spending_limit'
                  ? 'e.g. Eating Out'
                  : 'e.g. Research one ETF'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm
                text-text-primary focus:outline-none focus:border-primary"
              autoFocus
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-medium text-text-secondary mb-1.5 block">Category</span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={
                type === 'savings'
                  ? 'Travel / Saving / Tech...'
                  : type === 'spending_limit'
                  ? 'Food / Transport / Shopping...'
                  : 'Investing / Tax / Banking...'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm
                text-text-primary focus:outline-none focus:border-primary"
            />
          </label>

          {type !== 'simple_todo' && (
            <label className="block mb-5">
              <span className="text-xs font-medium text-text-secondary mb-1.5 block">
                {type === 'savings' ? 'Target Amount' : 'Monthly Limit'}
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">$</span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm
                    text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </label>
          )}

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!canSubmit}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-white
                hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
