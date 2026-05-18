/* Author: Xinyi */
import RecordItem from './RecordItem';
import EmptyState from '../shared/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function RecordList({ groupedRecords, onRecordClick }) {
  if (groupedRecords.length === 0) {
    return <EmptyState message="No records yet. Tap + to add your first one." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedRecords.map(group => (
        <div key={group.date}>
          {/* Date header */}
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-medium text-text-muted">
              {formatDate(group.date)}
            </span>
            <div className="flex gap-3 text-xs font-medium">
              {group.dayExpense > 0 && (
                <span className="text-decline">-{formatCurrency(group.dayExpense)}</span>
              )}
              {group.dayIncome > 0 && (
                <span className="text-growth">+{formatCurrency(group.dayIncome)}</span>
              )}
            </div>
          </div>

          {/* Records */}
          <div className="flex flex-col gap-2">
            {group.records.map(record => (
              <RecordItem
                key={record._id}
                record={record}
                onClick={() => onRecordClick(record)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
