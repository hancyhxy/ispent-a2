/* Author: Xinyi */
import { CATEGORY_MAP } from '../../constants/categories';
import { formatCurrency } from '../../utils/helpers';

export default function CategoryRanking({ data }) {
  if (data.length === 0) return null;

  return (
    <div className="bg-card rounded-3xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Category Ranking</h3>
      <div className="flex flex-col gap-3">
        {data.map((item, i) => {
          const cat = CATEGORY_MAP[item.category] || { icon: '💡', name: item.category };
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg w-8 h-8 flex items-center justify-center">{cat.icon}</span>
              <span className="text-sm font-medium text-text-primary flex-1">{cat.name}</span>
              <span className="text-xs text-text-muted mr-2">{item.percentage}%</span>
              <span className="text-sm font-semibold text-text-primary">{formatCurrency(item.amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
