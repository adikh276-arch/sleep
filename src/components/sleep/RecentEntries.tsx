import { useState } from 'react';
import { SleepLog } from '@/types/sleep';
import { formatMinutes, formatDateDDMM } from '@/utils/timeUtils';
import { getScoreBand } from '@/utils/sleepScore';
import { removeLog } from '@/utils/sleepStorage';

interface RecentEntriesProps {
  logs: SleepLog[];
  onRemove: (id: string) => void;
  onViewAll: () => void;
}

const RecentEntries = ({ logs, onRemove, onViewAll }: RecentEntriesProps) => {
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const recent = logs.slice(0, 5);

  if (recent.length === 0) return null;

  const handleRemove = (id: string) => {
    removeLog(id);
    onRemove(id);
    setSwipedId(null);
  };

  return (
    <div>
      <h3 className="font-heading text-sm font-bold text-muted-foreground mb-3">Recent Entries</h3>
      <div className="space-y-2">
        {recent.map(log => {
          const { className: scoreClass } = getScoreBand(log.score);
          const isSwiped = swipedId === log.id;

          return (
            <div key={log.id} className="relative overflow-hidden rounded-2xl">
              {/* Remove button behind */}
              <div className="absolute right-0 inset-y-0 flex items-center">
                <button
                  onClick={() => handleRemove(log.id)}
                  className="h-full px-5 bg-alert text-white font-body text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div
                className={`bg-surface border border-border rounded-2xl p-3 px-4 transition-transform duration-200 ${isSwiped ? '-translate-x-20' : ''}`}
                onClick={() => setSwipedId(isSwiped ? null : log.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs bg-surface-2 rounded-full px-2.5 py-1">
                      {formatDateDDMM(log.date)}
                    </span>
                    <span className="font-body text-sm text-foreground">
                      {formatMinutes(log.actualMinutes)}
                    </span>
                  </div>
                  <span className={`score-badge ${scoreClass}`}>{log.score}</span>
                </div>
                {log.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {log.symptoms.map(s => (
                      <span key={s} className="chip text-xs py-1 px-2">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onViewAll}
        className="w-full mt-3 font-body text-sm text-primary font-medium py-2"
      >
        View all
      </button>
    </div>
  );
};

export default RecentEntries;
