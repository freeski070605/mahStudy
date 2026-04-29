interface ProgressRingProps {
  value: number;
  size?: number;
  label?: string;
}

const ProgressRing = ({ value, size = 108, label = 'ready' }: ProgressRingProps) => {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f4ded2" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e77f55"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-stone-900">{progress}%</div>
        <div className="text-xs font-medium text-stone-500">{label}</div>
      </div>
    </div>
  );
};

export default ProgressRing;
