interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  exclusive?: string; // If this option is selected, deselect all others
}

const ChipSelector = ({ options, selected, onChange, exclusive }: ChipSelectorProps) => {
  const toggle = (opt: string) => {
    if (exclusive && opt === exclusive) {
      onChange([exclusive]);
      return;
    }
    const without = selected.filter(s => s !== exclusive);
    if (without.includes(opt)) {
      onChange(without.filter(s => s !== opt));
    } else {
      onChange([...without, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          className={`chip ${selected.includes(opt) ? 'chip-selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default ChipSelector;
