import { SleepLog } from '@/types/sleep';
import { formatMinutes } from '@/utils/timeUtils';
import { getScoreBand } from '@/utils/sleepScore';
import { QUALITY_OPTIONS } from '@/types/sleep';

interface TodaySnapshotProps {
  logs: SleepLog[];
}

const TodaySnapshot = ({ logs }: TodaySnapshotProps) => {
  const latest = logs[0];
  if (!latest) return null;

  const last7 = logs.slice(0, 7);
  const avgSleep = last7.length > 0
    ? Math.round(last7.reduce((s, l) => s + l.actualMinutes, 0) / last7.length)
    : 0;
  const avgScore = last7.length > 0
    ? Math.round(last7.reduce((s, l) => s + l.score, 0) / last7.length)
    : 0;

  const qualityLabel = QUALITY_OPTIONS.find(q => q.value === latest.quality)?.label || '—';
  const { className: scoreClass } = getScoreBand(latest.score);

  return (
    <div className="card-sleep">
      <h2 className="font-heading text-[15px] font-semibold text-foreground mb-3">Last Night</h2>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="stat-cell">
          <p className="font-body text-xs text-muted-foreground">Sleep</p>
          <p className="font-heading text-lg font-bold text-primary">{formatMinutes(latest.actualMinutes)}</p>
        </div>
        <div className="stat-cell">
          <p className="font-body text-xs text-muted-foreground">Score</p>
          <p className="font-heading text-lg font-bold text-primary">{latest.score}/100</p>
        </div>
        <div className="stat-cell">
          <p className="font-body text-xs text-muted-foreground">Quality</p>
          <p className="font-heading text-sm font-semibold text-foreground">{qualityLabel}</p>
        </div>
        <div className="stat-cell">
          <p className="font-body text-xs text-muted-foreground">Wake-ups</p>
          <p className="font-heading text-lg font-bold text-foreground">{latest.wakeUps}</p>
        </div>
      </div>

      {last7.length >= 2 && (
        <div>
          <p className="font-body text-xs text-muted-foreground mb-2">7-day averages</p>
          <div className="flex gap-2">
            <span className="font-body text-xs bg-surface-2 border border-border rounded-full px-3 py-1.5">
              Avg sleep: {formatMinutes(avgSleep)}
            </span>
            <span className="font-body text-xs bg-surface-2 border border-border rounded-full px-3 py-1.5">
              Avg score: {avgScore}/100
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaySnapshot;
