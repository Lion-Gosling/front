import { Smile, Frown, Meh, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import StepIndicator from './StepIndicator';
import AssetBandChart from './AssetBandChart';

const GRADE_TONE = {
  green: { bg: 'bg-green-50', ring: 'bg-white/70', text: 'text-green-700', Icon: Smile },
  amber: { bg: 'bg-amber-50', ring: 'bg-white/70', text: 'text-amber-700', Icon: Meh },
  red: { bg: 'bg-red-50', ring: 'bg-white/70', text: 'text-red-700', Icon: Frown },
};

const SCORE_BREAKDOWN_LABELS = { goal: '목표달성', burden: '주거비부담', dti: 'DTI', cash: '초기자금' };

function burdenBarTone(tag) {
  if (tag === '적정') return 'bg-green-500';
  if (tag === '주의') return 'bg-amber-500';
  return 'bg-red-500';
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
            {form.region} · 보증금 {Number(form.deposit).toLocaleString()}만원 · 월세 {form.rent}만원
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {Object.entries(SCORE_BREAKDOWN_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-xl border border-gray-100 bg-white p-3">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="mt-1 text-lg font-bold text-gray-900">{result.scoreBreakdown[key]}</div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${Math.min(Math.max(result.scoreBreakdown[key], 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {result.warning && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
                <div>
                  <p className="font-semibold text-amber-800">{result.warning.message}</p>
                  <p className="mt-1 text-sm text-amber-700">아래 결과는 이 조건 그대로 계산됐어요.</p>
                  {result.warning.inputRent != null && (
                    <p className="mt-3 text-xs text-amber-700">
                      입력 월세: {result.warning.inputRent}만원 &nbsp;|&nbsp; 시세 중앙값: {result.warning.medianRent}
                      만원 &nbsp;|&nbsp; {result.warning.ratioPercent}% 수준
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="text-sm text-gray-400">목표 달성 확률 ({form.targetYears}년 시점)</div>
              <div className="mt-2 text-3xl font-extrabold text-gray-900">{result.goalProbability}%</div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                이대로면 {form.targetYears}년 안에 목표자산을 모을 가능성이{' '}
                {result.goalProbability >= 50 ? '반반보다 조금 높아요.' : '아직 낮은 편이에요.'}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                도중에 한 번이라도 목표를 넘어선 적 있는 확률: {result.touchProbability}%
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="text-sm text-gray-400">주거비 부담률</div>
              <div className="mt-2 text-3xl font-extrabold text-gray-900">
                {result.housingBurdenRatio.toFixed(0)}%
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${burdenBarTone(result.burdenTag)}`}
                  style={{ width: `${Math.min(result.housingBurdenRatio, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">소득 대비 적정 구간 (30% 이하)</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="text-sm text-gray-400">월 저축 가능액</div>
              <div className="mt-2 text-3xl font-extrabold text-gray-900">
                {result.monthlySavings.toLocaleString()}만원
              </div>
              <p className="mt-2 text-xs text-gray-400">월 소득 {Number(form.income).toLocaleString()}만원 기준</p>
              <p className="mt-1 text-xs text-gray-400">DTI {result.dti.toFixed(0)}%</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-400">독립 시점 필요 목돈</div>
                <div className="mt-2 text-2xl font-extrabold text-gray-900">
                  {result.requiredFunds.requiredFunds.toLocaleString()}만원
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">보유 현금</div>
                <div className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-gray-900">
                  {result.requiredFunds.cashOnHand.toLocaleString()}만원
                  {result.requiredFunds.sufficient && (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={14} />
                      보유 현금 {result.requiredFunds.cashOnHand.toLocaleString()}만원으로 충분해요
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-base font-bold text-gray-900">자산 형성 궤적</h3>
            <p className="mt-1 text-xs text-gray-400">중앙값 선 + p5~p95 음영 밴드 + {result.assetPath.renewalMonth}개월차 계약갱신 점표</p>
            <div className="mt-6">
              <AssetBandChart
                horizonMonths={result.assetPath.horizonMonths}
                renewalMonth={result.assetPath.renewalMonth}
                median={result.assetPath.median}
                p5={result.assetPath.p5}
                p95={result.assetPath.p95}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              계약 갱신월({result.assetPath.renewalMonth}개월차)에 월세가 한 번 조정돼 곡선 기울기가 바뀌어요.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 text-lg font-bold text-gray-900">조건을 바꾸면 어떨까요</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.whatIfScenarios.map((s) => (
                <div key={s.key} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-500">{s.label}</div>
                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                      +{s.deltaPercentPoint}%p
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-gray-900">{s.probability}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mb-1 text-lg font-bold text-gray-900">고민 중인 지역 비교</h3>
            <p className="mb-4 text-sm text-gray-500">{form.region.split(' ')[1]}와 인접한 지역 중, 같은 조건으로 살 수 있는 곳만 비교했어요.</p>
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6">
              <RegionBar
                label={`${result.regionComparison.current.region} 현재`}
                percent={result.regionComparison.current.probability}
                tone="current"
              />
              {result.regionComparison.neighbors.map((n) => (
                <RegionBar key={n.region} label={n.region} percent={n.probability} tone="neighbor" />
              ))}
            </div>
            {result.regionComparison.excluded.length > 0 && (
              <p className="mt-3 text-xs text-gray-400">
                {result.regionComparison.excluded.map((e) => `${e.region}은 ${e.reason}`).join(', ')} 비교에서
                제외했어요.
              </p>
            )}
          </div>

          <div className="mt-10">
            <h3 className="mb-4 text-lg font-bold text-gray-900">이 결과에 사용된 가정</h3>
            <div className="grid gap-x-8 gap-y-2 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 sm:grid-cols-2">
              {result.assumptions.map((a) => (
                <div key={a} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                  <span>{a}</span>
                </div>
              ))}
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

function RegionBar({ label, percent, tone }) {
  const barColor = tone === 'current' ? 'bg-amber-400' : 'bg-teal-600/70';
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0 text-sm font-medium text-gray-700">{label}</div>
      <div className="h-9 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <div className="w-10 shrink-0 text-right text-sm font-bold text-gray-900">{percent}%</div>
    </div>
  );
}
