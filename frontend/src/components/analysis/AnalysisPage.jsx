import useStats from '../../hooks/useStats';
import OverviewCards from './OverviewCards';
import DonutChart from './DonutChart';
import ExpenseBarChart from './ExpenseBarChart';
import CategoryRanking from './CategoryRanking';

export default function AnalysisPage({ selectedMonth }) {
  const { monthly, categories, daily, categoryType, setCategoryType, loading } = useStats(selectedMonth);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OverviewCards data={monthly} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <DonutChart
            data={categories.categories}
            total={categories.total}
            type={categoryType}
            onTypeChange={setCategoryType}
          />
          <CategoryRanking data={categories.categories} />
        </div>

        <ExpenseBarChart data={daily.daily} average={daily.average} />
      </div>
    </div>
  );
}
