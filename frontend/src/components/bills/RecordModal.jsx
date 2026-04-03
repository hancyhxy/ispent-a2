import { useState, useEffect, useRef } from 'react';
import Modal from '../shared/Modal';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, QUICK_NOTES } from '../../constants/categories';
import { getTodayString } from '../../utils/helpers';

export default function RecordModal({ isOpen, onClose, record, onSave, onSaveAndAnother, onDelete }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [errors, setErrors] = useState({});
  const amountRef = useRef(null);
  const isEdit = !!record;

  useEffect(() => {
    if (isOpen) {
      if (record) {
        setType(record.type);
        setCategory(record.category);
        setAmount(String(record.amount));
        setNote(record.note || '');
        setDate(record.date);
      } else {
        setType('expense');
        setCategory('');
        setAmount('');
        setNote('');
        setDate(getTodayString());
      }
      setErrors({});
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [isOpen, record]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const validate = () => {
    const errs = {};
    if (!category) errs.category = 'Please select a category';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Please enter a valid amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const data = { type, category, amount: parseFloat(amount), note, date };
    const success = await onSave(data);
    if (success) onClose();
  };

  const handleSaveAndAnother = async () => {
    if (!validate()) return;
    const data = { type, category, amount: parseFloat(amount), note, date };
    const success = await onSaveAndAnother(data);
    if (success) {
      setAmount('');
      setNote('');
      setErrors({});
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Record' : 'Add Record'}>
      {/* Type tabs */}
      <div className="flex gap-2 mb-6">
        {['expense', 'income'].map(t => (
          <button
            key={t}
            onClick={() => { setType(t); setCategory(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${type === t ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-gray-200'}`}
          >
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="mb-5">
        <label className="text-xs font-medium text-text-muted mb-2 block">Category</label>
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors
                ${category === cat.key
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'bg-surface hover:bg-gray-100'}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[11px] font-medium text-text-secondary">{cat.name}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-xs text-error mt-1">{errors.category}</p>}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">Amount</label>
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

      {/* Note */}
      <div className="mb-4">
        <label className="text-xs font-medium text-text-muted mb-2 block">Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full px-4 py-3 rounded-2xl bg-surface text-text-primary text-sm
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {QUICK_NOTES.map(tag => (
            <button
              key={tag}
              onClick={() => setNote(tag)}
              className="px-3 py-1 rounded-full bg-surface text-xs font-medium
                text-text-secondary hover:bg-gray-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        <label className="text-xs font-medium text-text-muted mb-2 block">Date</label>
        <input
          type="date"
          value={date}
          max={getTodayString()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-surface text-text-primary text-sm
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-light text-white
            text-sm font-semibold transition-colors"
        >
          Save
        </button>

        {!isEdit && (
          <button
            onClick={handleSaveAndAnother}
            className="w-full py-3 rounded-2xl bg-surface hover:bg-gray-200
              text-sm font-semibold text-text-secondary transition-colors"
          >
            Save & Add Another
          </button>
        )}

        {isEdit && (
          <button
            onClick={onDelete}
            className="w-full py-3 text-sm font-semibold text-error hover:text-red-700 transition-colors"
          >
            Delete this record
          </button>
        )}
      </div>
    </Modal>
  );
}
