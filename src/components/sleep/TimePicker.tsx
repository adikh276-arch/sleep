import { useState, useRef, useEffect } from 'react';
import { to12hr } from '@/utils/timeUtils';

interface TimePickerProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (val: string) => void;
}

const TimePicker = ({ label, sublabel, value, onChange }: TimePickerProps) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.showPicker?.();
    }
  }, [editing]);

  return (
    <div className="flex-1 bg-surface-2 rounded-[14px] p-3.5">
      <div className="flex items-center gap-1">
        <span className="font-body text-xs text-muted-foreground">{label}</span>
        {sublabel && <span className="font-body text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
      <div className="font-heading text-2xl font-bold text-foreground mt-1">
        {to12hr(value)}
      </div>
      {editing ? (
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={e => { onChange(e.target.value); setEditing(false); }}
          onBlur={() => setEditing(false)}
          className="input-sleep mt-1 text-sm"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="font-body text-xs text-primary mt-1"
        >
          Change
        </button>
      )}
    </div>
  );
};

export default TimePicker;
