import { useState, useEffect, useCallback } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../services/api';
import { showToast } from '../components/shared/Toast';

export default function useBudgets(month) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBudgets(month);
      // Add percentage and sort by percentage descending
      const enriched = data.map(b => ({
        ...b,
        percentage: b.budgetAmount > 0 ? Math.round((b.spent / b.budgetAmount) * 100) : 0,
      }));
      enriched.sort((a, b) => b.percentage - a.percentage);
      setBudgets(enriched);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const addBudget = async (data) => {
    try {
      await createBudget({ ...data, month });
      showToast('Budget created');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const editBudget = async (id, data) => {
    try {
      await updateBudget(id, data);
      showToast('Budget updated');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeBudget = async (id) => {
    try {
      await deleteBudget(id);
      showToast('Budget deleted');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const existingCategories = budgets.map(b => b.category);

  return { budgets, loading, addBudget, editBudget, removeBudget, existingCategories };
}
