import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, CATEGORY_MAP } from '../../constants/categories';
import { formatCurrency } from '../../utils/helpers';

export default function DonutChart({ data, total, type, onTypeChange }) {
  const chartData = data.map((item, i) => ({
    ...item,
    name: CATEGORY_MAP[item.category]?.name || item.category,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const isEmpty = chartData.length === 0;

  return (
    <div className="bg-card rounded-3xl p-6">
      {/* Type toggle */}
      <div className="flex gap-2 mb-6">
        {['expense', 'income'].map(t => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors
              ${type === t ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-gray-200'}`}
          >
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-text-muted">No {type} data</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Chart */}
          <div className="relative w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{ borderRadius: 16, border: 'none', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.fill }} />
                <span className="text-xs font-medium text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
