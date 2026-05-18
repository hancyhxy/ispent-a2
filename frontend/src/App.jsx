import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import ToastContainer from './components/shared/Toast';
import BillsPage from './components/bills/BillsPage';
import AnalysisPage from './components/analysis/AnalysisPage';
import GoalsPage from './components/goals/GoalsPage';
import AuthPage from './components/auth/AuthPage';
import useAuth from './hooks/useAuth';
import { getCurrentMonth } from './utils/helpers';

export default function App() {
  const { user, loading, checkEmail, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('bills');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

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
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col h-full pb-14 md:pb-0">
        <Header
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 min-h-0 px-4 lg:px-8 py-4 overflow-y-auto">
          {currentPage === 'bills' && (
            <BillsPage selectedMonth={selectedMonth} />
          )}
          {currentPage === 'analysis' && (
            <AnalysisPage selectedMonth={selectedMonth} />
          )}
          {currentPage === 'goals' && (
            <GoalsPage />
          )}
        </main>
      </div>

      <BottomTabBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <ToastContainer />
    </div>
  );
}
