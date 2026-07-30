import { useEffect, useState } from 'react';
import { Home, MapPin } from 'lucide-react';
import SelectField from './SelectField';

const REGIONS = [
  '서울 마포구',
  '서울 강남구',
  '서울 성동구',
  '서울 관악구',
  '경기 성남시',
  '경기 고양시',
  '인천 연수구',
];

// 데모용 임의 값 — 실제 값은 백엔드에서 지역/매물 데이터로 계산해 내려줍니다.
const DEMO_MAX_DEPOSIT = 26800; // 전세(보증금 100%) 기준 보증금, 만원
const DEMO_MIN_DEPOSIT = 1500; // 월세 쪽 끝에서도 유지되는 보증금 하한, 만원
const DEMO_MAX_RENT = 82; // 월세(보증금 최소) 기준 월세, 만원
const DEMO_DEPOSIT_MEDIAN = 1500; // 이 지역 월세 계약의 실제 보증금 중앙값, 만원

export default function HousingPlanFields({ form, setField }) {
  const [ratio, setRatio] = useState(35); // 0 = 전세, 100 = 월세

  const deposit = Math.round(DEMO_MAX_DEPOSIT - ((DEMO_MAX_DEPOSIT - DEMO_MIN_DEPOSIT) * ratio) / 100);
  const rent = Math.round((DEMO_MAX_RENT * ratio) / 100);
  const leaseType = ratio < 50 ? 'jeonse' : 'wolse';

  useEffect(() => {
    setField('deposit', deposit);
    setField('rent', rent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit, rent]);

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
          value={form.region}
          onChange={(v) => setField('region', v)}
          options={REGIONS}
        />

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={14} className="shrink-0 text-gray-400" />
          {form.region} 오피스텔 · 환산월세 기준 {DEMO_MAX_RENT}만원/월 (전환율 5.5%)
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRatio(0)}
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
            onClick={() => setRatio(100)}
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
              onChange={(e) => setRatio(Number(e.target.value))}
              className="relative z-10 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-400 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100 text-center">
          <div>
            <div className="text-sm text-gray-400">보증금</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900">{deposit.toLocaleString()}만원</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">월세</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900">{rent.toLocaleString()}만원</div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-gray-400">
          월세 쪽 끝에서도 보증금이 0이 되지 않도록, 이 지역 월세 계약의 실제 보증금 중앙값(
          {DEMO_DEPOSIT_MEDIAN.toLocaleString()}만원)을 하한으로 뒀어요.
        </p>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3.5 text-sm font-bold text-rose-500 transition hover:bg-rose-100"
        >
          <MapPin size={16} />
          {form.region} 평균 시세 보기
        </button>
      </div>
    </div>
  );
}
