/* Author: Xinyi */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helpers';

export default function ExpenseBarChart({ data, average }) {
  const isEmpty = data.every(d => d.amount === 0);

  if (isEmpty) {
    return (
      <div className="bg-card rounded-3xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Daily Expense Trend</h3>
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-text-muted">No data for this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Daily Expense Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Amount']}
            labelFormatter={(label) => `Day ${label}`}
            contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
          />
          {average > 0 && (
            <ReferenceLine
              y={average}
              stroke="#F97316"
              strokeDasharray="6 4"
              label={{
                value: `Avg: ${formatCurrency(average)}`,
                position: 'insideTopRight',
                fontSize: 11,
                fill: '#F97316',
                offset: 8,
              }}
            />
          )}
          <Bar
            dataKey="amount"
            fill="#4B6EF5"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
