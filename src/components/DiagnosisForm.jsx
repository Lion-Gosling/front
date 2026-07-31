import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';
import StepIndicator from './StepIndicator';
import WizardShell from './steps/WizardShell';
import BasicInfoFields from './steps/BasicInfoFields';
import HousingPlanFields from './steps/HousingPlanFields';
import FutureGoalFields from './steps/FutureGoalFields';

const DEFAULT_FORM = {
  age: '27',
  income: '300',
  assets: '3500',
  expense: '130',
  debt: '',
  region: '서울 마포구',
  deposit: '5000',
  rent: '50',
  targetAsset: '15000',
  targetYears: '5',
};

const PAGES = [
  { title: '기본 정보', subtitle: '현재 재정 상태를 알려주세요', Fields: BasicInfoFields },
  { title: '희망 주거 정보', subtitle: '이사 계획을 알려주세요', Fields: HousingPlanFields },
  { title: '미래 목표', subtitle: '장기적인 재정 목표를 알려주세요', Fields: FutureGoalFields },
];

const fieldVariants = {
  initial: (direction) => ({ opacity: 0, x: direction > 0 ? 32 : -32 }),
  animate: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -32 : 32 }),
};

export default function DiagnosisForm({ onComplete, onExit }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isLast = page === PAGES.length - 1;
  const { title, subtitle, Fields } = PAGES[page];

  const handleBack = () => {
    if (page === 0) onExit();
    else {
      setDirection(-1);
      setPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (isLast) onComplete(form);
    else {
      setDirection(1);
      setPage((p) => p + 1);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-3xl overflow-x-auto px-6 pt-12">
        <StepIndicator current={0} />
      </div>
      <WizardShell
        title={title}
        subtitle={subtitle}
        page={page + 1}
        totalPages={PAGES.length}
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={isLast ? '진단 받기' : '다음'}
        nextIcon={isLast ? Heart : undefined}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-6"
          >
            <Fields form={form} setField={setField} />
          </motion.div>
        </AnimatePresence>
      </WizardShell>
    </div>
  );
}
