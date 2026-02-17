import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}

const Stepper = ({ value, min, max, step = 1, onChange }: StepperProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        className="stepper-btn"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <Minus size={18} />
      </button>
      <span className="font-heading text-[32px] font-bold text-primary min-w-[50px] text-center">
        {value}
      </span>
      <button
        className="stepper-btn"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label="Increase"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default Stepper;
