import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminUsers, updateUserRole, deleteUser, fetchActivities
} from '../services/api';
import { showToast } from '../components/shared/Toast';

// Data + actions for the admin dashboard. Mirrors the pattern used by
// useGoals/useRecords: load on mount, mutate-then-reload, surface every
// failure through a toast so the admin never sees a blank screen.
export default function useAdmin() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  // Which user the activity log is filtered to ('' = everyone).
  const [activityFilter, setActivityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await fetchAdminUsers());
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  const loadActivities = useCallback(async (userId = '') => {
    try {
      setActivities(await fetchActivities(userId));
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadUsers(), loadActivities()]);
      setLoading(false);
    })();
  }, [loadUsers, loadActivities]);

  const filterByUser = async (userId) => {
    setActivityFilter(userId);
    await loadActivities(userId);
  };

  const changeRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      showToast('Role updated');
      await loadUsers();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      showToast('User deleted');
      // A deleted user's activity may be on screen — refresh both views.
      await Promise.all([loadUsers(), loadActivities(activityFilter)]);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  return {
    users, activities, activityFilter, loading,
    filterByUser, changeRole, removeUser
  };
}
