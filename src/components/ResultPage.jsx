import { Smile, Frown, Meh, Check, Info, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import StepIndicator from './StepIndicator';
import GaugeRing from './GaugeRing';

const GRADE_TONE = {
  green: { bg: 'bg-green-50', ring: 'bg-white/70', text: 'text-green-700', Icon: Smile },
  amber: { bg: 'bg-amber-50', ring: 'bg-white/70', text: 'text-amber-700', Icon: Meh },
  red: { bg: 'bg-red-50', ring: 'bg-white/70', text: 'text-red-700', Icon: Frown },
};

const REASON_ICON = {
  check: { Icon: Check, bg: 'bg-green-100', text: 'text-green-600' },
  info: { Icon: Info, bg: 'bg-green-100', text: 'text-green-600' },
  warning: { Icon: AlertTriangle, bg: 'bg-gray-100', text: 'text-gray-500' },
  tip: { Icon: Lightbulb, bg: 'bg-amber-100', text: 'text-amber-600' },
};

function burdenTone(tag) {
  if (tag === '적정') return 'green';
  if (tag === '주의') return 'amber';
  return 'red';
}

function savingsTone(tag) {
  if (tag === '양호') return 'green';
  if (tag === '보통') return 'amber';
  return 'red';
}

function goalTone(tag) {
  return tag === '달성 가능' ? 'green' : 'red';
}

export default function ResultPage({ form, result, onCheckSupport }) {
  const tone = GRADE_TONE[result.grade.tone];
  const ToneIcon = tone.Icon;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 overflow-x-auto">
        <StepIndicator current={1} />
      </div>

      <div className={`flex flex-col gap-6 rounded-2xl ${tone.bg} p-8 sm:flex-row sm:items-center`}>
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${tone.ring}`}>
          <ToneIcon className={tone.text} size={30} />
        </div>
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`inline-block rounded-full bg-white/70 px-3 py-1 text-sm font-semibold ${tone.text}`}>
              {result.grade.label}
            </span>
            <span className="text-3xl font-extrabold text-gray-900">
              {result.score}점 <span className="text-lg font-medium text-gray-400">/ 100</span>
            </span>
          </div>
          <p className={`mt-2 text-sm ${tone.text}`}>
            {result.grade.tone === 'green'
              ? '현재 재정 상태에서 무리 없이 감당 가능한 수준이에요'
              : result.grade.tone === 'amber'
              ? '조금의 조정이 필요하지만 감당할 수 있는 수준이에요'
              : '현재 조건은 재정에 부담이 될 수 있어요'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            현재 재정 상태에서 희망하는 주거 조건은 {result.grade.tone === 'green' ? '무리 없이 감당 가능한' : '주의가 필요한'} 수준입니다.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {form.region} · 보증금 {Number(form.deposit).toLocaleString()}만원 · 월세 {form.rent}만원
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <GaugeRing
          percent={Math.min(result.housingBurdenRatio, 100)}
          value={`${result.housingBurdenRatio.toFixed(1)}%`}
          label="주거비 부담률"
          tag={result.burdenTag}
          tone={burdenTone(result.burdenTag)}
          delay={0}
        />
        <GaugeRing
          percent={Math.min(Math.max((result.monthlySavings / Number(form.income)) * 100, 0), 100)}
          value={`${result.monthlySavings.toLocaleString()}만원`}
          label="월 저축 가능"
          tag={result.savingsTag}
          tone={savingsTone(result.savingsTag)}
          delay={0.12}
        />
        <GaugeRing
          percent={
            Number.isFinite(result.yearsToGoal)
              ? Math.min(Math.max(100 - (result.yearsToGoal / Number(form.targetYears)) * 50, 0), 100)
              : 0
          }
          value={Number.isFinite(result.yearsToGoal) ? `${result.yearsToGoal.toFixed(1)}년` : '∞'}
          label="목표 달성 예상"
          tag={result.goalTag}
          tone={goalTone(result.goalTag)}
          delay={0.24}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-400">월 주거비</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {result.monthlyHousingCost.toLocaleString()}만원
          </div>
          <div className="mt-1 text-xs text-gray-400">보증금 기회비용 포함</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-400">비상금 커버 기간</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{result.emergencyMonths.toFixed(1)}개월</div>
          <div className="mt-1 text-xs text-gray-400">현재 자산 기준</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-400">DTI (총부채상환비율)</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{result.dti.toFixed(1)}%</div>
          <div className="mt-1 text-xs text-gray-400">부채 없음 기준</div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-bold text-gray-900">왜 이 결과가 나왔을까요?</h3>
        <div className="space-y-3">
          {result.reasons.map((reason) => {
            const { Icon, bg, text } = REASON_ICON[reason.type];
            return (
              <div key={reason.title} className={`flex gap-4 rounded-xl ${bg} p-5`}>
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${text}`}>
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{reason.title}</div>
                  <p className="mt-1 text-sm text-gray-600">{reason.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onCheckSupport}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
        >
          놓치고 있는 지원제도 확인하기 <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
