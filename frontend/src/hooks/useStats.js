import { useState, useEffect, useCallback } from 'react';
import { fetchMonthlyStats, fetchCategoryStats, fetchDailyStats } from '../services/api';
import { showToast } from '../components/shared/Toast';

export default function useStats(month) {
  const [monthly, setMonthly] = useState({ totalExpense: 0, totalIncome: 0, balance: 0, count: 0 });
  const [categories, setCategories] = useState({ categories: [], total: 0 });
  const [daily, setDaily] = useState({ daily: [], average: 0, totalExpense: 0 });
  const [categoryType, setCategoryType] = useState('expense');
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [monthlyData, catData, dailyData] = await Promise.all([
        fetchMonthlyStats(month),
        fetchCategoryStats(month, categoryType),
        fetchDailyStats(month),
      ]);
      setMonthly(monthlyData);
      setCategories(catData);
      setDaily(dailyData);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [month, categoryType]);

  useEffect(() => { loadAll(); }, [loadAll]);

  return { monthly, categories, daily, categoryType, setCategoryType, loading };
}
