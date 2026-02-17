import { SleepLog } from '@/types/sleep';

const STORAGE_KEY = 'sleepLogs';

export function getLogs(): SleepLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLog(log: SleepLog): void {
  const logs = getLogs();
  logs.unshift(log);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function removeLog(id: string): void {
  const logs = getLogs().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
