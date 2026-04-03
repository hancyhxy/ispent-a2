import { useState, useEffect, useCallback } from 'react';
import { fetchRecords, createRecord, updateRecord, deleteRecord } from '../services/api';
import { showToast } from '../components/shared/Toast';

export default function useRecords(month) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRecords(month);
      setRecords(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const addRecord = async (data) => {
    try {
      await createRecord(data);
      showToast('Record added');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const editRecord = async (id, data) => {
    try {
      await updateRecord(id, data);
      showToast('Record updated');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeRecord = async (id) => {
    try {
      await deleteRecord(id);
      showToast('Record deleted');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Compute derived data
  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  // Group by date
  const groupMap = {};
  records.forEach(r => {
    if (!groupMap[r.date]) {
      groupMap[r.date] = { date: r.date, records: [], dayExpense: 0, dayIncome: 0 };
    }
    groupMap[r.date].records.push(r);
    if (r.type === 'expense') groupMap[r.date].dayExpense += r.amount;
    else groupMap[r.date].dayIncome += r.amount;
  });

  const groupedRecords = Object.values(groupMap).sort((a, b) => b.date.localeCompare(a.date));

  return { records, loading, totalExpense, totalIncome, groupedRecords, addRecord, editRecord, removeRecord };
}
