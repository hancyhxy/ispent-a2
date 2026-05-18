/* Author: Xinyi */
import BudgetCard from './BudgetCard';
import EmptyState from '../shared/EmptyState';

export default function BudgetList({ budgets, onBudgetClick }) {
  if (budgets.length === 0) {
    return <EmptyState message="No budgets set. Tap + to create your first budget goal." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {budgets.map(budget => (
        <BudgetCard
          key={budget._id}
          budget={budget}
          onClick={() => onBudgetClick(budget)}
        />
      ))}
    </div>
  );
}
