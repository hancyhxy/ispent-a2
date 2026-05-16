import { useState, useEffect, useCallback } from 'react';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import { showToast } from '../components/shared/Toast';

// Turn a raw backend goal into the shape the card UI expects.
// All UI-derived fields (progress %, status, deadline label) are computed
// here rather than stored on the model — keeps the backend schema lean and
// lets presentation logic evolve without a migration.
function decorate(goal) {
  const g = { ...goal };

  if (g.type === 'simple_todo') {
    g.status = g.done ? 'completed' : 'in_progress';
    return g;
  }

  // savings tracks currentAmount on the goal; spending_limit gets `spent`
  // computed server-side from the user's records.
  const current = g.type === 'savings' ? (g.currentAmount || 0) : (g.spent || 0);
  const target = g.targetAmount || 0;
  const pct = target > 0 ? (current / target) * 100 : 0;
  g.progressPct = Math.min(Math.round(pct), 100);

  if (g.type === 'savings') {
    if (pct >= 100) g.status = 'completed';
    else if (pct >= 80) g.status = 'near_complete';
    else g.status = 'in_progress';
    g.deadlineLabel = deadlineLabel(g.deadline);
  } else {
    // spending_limit: over target = overspent (a bad outcome, not "done")
    if (pct > 100) g.status = 'overdue';
    else if (pct >= 80) g.status = 'near_complete';
    else g.status = 'in_progress';
  }
  return g;
}

// "4 months left" / "Due in 9 days" / "Overdue" from an ISO date string.
function deadlineLabel(deadline) {
  if (!deadline) return '';
  const days = Math.round(
    (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days < 45) return `Due in ${days} day${days === 1 ? '' : 's'}`;
  return `${Math.round(days / 30)} months left`;
}

export default function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGoals();
      setGoals(data.map(decorate));
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addGoal = async (data) => {
    try {
      await createGoal(data);
      showToast('Goal created');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const editGoal = async (id, data) => {
    try {
      await updateGoal(id, data);
      showToast('Goal updated');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeGoal = async (id) => {
    try {
      await deleteGoal(id);
      showToast('Goal deleted');
      await load();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // savings: add money toward the target. Convenience wrapper over editGoal.
  const contribute = async (id, delta) => {
    const goal = goals.find((g) => g._id === id);
    if (!goal) return false;
    return editGoal(id, { currentAmount: (goal.currentAmount || 0) + delta });
  };

  const toggleTodo = async (id) => {
    const goal = goals.find((g) => g._id === id);
    if (!goal) return false;
    return editGoal(id, { done: !goal.done });
  };

  return { goals, loading, addGoal, editGoal, removeGoal, contribute, toggleTodo };
}
