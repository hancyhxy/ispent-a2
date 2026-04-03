import { useState } from 'react';
import { Plus } from 'lucide-react';
import useRecords from '../../hooks/useRecords';
import RecordList from './RecordList';
import RecordModal from './RecordModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import { formatCurrency } from '../../utils/helpers';
import { CATEGORY_MAP } from '../../constants/categories';

export default function BillsPage({ selectedMonth }) {
  const { totalExpense, totalIncome, groupedRecords, loading, addRecord, editRecord, removeRecord } = useRecords(selectedMonth);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (editingRecord) {
      return await editRecord(editingRecord._id, data);
    }
    return await addRecord(data);
  };

  const handleSaveAndAnother = async (data) => {
    return await addRecord(data);
  };

  const handleDeleteClick = () => {
    setShowModal(false);
    setConfirmDelete(editingRecord);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await removeRecord(confirmDelete._id);
      setConfirmDelete(null);
      setEditingRecord(null);
    }
  };

  const deleteMessage = confirmDelete
    ? `Delete ${CATEGORY_MAP[confirmDelete.category]?.name || confirmDelete.category} — ${formatCurrency(confirmDelete.amount)} on ${confirmDelete.date}?`
    : '';

  return (
    <div>
      {/* Top summary + action */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-6">
          <div>
            <p className="text-xs font-medium text-text-muted">Expense</p>
            <p className="text-2xl font-bold text-decline">{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted">Income</p>
            <p className="text-2xl font-bold text-growth">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-light
            text-white text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Record</span>
        </button>
      </div>

      {/* Record list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <RecordList groupedRecords={groupedRecords} onRecordClick={handleEdit} />
      )}

      {/* Create/Edit modal */}
      <RecordModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingRecord(null); }}
        record={editingRecord}
        onSave={handleSave}
        onSaveAndAnother={handleSaveAndAnother}
        onDelete={handleDeleteClick}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this record?"
        message={deleteMessage}
      />
    </div>
  );
}
