import {
  Sparkles,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  ArrowRight,
  PenLine,
  HeartPulse,
  Gift,
  LineChart,
} from 'lucide-react';
import StepIndicator from './StepIndicator';

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'KB국민은행 제휴' },
  { icon: Lock, label: '데이터 안전 보호' },
  { icon: Clock, label: '3분이면 충분' },
  { icon: CheckCircle2, label: '국가 통계 기반' },
];

const FEATURES = [
  {
    icon: PenLine,
    step: 'STEP 1',
    title: '정보 입력',
    desc: '나이, 소득, 자산, 희망 지역 등 기본 정보를 입력해요. 3단계로 나눠져 있어 부담 없답니다.',
    bg: 'bg-amber-100',
    text: 'text-amber-500',
  },
  {
    icon: HeartPulse,
    step: 'STEP 2',
    title: 'AI 진단',
    desc: '입력한 정보를 바탕으로 AI가 재정 건전성을 분석하고, 적합·주의·부담 3단계로 결과를 알려드려요.',
    bg: 'bg-rose-100',
    text: 'text-rose-500',
  },
  {
    icon: Gift,
    step: 'STEP 3',
    title: '맞춤 추천',
    desc: '내 조건에 맞는 청년 지원제도와 KB 금융상품 중 놓치고 있던 것만 골라 추천해드려요.',
    bg: 'bg-teal-100',
    text: 'text-teal-600',
  },
  {
    icon: LineChart,
    step: 'STEP 4',
    title: '미래 예측',
    desc: '독립 시점에 따른 자산 변화를 비교하고, AI가 추천하는 최적의 선택지를 확인하세요.',
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
];

export default function Landing({ onStart }) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
          <Sparkles size={16} />
          AI 기반 사회초년생 미래자산 시뮬레이션
        </div>

        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
          독립, <span className="text-amber-400">지금이 적기일까?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
          단순 매물 추천이 아닌, 내 재정 상황을 진단하고 독립 시점에 따른 미래 자산까지 시뮬레이션하는
          <br />
          <span className="font-bold text-gray-800">AI 맞춤형 독립 준비 진단</span>을 받아보세요.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-gray-900 transition hover:bg-amber-500"
        >
          무료 진단 받기 <ArrowRight size={18} />
        </button>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon size={16} className="text-gray-400" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-16 overflow-x-auto">
          <StepIndicator current={0} />
        </div>
      </section>

      <section id="features" className="border-t border-gray-100 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl">3분이면 충분해요</h2>
          <p className="mt-3 text-gray-500">복잡한 서류 NO, 간단한 정보 입력만으로 진단을 시작하세요</p>

          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, step, title, desc, bg, text }) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg} ${text}`}>
                  <Icon size={28} strokeWidth={2} />
                </div>
                <div className="mt-4 text-xs font-semibold tracking-wide text-gray-400">{step}</div>
                <div className="mt-1 text-lg font-bold text-gray-900">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
