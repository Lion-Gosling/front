import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';
import StepIndicator from './StepIndicator';
import WizardShell from './steps/WizardShell';
import BasicInfoFields from './steps/BasicInfoFields';
import HousingPlanFields from './steps/HousingPlanFields';
import FutureGoalFields from './steps/FutureGoalFields';
import { createPersona, createScenario } from '../lib/api';

const DEFAULT_FORM = {
  age: '27',
  income: '300',
  incomeTouched: false,
  assets: '3500',
  expense: '130',
  expenseTouched: false,
  currentHousingType: 'family',
  currentHousingCost: '',
  debtBalance: '',
  debtMonthlyPayment: '',
  region: '서울 마포구',
  district: '마포구',
  housingType: '아파트',
  areaPyeong: '10',
  contractSliderPct: 35,
  wantsLoan: false,
  deposit: '5000',
  rent: '50',
  profileId: null,
  scenario: null,
  targetAsset: '15000',
  targetAssetTouched: false,
  targetYears: '5',
  targetYearsTouched: false,
  note: '',
  confirmedEvents: [],
};

const PAGES = [
  { title: '기본 정보', subtitle: '현재 재정 상태를 알려주세요', Fields: BasicInfoFields },
  { title: '희망 주거 정보', subtitle: '이사 계획을 알려주세요', Fields: HousingPlanFields },
  { title: '추가 정보', subtitle: '더 알려주고 싶은 내용이 있다면 적어주세요', Fields: FutureGoalFields },
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
  const [stepStatus, setStepStatus] = useState('idle'); // 'idle' | 'submitting' | 'error'
  const [stepError, setStepError] = useState(null);

  // 1스텝 완료 시 시작한 profile 생성 요청. 2스텝→3스텝 전환 시 이 값을 await한다.
  const profileRequestRef = useRef(null);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isLast = page === PAGES.length - 1;
  const { title, subtitle, Fields } = PAGES[page];

  const handleBack = () => {
    if (page === 0) onExit();
    else {
      setStepError(null);
      setDirection(-1);
      setPage((p) => p - 1);
    }
  };

  const handleNext = async () => {
    if (page === 0) {
      // financial-profiles 생성은 백그라운드로 시작만 해두고, 2스텝 진입은 바로 진행한다.
      profileRequestRef.current = createPersona(form);
      profileRequestRef.current.catch(() => {}); // 2스텝에서 await하기 전까지 unhandled rejection 방지
      setDirection(1);
      setPage(1);
      return;
    }

    if (page === 1) {
      setStepStatus('submitting');
      setStepError(null);
      try {
        if (!profileRequestRef.current) profileRequestRef.current = createPersona(form);
        const persona = await profileRequestRef.current;
        setField('profileId', persona.id);
        const scenario = await createScenario(persona.id, form);
        setField('scenario', scenario);
        setStepStatus('idle');
        setDirection(1);
        setPage(2);
      } catch (err) {
        // 어느 단계에서 실패했는지 알 수 없으므로, 다음 재시도 때 profile부터 다시 만든다.
        profileRequestRef.current = null;
        setStepStatus('error');
        setStepError('정보 제출에 실패했어요. 다시 시도해주세요.');
        console.error('[scenario] 제출 실패:', err.message);
      }
      return;
    }

    setStepStatus('submitting');
    setStepError(null);
    try {
      await onComplete(form);
      // 성공 시 App.jsx가 view를 바꿔 이 컴포넌트가 언마운트되므로 상태를 되돌릴 필요 없다.
    } catch (err) {
      setStepStatus('error');
      setStepError('진단 결과를 불러오지 못했어요. 다시 시도해주세요.');
      console.error('[diagnose] 진단 결과 조회 실패:', err.message);
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
        isSubmitting={stepStatus === 'submitting'}
        errorText={stepError}
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
