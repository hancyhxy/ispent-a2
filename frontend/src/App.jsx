import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import ToastContainer from './components/shared/Toast';
import BillsPage from './components/bills/BillsPage';
import AnalysisPage from './components/analysis/AnalysisPage';
import GoalsPage from './components/goals/GoalsPage';
import AdminPage from './components/admin/AdminPage';
import AuthPage from './components/auth/AuthPage';
import useAuth from './hooks/useAuth';
import { getCurrentMonth } from './utils/helpers';

export default function App() {
  const { user, loading, checkEmail, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('bills');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const isAdmin = user?.role === 'admin';
  // Defend against a non-admin landing on the admin route (e.g. stale
  // state after a role change): fall back to bills rather than rendering
  // a page whose every API call would 403.
  const activePage = currentPage === 'admin' && !isAdmin ? 'bills' : currentPage;

  // Auth gate
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage onCheckEmail={checkEmail} onLogin={login} onRegister={register} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar currentPage={activePage} onNavigate={setCurrentPage} isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-full pb-14 md:pb-0">
        <Header
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 min-h-0 px-4 lg:px-8 py-4 overflow-y-auto">
          {activePage === 'bills' && (
            <BillsPage selectedMonth={selectedMonth} />
          )}
          {activePage === 'analysis' && (
            <AnalysisPage selectedMonth={selectedMonth} />
          )}
          {activePage === 'goals' && (
            <GoalsPage />
          )}
          {activePage === 'admin' && isAdmin && (
            <AdminPage currentUserId={user.id} />
          )}
        </main>
      </div>

      <BottomTabBar currentPage={activePage} onNavigate={setCurrentPage} isAdmin={isAdmin} />
      <ToastContainer />
    </div>
  );
}
