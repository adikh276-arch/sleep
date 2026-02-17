import { useState } from 'react';
import { X, Search, Download } from 'lucide-react';
import { SleepLog } from '@/types/sleep';
import { formatMinutes, formatDateFull, formatDateDDMM, getDayLabel } from '@/utils/timeUtils';
import { getScoreBand, getScoreColor } from '@/utils/sleepScore';
import { removeLog } from '@/utils/sleepStorage';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  logs: SleepLog[];
  onRemove: (id: string) => void;
}

const HistoryDrawer = ({ open, onClose, logs, onRemove }: HistoryDrawerProps) => {
  const [search, setSearch] = useState('');

  if (!open) return null;

  const last7 = logs.slice(0, 7).reverse();
  const maxDuration = Math.max(...last7.map(l => l.totalMinutes), 480);

  // 30-day heatmap
  const last30Days: { date: string; log?: SleepLog }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    last30Days.push({ date: ds, log: logs.find(l => l.date === ds) });
  }

  const filtered = search
    ? logs.filter(l => l.date.includes(search) || l.notes.toLowerCase().includes(search.toLowerCase()) || l.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase())))
    : logs;

  const handleRemove = (id: string) => {
    removeLog(id);
    onRemove(id);
  };

  const handleExport = () => {
    const csv = ['Date,Bedtime,WakeTime,TotalMin,ActualMin,Quality,WakeUps,Score,Symptoms,Notes']
      .concat(logs.map(l => `${l.date},${l.bedtime},${l.wakeTime},${l.totalMinutes},${l.actualMinutes},${l.quality},${l.wakeUps},${l.score},"${l.symptoms.join(';')}","${l.notes}"`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sleep-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHeatmapStyle = (log?: SleepLog) => {
    if (!log) return 'bg-surface-2 text-muted-foreground';
    if (log.score > 80) return 'bg-success-light text-success';
    if (log.score > 60) return 'bg-primary-light text-primary-dark';
    if (log.score > 40) return 'bg-warning-light text-warning';
    return 'bg-alert-light text-alert';
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-background rounded-t-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-heading text-base font-bold text-foreground">Sleep Records</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-muted-foreground" /></button>
        </div>

        <div className="px-4 pb-20 space-y-4">
          {/* 7-day bar chart */}
          {last7.length > 0 && (
            <div className="bg-surface rounded-2xl p-4 border border-border">
              <div className="flex items-end gap-2 h-[140px]">
                {last7.map(log => {
                  const sleepH = (log.actualMinutes / maxDuration) * 100;
                  const awakeH = ((log.totalMinutes - log.actualMinutes) / maxDuration) * 100;
                  const { className } = getScoreBand(log.score);
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`score-badge text-[10px] px-1.5 py-0.5 ${className}`}>{log.score}</span>
                      <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden" style={{ height: `${sleepH + awakeH}%` }}>
                        <div className="bg-primary w-full" style={{ height: `${sleepH / (sleepH + awakeH) * 100}%` }} />
                        <div className="bg-alert/25 w-full" style={{ height: `${awakeH / (sleepH + awakeH) * 100}%` }} />
                      </div>
                      <span className="font-body text-[10px] text-muted-foreground">{getDayLabel(log.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 30-day heatmap */}
          <div>
            <p className="font-body text-xs text-muted-foreground mb-2">30-day overview</p>
            <div className="grid grid-cols-7 gap-1.5">
              {last30Days.map(({ date, log }) => (
                <div
                  key={date}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-heading font-semibold ${getHeatmapStyle(log)}`}
                  title={log ? `${formatDateFull(date)}: Score ${log.score}` : formatDateFull(date)}
                >
                  {new Date(date + 'T00:00:00').getDate()}
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="input-sleep pl-9"
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Log list */}
          <div className="space-y-2">
            {filtered.map(log => {
              const { className: scoreClass } = getScoreBand(log.score);
              return (
                <div key={log.id} className="bg-surface border border-border rounded-2xl p-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs bg-surface-2 rounded-full px-2.5 py-1">{formatDateFull(log.date)}</span>
                      <span className="font-body text-sm text-foreground">{formatMinutes(log.actualMinutes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`score-badge ${scoreClass}`}>{log.score}</span>
                      <button
                        onClick={() => handleRemove(log.id)}
                        className="text-muted-foreground hover:text-alert transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {log.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.symptoms.map(s => (
                        <span key={s} className="chip text-xs py-0.5 px-2">{s}</span>
                      ))}
                    </div>
                  )}
                  {log.notes && <p className="font-body text-xs text-muted-foreground mt-1">{log.notes}</p>}
                </div>
              );
            })}
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 font-body text-sm text-primary font-medium border border-border rounded-xl"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;
