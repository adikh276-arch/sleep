interface RatingSelectorProps {
  options: { emoji: string; label: string; value: number }[];
  value: number;
  onChange: (val: number) => void;
}

const RatingSelector = ({ options, value, onChange }: RatingSelectorProps) => {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`rating-btn ${value === opt.value ? 'rating-btn-selected' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <span className="text-xl">{opt.emoji}</span>
          <span className="font-body text-[10px] text-muted-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RatingSelector;
