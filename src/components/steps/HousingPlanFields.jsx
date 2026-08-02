import { useEffect, useRef, useState } from 'react';
import { Home, MapPin } from 'lucide-react';
import SelectField from './SelectField';
import FormField from './FormField';
import { getHousingBenchmark } from '../../lib/api';

const REGIONS = [
  { label: '서울 마포구', value: '마포구' },
  { label: '서울 강남구', value: '강남구' },
  { label: '서울 성동구', value: '성동구' },
  { label: '서울 관악구', value: '관악구' },
];

const HOUSING_TYPES = ['아파트', '오피스텔', '연립·다세대'];

export default function HousingPlanFields({ form, setField }) {
  const [ratio, setRatio] = useState(form.contractSliderPct ?? 35); // 0 = 전세, 100 = 월세
  const [benchmark, setBenchmark] = useState(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(true);
  const [benchmarkError, setBenchmarkError] = useState(null);
  const sliderTouchedRef = useRef(false);

  const selectedRegion = REGIONS.find((r) => r.value === form.district) ?? REGIONS[0];

  useEffect(() => {
    let alive = true;
    setLoadingBenchmark(true);
    setBenchmarkError(null);
    getHousingBenchmark(form.district, form.housingType)
      .then((data) => {
        if (!alive) return;
        if (!data) {
          setBenchmark(null);
          setBenchmarkError('이 조건의 시세 정보를 찾을 수 없어요. 다른 지역/주거유형을 선택해보세요.');
        } else {
          setBenchmark(data);
          if (!sliderTouchedRef.current) setRatio(data.default_slider_pct);
        }
        setLoadingBenchmark(false);
      })
      .catch((err) => {
        if (!alive) return;
        setBenchmark(null);
        setBenchmarkError('시세 정보를 불러오지 못했어요.');
        setLoadingBenchmark(false);
        console.error('[housing benchmark] 조회 실패:', err.message);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.district, form.housingType]);

  // jeonseDeposit: 이 지역·유형의 전세 환산 기준 보증금(=슬라이더 0% 지점). API가 직접 안 주고
  // eq_rent = jeonseDeposit × (conversion_rate_annual/100) / 12 라는 통상적 정의로 역산.
  // TODO: 이 해석이 backend 의도와 맞는지 확인 필요.
  const jeonseDeposit = benchmark
    ? Math.round((benchmark.eq_rent * 12) / (benchmark.conversion_rate_annual / 100))
    : 0;
  const minDepositFloor = benchmark?.min_deposit_floor ?? 0;

  const deposit = benchmark ? Math.round(jeonseDeposit - ((jeonseDeposit - minDepositFloor) * ratio) / 100) : 0;
  const rent = benchmark ? Math.round(((jeonseDeposit - deposit) * benchmark.conversion_rate_annual) / 100 / 12) : 0;
  const leaseType = ratio < 50 ? 'jeonse' : 'wolse';

  useEffect(() => {
    if (!benchmark) return;
    setField('deposit', deposit);
    setField('rent', rent);
    setField('contractSliderPct', ratio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benchmark, deposit, rent, ratio]);

  const handleSetRatio = (v) => {
    sliderTouchedRef.current = true;
    setRatio(v);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
          <Home size={20} />
        </span>
        <div>
          <div className="font-bold text-gray-900">희망 주거 조건</div>
          <p className="mt-0.5 text-sm text-gray-400">이사 계획이 있다면 알려주세요</p>
        </div>
      </div>

      <div className="space-y-5">
        <SelectField
          label="희망 지역"
          value={form.district}
          onChange={(v) => {
            const opt = REGIONS.find((r) => r.value === v);
            setField('district', v);
            setField('region', opt?.label ?? v); // ResultPage 등에서 쓰는 전체 표기("서울 마포구")
          }}
          options={REGIONS}
        />

        <SelectField
          label="희망 주거 유형"
          value={form.housingType}
          onChange={(v) => setField('housingType', v)}
          options={HOUSING_TYPES}
        />

        <FormField
          label="희망 평수"
          unit="평"
          value={form.areaPyeong}
          onChange={(v) => setField('areaPyeong', v)}
          placeholder="10"
        />

        {loadingBenchmark ? (
          <div className="animate-pulse space-y-5">
            <div className="h-4 w-2/3 rounded bg-gray-100" />
            <div className="h-11 w-full rounded-xl bg-gray-100" />
            <div className="h-6 w-full rounded-full bg-gray-100" />
            <div className="h-16 w-full rounded-xl bg-gray-100" />
          </div>
        ) : benchmarkError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            {benchmarkError}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={14} className="shrink-0 text-gray-400" />
              {selectedRegion.label} {form.housingType} · 환산월세 기준 {benchmark.eq_rent}원/월 (전환율{' '}
              {benchmark.conversion_rate_annual}%)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSetRatio(0)}
                className={`rounded-xl py-3.5 text-sm font-bold transition ${
                  leaseType === 'jeonse'
                    ? 'bg-amber-400 text-gray-900'
                    : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                전세
              </button>
              <button
                type="button"
                onClick={() => handleSetRatio(100)}
                className={`rounded-xl py-3.5 text-sm font-bold transition ${
                  leaseType === 'wolse'
                    ? 'bg-amber-400 text-gray-900'
                    : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                월세
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>전세</span>
                <span>월세</span>
              </div>
              <div className="relative mt-2 flex h-6 items-center">
                <div className="pointer-events-none absolute inset-x-0 h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratio}
                  onChange={(e) => handleSetRatio(Number(e.target.value))}
                  className="relative z-10 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-400 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-100 text-center">
              <div>
                <div className="text-sm text-gray-400">보증금</div>
                <div className="mt-1 text-2xl font-extrabold text-gray-900">{deposit.toLocaleString()}원</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">월세</div>
                <div className="mt-1 text-2xl font-extrabold text-gray-900">{rent.toLocaleString()}원</div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-gray-400">
              월세 쪽 끝에서도 보증금이 {minDepositFloor.toLocaleString()}원 아래로는 내려가지 않도록 하한을
              뒀어요.
            </p>
          </>
        )}

        <div>
          <div className="mb-2 text-xs font-medium text-gray-400">보증금 대출 계획</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setField('wantsLoan', false)}
              className={`rounded-xl py-3.5 text-sm font-bold transition ${
                !form.wantsLoan
                  ? 'bg-amber-400 text-gray-900'
                  : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              대출 없이 진행
            </button>
            <button
              type="button"
              onClick={() => setField('wantsLoan', true)}
              className={`rounded-xl py-3.5 text-sm font-bold transition ${
                form.wantsLoan
                  ? 'bg-amber-400 text-gray-900'
                  : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              대출 희망
            </button>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3.5 text-sm font-bold text-rose-500 transition hover:bg-rose-100"
        >
          <MapPin size={16} />
          {selectedRegion.label} 평균 시세 보기
        </button>
      </div>
    </div>
  );
}
