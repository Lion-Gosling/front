import { Fragment } from 'react';
import { motion } from 'motion/react';
import { PenLine, HeartPulse, Gift, LineChart, Check } from 'lucide-react';

const STEPS = [
  { icon: PenLine, label: '정보 입력' },
  { icon: HeartPulse, label: '진단 결과' },
  { icon: Gift, label: '지원제도' },
  { icon: LineChart, label: '시뮬레이션' },
];

export default function StepIndicator({ current = 0, compact = false }) {
  return (
    <div className="flex items-start justify-center">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;

        return (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.08, ease: 'backOut' }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  done || active
                    ? 'bg-amber-400 text-white'
                    : 'bg-[#F0EDE6] text-gray-400'
                }`}
              >
                {done ? <Check size={20} strokeWidth={3} /> : <Icon size={20} strokeWidth={2.25} />}
              </motion.div>
              {!compact && (
                <div className="text-center">
                  <div className="text-xs text-gray-400">Step {i + 1}</div>
                  <div
                    className={`text-xs ${
                      active ? 'font-semibold text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-1 mt-5 h-0.5 w-14 shrink-0 overflow-hidden bg-[#F0EDE6] md:w-24">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 + 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                  className="h-full w-full bg-amber-400"
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
