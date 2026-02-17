import { supabase, setUserContext } from './supabase';

export async function upsertUser(userId: number): Promise<void> {
  await setUserContext(userId);
  const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
  if (error) throw error;
}

import { SleepLog } from '@/types/sleep';

export async function saveSleepLog(userId: number, log: SleepLog) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('sleep_logs')
    .insert({
      user_id: userId,
      sleep_date: log.date,
      bedtime: log.bedtime,
      wake_time: log.wakeTime,
      total_minutes: log.totalMinutes,
      actual_minutes: log.actualMinutes,
      quality: log.quality,
      wake_ups: log.wakeUps,
      wake_duration_min: log.wakeDurationMin,
      symptoms: log.symptoms,
      aids: log.aids,
      wake_feeling: String(log.wakeFeeling),
      notes: log.notes,
      score: log.score
    });
  if (error) throw error;
}

export async function getSleepLogs(userId: number): Promise<SleepLog[]> {
  await setUserContext(userId);
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .order('sleep_date', { ascending: false });
  if (error) throw error;
  return data.map(d => ({
    id: d.id,
    date: d.sleep_date,
    bedtime: d.bedtime,
    wakeTime: d.wake_time,
    totalMinutes: d.total_minutes,
    actualMinutes: d.actual_minutes,
    quality: d.quality,
    wakeUps: d.wake_ups,
    wakeDurationMin: d.wake_duration_min,
    symptoms: d.symptoms,
    aids: d.aids,
    wakeFeeling: Number(d.wake_feeling),
    notes: d.notes,
    score: d.score
  }));
}

export async function deleteSleepLog(userId: number, id: string) {
  await setUserContext(userId);
  const { error } = await supabase
    .from('sleep_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
