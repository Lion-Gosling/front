import { useEffect, useState } from 'react';
import { Gift, ArrowLeft, ArrowRight } from 'lucide-react';
import StepIndicator from './StepIndicator';
import SupportProgramCard from './steps/SupportProgramCard';
import { getSupportPrograms } from '../lib/api';

export default function SupportPrograms({ form, onBack, onNext }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    getSupportPrograms(form).then((res) => {
      if (alive) setData(res);
    });
    return () => {
      alive = false;
    };
  }, [form]);

  if (!data) {
    return <div className="py-24 text-center text-sm text-gray-400">지원제도를 불러오는 중이에요…</div>;
  }

  const lumpSumLabel = data.lumpSums
    .map((p) => `${p.lumpSum.years}년간 정부 지원금 ${(p.lumpSum.amount / 10000).toLocaleString()}만원`)
    .join(' · ');

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 overflow-x-auto">
        <StepIndicator current={2} />
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-500">
          <Gift size={28} />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">놓치고 있는 지원제도가 있어요</h2>
        <p className="mt-3 max-w-xl text-sm text-gray-500">
          현재 재정 상태와 주거 조건을 고려했을 때, 아래 제도들을 통해 상당한 비용을 절감할 수 있어요.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {data.programs.map((program) => (
          <SupportProgramCard key={program.id} program={program} />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-1 rounded-2xl bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-bold text-gray-900">예상 총 절감 효과</div>
          <div className="text-sm text-gray-500">신청 가능한 모든 제도를 활용했을 때</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-amber-500">
            연간 약 {(data.annualSavingTotal / 10000).toLocaleString()}만원
          </div>
          {lumpSumLabel && <div className="text-xs text-gray-500">+ {lumpSumLabel}</div>}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-gray-600"
        >
          <ArrowLeft size={16} /> 진단 결과로 돌아가기
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
        >
          미래 자산 시뮬레이션 보기 <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
