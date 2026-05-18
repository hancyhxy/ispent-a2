import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
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
  const [search, setSearch] = useState('');

  // Live search: filter the already-loaded month's records client-side so
  // results update instantly as the user types — no extra network round-trip.
  // Matches against the note text and the category's display name.
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groupedRecords;

    return groupedRecords
      .map((group) => {
        const records = group.records.filter((r) => {
          const categoryName = CATEGORY_MAP[r.category]?.name || r.category;
          return (
            (r.note || '').toLowerCase().includes(q) ||
            categoryName.toLowerCase().includes(q)
          );
        });
        return { ...group, records };
      })
      .filter((group) => group.records.length > 0);
  }, [groupedRecords, search]);

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

      {/* Live search — filters the list in real time as the user types */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by note or category..."
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-card border border-border
            text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary
            transition-colors"
        />
      </div>

      {/* Record list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <RecordList groupedRecords={filteredGroups} onRecordClick={handleEdit} />
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
