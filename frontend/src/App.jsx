import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import ToastContainer from './components/shared/Toast';
import BillsPage from './components/bills/BillsPage';
import AnalysisPage from './components/analysis/AnalysisPage';
import GoalsPage from './components/goals/GoalsPage';
import { getCurrentMonth } from './utils/helpers';

export default function App() {
  const [currentPage, setCurrentPage] = useState('bills');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        <Header selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        <main className="flex-1 px-4 lg:px-8 py-4 overflow-y-auto">
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
