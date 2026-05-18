/* Author: Xinyi */
import { useState } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import useAdmin from '../../hooks/useAdmin';
import ConfirmDialog from '../shared/ConfirmDialog';

// AdminPage is the admin-only view over iSpent's fourth entity
// (user_activity) plus account management. It is reachable only when the
// logged-in user's role is 'admin' — the Sidebar hides the tab otherwise,
// and every endpoint it calls is guarded by requireAdmin on the server.
export default function AdminPage({ currentUserId }) {
  const {
    users, activities, activityFilter, loading,
    filterByUser, changeRole, removeUser
  } = useAdmin();

  const [confirmUser, setConfirmUser] = useState(null);

  const handleConfirmDelete = async () => {
    if (confirmUser) {
      await removeUser(confirmUser.id);
      setConfirmUser(null);
    }
  };

  // Map an action to a small colour cue so the log scans quickly.
  const actionColor = (action) => {
    if (action === 'delete') return 'text-error';
    if (action === 'create') return 'text-success';
    if (action === 'login' || action === 'logout') return 'text-primary';
    return 'text-text-secondary';
  };

  const fmtTime = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Shield size={20} className="text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Admin Dashboard</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Manage accounts and review user activity across iSpent.
          </p>
        </div>
      </div>

      {/* ---- User management ---- */}
      <section className="mb-10">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">
          Users ({users.length})
        </h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-primary">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-text-muted">(you)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-4 py-3">
                        {/* An admin cannot change their own role — the
                            server enforces this too; disabling here just
                            avoids a guaranteed-to-fail request. */}
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-surface border border-border
                            text-text-primary text-xs focus:outline-none focus:ring-2
                            focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => filterByUser(u.id)}
                          className="text-primary hover:underline"
                        >
                          {u.activityCount} events
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setConfirmUser(u)}
                          disabled={isSelf}
                          title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                          className="inline-flex items-center gap-1 text-error text-xs
                            hover:underline disabled:opacity-40 disabled:cursor-not-allowed
                            disabled:no-underline"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- Activity log (the user_activity entity) ---- */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-secondary">
            Activity Log
            {activityFilter && (
              <span className="ml-2 text-xs font-normal text-text-muted">
                (filtered to one user)
              </span>
            )}
          </h3>
          {activityFilter && (
            <button
              onClick={() => filterByUser('')}
              className="text-primary text-xs font-medium hover:underline"
            >
              Show all users
            </button>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {activities.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-12">
              No activity recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a._id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {fmtTime(a.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {a.userEmail || '—'}
                      </td>
                      <td className={`px-4 py-3 font-medium ${actionColor(a.action)}`}>
                        {a.action}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{a.entity}</td>
                      <td className="px-4 py-3 text-text-muted">{a.detail || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this user?"
        message={
          confirmUser
            ? `Remove ${confirmUser.name} (${confirmUser.email}) and all of their records, goals, budgets, and activity? This cannot be undone.`
            : ''
        }
      />
    </div>
  );
}
