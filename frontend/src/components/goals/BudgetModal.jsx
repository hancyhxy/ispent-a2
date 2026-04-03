import { useState, useEffect, useRef } from 'react';
import Modal from '../shared/Modal';
import { EXPENSE_CATEGORIES, CATEGORY_MAP } from '../../constants/categories';
import { formatMonthDisplay } from '../../utils/helpers';

export default function BudgetModal({ isOpen, onClose, budget, onSave, onDelete, existingCategories, selectedMonth }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const amountRef = useRef(null);
  const isEdit = !!budget;

  useEffect(() => {
    if (isOpen) {
      if (budget) {
        setCategory(budget.category);
        setAmount(String(budget.budgetAmount));
      } else {
        setCategory('');
        setAmount('');
      }
      setErrors({});
    }
  }, [isOpen, budget]);

  const validate = () => {
    const errs = {};
    if (!isEdit && !category) errs.category = 'Please select a category';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Please enter a valid budget amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const data = isEdit
      ? { budgetAmount: parseFloat(amount) }
      : { category, budgetAmount: parseFloat(amount) };
    const success = await onSave(data);
    if (success) onClose();
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Budget' : 'Add Budget'}
      footer={
        <div className="flex flex-row gap-2 md:justify-end">
          {isEdit && (
            <button
              onClick={onDelete}
              className="flex-1 md:flex-none py-3 md:px-6 rounded-2xl text-sm font-semibold
                text-error hover:text-red-700 transition-colors"
            >
              Delete this budget
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none py-3 md:px-8 rounded-2xl bg-primary hover:bg-primary-light
              text-white text-sm font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      }
    >
      {/* Month (read-only) */}
      <div className="mb-5">
        <label className="text-xs font-medium text-text-muted mb-1 block">Month</label>
        <p className="text-sm font-medium text-text-primary">{formatMonthDisplay(selectedMonth)}</p>
      </div>

      {/* Category */}
      {isEdit ? (
        <div className="mb-5">
          <label className="text-xs font-medium text-text-muted mb-1 block">Category</label>
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORY_MAP[budget.category]?.icon}</span>
            <span className="text-sm font-medium text-text-primary">{CATEGORY_MAP[budget.category]?.name}</span>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="text-xs font-medium text-text-muted mb-2 block">Category</label>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {EXPENSE_CATEGORIES.map(cat => {
              const isUsed = existingCategories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => !isUsed && setCategory(cat.key)}
                  disabled={isUsed}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors
                    ${isUsed
                      ? 'opacity-30 cursor-not-allowed bg-surface'
                      : category === cat.key
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'bg-surface hover:bg-gray-100'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[11px] font-medium text-text-secondary">{cat.name}</span>
                </button>
              );
            })}
          </div>
          {errors.category && <p className="text-xs text-error mt-1">{errors.category}</p>}
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="text-xs font-medium text-text-muted mb-2 block">Budget Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">$</span>
          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 rounded-2xl bg-surface text-text-primary text-sm
              focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {errors.amount && <p className="text-xs text-error mt-1">{errors.amount}</p>}
      </div>
    </Modal>
  );
}
