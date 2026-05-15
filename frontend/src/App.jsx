import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import ToastContainer from './components/shared/Toast';
import BillsPage from './components/bills/BillsPage';
import AnalysisPage from './components/analysis/AnalysisPage';
import GoalsPage from './components/goals/GoalsPage';
import MockGoalsPage from './components/goals/mock/MockGoalsPage';
import { getCurrentMonth } from './utils/helpers';

export default function App() {
  const [currentPage, setCurrentPage] = useState('bills');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // A2 design-mock route — visit /#mock to preview the new Goals page.
  const [isMock, setIsMock] = useState(() => window.location.hash === '#mock');
  useEffect(() => {
    const onHashChange = () => setIsMock(window.location.hash === '#mock');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (isMock) {
    return (
      <div className="h-screen overflow-y-auto bg-surface">
        <div className="px-4 lg:px-8 py-6">
          <MockGoalsPage />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col h-full pb-14 md:pb-0">
        <Header selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        <main className="flex-1 min-h-0 px-4 lg:px-8 py-4 overflow-y-auto">
          {currentPage === 'bills' && (
            <BillsPage selectedMonth={selectedMonth} />
          )}
          {currentPage === 'analysis' && (
            <AnalysisPage selectedMonth={selectedMonth} />
          )}
          {currentPage === 'goals' && (
            <GoalsPage selectedMonth={selectedMonth} />
          )}
        </main>
      </div>

      <BottomTabBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <ToastContainer />
    </div>
  );
}
