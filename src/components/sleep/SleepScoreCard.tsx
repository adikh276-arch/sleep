import { useEffect, useState } from 'react';
import { SleepLog, FACTS } from '@/types/sleep';
import { getScoreBand, getScoreColor } from '@/utils/sleepScore';

interface SleepScoreCardProps {
  log: SleepLog | null;
}

const SleepScoreCard = ({ log }: SleepScoreCardProps) => {
  const [factIndex, setFactIndex] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setFactIndex(i => (i + 1) % FACTS.length), 8000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (log) {
      setAnimated(false);
      requestAnimationFrame(() => setAnimated(true));
    }
  }, [log]);

  if (!log) return null;

  const { label, className } = getScoreBand(log.score);
  const color = getScoreColor(log.score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (log.score / 100) * circumference;

  return (
    <div className="card-sleep animate-fade-in">
      <h2 className="font-heading text-[15px] font-semibold text-foreground mb-4">Sleep Score</h2>

      <div className="flex flex-col items-center">
        <div className="relative w-[110px] h-[110px]">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(216, 25%, 95%)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? offset : circumference}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-[34px] font-bold text-foreground">{log.score}</span>
          </div>
        </div>
        <span className={`score-badge mt-3 ${className}`}>{label}</span>
      </div>

      <p className="font-body text-[13px] text-muted-foreground italic text-center mt-4 px-2 min-h-[40px]"
        key={factIndex}
        style={{ animation: 'fade-in 0.5s ease' }}>
        {FACTS[factIndex]}
      </p>
    </div>
  );
};

export default SleepScoreCard;
