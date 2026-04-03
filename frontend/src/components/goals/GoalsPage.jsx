import { useState } from 'react';
import { Plus } from 'lucide-react';
import useBudgets from '../../hooks/useBudgets';
import BudgetList from './BudgetList';
import BudgetModal from './BudgetModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import { formatCurrency } from '../../utils/helpers';
import { CATEGORY_MAP } from '../../constants/categories';

export default function GoalsPage({ selectedMonth }) {
  const { budgets, loading, addBudget, editBudget, removeBudget, existingCategories } = useBudgets(selectedMonth);

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (editingBudget) {
      return await editBudget(editingBudget._id, data);
    }
    return await addBudget(data);
  };

  const handleDeleteClick = () => {
    setShowModal(false);
    setConfirmDelete(editingBudget);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await removeBudget(confirmDelete._id);
      setConfirmDelete(null);
      setEditingBudget(null);
    }
  };

  const deleteMessage = confirmDelete
    ? `Remove the ${formatCurrency(confirmDelete.budgetAmount)} budget for ${CATEGORY_MAP[confirmDelete.category]?.name || confirmDelete.category}?`
    : '';

  return (
    <div>
      {/* Header + action */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Budget Goals</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-light
            text-white text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Budget</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <BudgetList budgets={budgets} onBudgetClick={handleEdit} />
      )}

      <BudgetModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingBudget(null); }}
        budget={editingBudget}
        onSave={handleSave}
        onDelete={handleDeleteClick}
        existingCategories={existingCategories}
        selectedMonth={selectedMonth}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this budget?"
        message={deleteMessage}
      />
    </div>
  );
}
