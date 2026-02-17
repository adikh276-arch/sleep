import { useState, useCallback, useEffect } from 'react';
import TopBar from '@/components/sleep/TopBar';
import LogCard from '@/components/sleep/LogCard';
import SleepScoreCard from '@/components/sleep/SleepScoreCard';
import TodaySnapshot from '@/components/sleep/TodaySnapshot';
import RecentEntries from '@/components/sleep/RecentEntries';
import HistoryDrawer from '@/components/sleep/HistoryDrawer';
import { SleepLog } from '@/types/sleep';
import { getUserId } from '@/lib/auth';
import { getSleepLogs, deleteSleepLog } from '@/lib/db';

const Index = () => {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<SleepLog | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const refreshLogs = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getSleepLogs(userId);
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch sleep logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const handleSave = (log: SleepLog) => {
    setLastSaved(log);
    refreshLogs();
  };

  const handleRemove = async (id: string) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      await deleteSleepLog(userId, id);
      refreshLogs();
      if (lastSaved?.id === id) setLastSaved(null);
    } catch (error) {
      console.error('Failed to remove sleep log:', error);
    }
  };

  if (loading) return null;

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
