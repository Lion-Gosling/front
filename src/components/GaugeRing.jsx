import { motion } from 'motion/react';

const TONE = {
  green: { ring: '#22c55e', tagBg: 'bg-green-50', tagText: 'text-green-700' },
  amber: { ring: '#f59e0b', tagBg: 'bg-amber-50', tagText: 'text-amber-700' },
  red: { ring: '#ef4444', tagBg: 'bg-red-50', tagText: 'text-red-700' },
};

export default function GaugeRing({ percent, value, label, tag, tone = 'green', delay = 0 }) {
  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference * (1 - clamped / 100);
  const colors = TONE[tone] ?? TONE.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6"
    >
      <div className="relative h-32 w-32">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EEEBE4"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: delay + 0.15, ease: 'easeOut' }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: delay + 0.7 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-xl font-bold text-gray-900">{value}</span>
        </motion.div>
      </div>
      <div className="text-center">
        <div className="mb-2 text-sm text-gray-500">{label}</div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors.tagBg} ${colors.tagText}`}
        >
          {tag}
        </span>
      </div>
    </motion.div>
  );
}
