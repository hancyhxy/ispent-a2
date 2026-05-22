/* Author: Xinyi */
import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import ToastContainer from './components/shared/Toast';
import OnboardingTour, { hasSeenTour } from './components/shared/OnboardingTour';
import BillsPage from './components/bills/BillsPage';
import AnalysisPage from './components/analysis/AnalysisPage';
import GoalsPage from './components/goals/GoalsPage';
import AdminPage from './components/admin/AdminPage';
import AccountPage from './components/account/AccountPage';
import AuthPage from './components/auth/AuthPage';
import useAuth from './hooks/useAuth';
import { getCurrentMonth } from './utils/helpers';

export default function App() {
  const { user, loading, checkEmail, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('bills');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showTour, setShowTour] = useState(false);

  // Auto-open the walkthrough the first time a user reaches the app, then
  // never again (a localStorage flag remembers it). The "?" button can
  // reopen it on demand afterwards.
  useEffect(() => {
    if (user && !hasSeenTour()) setShowTour(true);
  }, [user]);

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
      <Sidebar currentPage={activePage} onNavigate={setCurrentPage} isAdmin={isAdmin} onLogout={logout} />

      {/* min-w-0 so the overflow constraint chain reaches <main>;
          a flex child's default min-width:auto would otherwise let
          inner content widen this column past the viewport. */}
      <div className="flex-1 min-w-0 flex flex-col h-full pb-14 md:pb-0">
        <Header
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          user={user}
          showMonthPicker={activePage !== 'account'}
        />

        {/* min-w-0 + overflow-x-hidden: without these, an inner
            overflow-x-auto row (e.g. the Goals filter pills) widens this
            flex child past the viewport instead of scrolling internally,
            pushing header actions off-screen on mobile. */}
        <main className="flex-1 min-h-0 min-w-0 px-4 lg:px-8 py-4 overflow-y-auto overflow-x-hidden">
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
          {activePage === 'account' && (
            <AccountPage user={user} onLogout={logout} />
          )}
        </main>
      </div>

      <BottomTabBar currentPage={activePage} onNavigate={setCurrentPage} isAdmin={isAdmin} />

      {/* Help launcher — reopens the walkthrough on demand. Sits above the
          bottom tab bar on mobile (bottom-20) and in the corner on desktop. */}
      <button
        onClick={() => setShowTour(true)}
        aria-label="Open product tour"
        className="fixed right-4 bottom-20 md:bottom-6 z-30 w-11 h-11 rounded-full
          bg-card text-primary shadow-pop flex items-center justify-center
          hover:bg-[var(--c-hover)] transition-colors"
      >
        <HelpCircle size={22} />
      </button>

      {showTour && (
        <OnboardingTour
          onClose={() => setShowTour(false)}
          onNavigate={setCurrentPage}
        />
      )}

      <ToastContainer />
    </div>
  );
}
