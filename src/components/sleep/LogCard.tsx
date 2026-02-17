import { useState } from 'react';
import TimePicker from './TimePicker';
import Stepper from './Stepper';
import ChipSelector from './ChipSelector';
import RatingSelector from './RatingSelector';
import { SleepLog, SYMPTOMS, AIDS, QUALITY_OPTIONS, WAKING_OPTIONS } from '@/types/sleep';
import { calcTotalMinutes, formatMinutes, getTodayStr } from '@/utils/timeUtils';
import { calculateScore } from '@/utils/sleepScore';
import { saveLog, generateId } from '@/utils/sleepStorage';

interface LogCardProps {
  onSave: (log: SleepLog) => void;
}

const LogCard = ({ onSave }: LogCardProps) => {
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(0);
  const [wakeUps, setWakeUps] = useState(0);
  const [wakeDuration, setWakeDuration] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [aids, setAids] = useState<string[]>([]);
  const [wakeFeeling, setWakeFeeling] = useState(0);
  const [notes, setNotes] = useState('');
  const [showToast, setShowToast] = useState(false);

  const totalMinutes = calcTotalMinutes(bedtime, wakeTime);
  const actualMinutes = Math.max(0, totalMinutes - wakeDuration);

  const handleSave = () => {
    const symptomCount = symptoms.filter(s => s !== 'None').length;
    const score = calculateScore(actualMinutes, quality || 3, wakeUps, symptomCount);

    const log: SleepLog = {
      id: generateId(),
      date: getTodayStr(),
      bedtime,
      wakeTime,
      totalMinutes,
      actualMinutes,
      quality: quality || 3,
      wakeUps,
      wakeDurationMin: wakeDuration,
      symptoms: symptoms.filter(s => s !== 'None'),
      aids: aids.filter(s => s !== 'None'),
      wakeFeeling: wakeFeeling || 3,
      notes,
      score,
    };

    saveLog(log);
    onSave(log);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    // Reset
    setBedtime('23:00');
    setWakeTime('07:00');
    setQuality(0);
    setWakeUps(0);
    setWakeDuration(0);
    setSymptoms([]);
    setAids([]);
    setWakeFeeling(0);
    setNotes('');
  };

  return (
    <>
      <div className="card-sleep space-y-5">
        <h2 className="font-heading text-[15px] font-semibold text-foreground">Log Sleep Session</h2>

        {/* Time blocks */}
        <div className="flex gap-3">
          <TimePicker label="Bedtime" sublabel="(prev. night)" value={bedtime} onChange={setBedtime} />
          <TimePicker label="Wake time" value={wakeTime} onChange={setWakeTime} />
        </div>
        <div className="text-center">
          <span className="font-heading text-lg font-bold text-primary">
            Total: {formatMinutes(totalMinutes)}
          </span>
        </div>

        {/* Quality */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Sleep quality</label>
          <RatingSelector options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
        </div>

        {/* Wake-ups */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Times woken</label>
          <Stepper value={wakeUps} min={0} max={10} onChange={setWakeUps} />
        </div>

        {wakeUps > 0 && (
          <div className="animate-fade-in">
            <label className="font-body text-xs text-muted-foreground mb-2 block">Approx. time awake (mins)</label>
            <Stepper value={wakeDuration} min={0} max={180} step={5} onChange={setWakeDuration} />
            <p className="font-body text-[13px] text-muted-foreground mt-2">
              Estimated sleep: {formatMinutes(actualMinutes)}
            </p>
          </div>
        )}

        {/* Symptoms */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Symptoms during sleep</label>
          <ChipSelector options={SYMPTOMS} selected={symptoms} onChange={setSymptoms} exclusive="None" />
        </div>

        {/* Aids */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Sleep aids</label>
          <ChipSelector options={AIDS} selected={aids} onChange={setAids} exclusive="None" />
        </div>

        {/* Waking state */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Waking state</label>
          <RatingSelector options={WAKING_OPTIONS} value={wakeFeeling} onChange={setWakeFeeling} />
        </div>

        {/* Notes */}
        <div>
          <label className="font-body text-xs text-muted-foreground mb-2 block">Notes</label>
          <input
            className="input-sleep"
            placeholder="Optional notes..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="border-t border-border-light pt-4">
          <button className="btn-primary" onClick={handleSave}>Save Entry</button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-surface border border-border rounded-xl px-5 py-3 font-body text-sm text-foreground"
            style={{ boxShadow: 'var(--toast-shadow)' }}>
            Entry saved.
          </div>
        </div>
      )}
    </>
  );
};

export default LogCard;
