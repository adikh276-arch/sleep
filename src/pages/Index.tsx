import { useState, useCallback } from 'react';
import TopBar from '@/components/sleep/TopBar';
import LogCard from '@/components/sleep/LogCard';
import SleepScoreCard from '@/components/sleep/SleepScoreCard';
import TodaySnapshot from '@/components/sleep/TodaySnapshot';
import RecentEntries from '@/components/sleep/RecentEntries';
import HistoryDrawer from '@/components/sleep/HistoryDrawer';
import { SleepLog } from '@/types/sleep';
import { getLogs } from '@/utils/sleepStorage';

const Index = () => {
  const [logs, setLogs] = useState<SleepLog[]>(getLogs);
  const [lastSaved, setLastSaved] = useState<SleepLog | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const refreshLogs = useCallback(() => setLogs(getLogs()), []);

  const handleSave = (log: SleepLog) => {
    setLastSaved(log);
    refreshLogs();
  };

  const handleRemove = (id: string) => {
    refreshLogs();
    if (lastSaved?.id === id) setLastSaved(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenHistory={() => setHistoryOpen(true)} />

      <div className="mx-auto max-w-[430px] px-4 py-4 pb-24 space-y-3">
        <LogCard onSave={handleSave} />
        <SleepScoreCard log={lastSaved} />
        <TodaySnapshot logs={logs} />
        <RecentEntries logs={logs} onRemove={handleRemove} onViewAll={() => setHistoryOpen(true)} />
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} logs={logs} onRemove={handleRemove} />
    </div>
  );
};

export default Index;
