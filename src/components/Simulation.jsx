import { useEffect, useState } from 'react';
import { LineChart as LineChartIcon, ThumbsUp, ArrowLeft, RotateCcw } from 'lucide-react';
import StepIndicator from './StepIndicator';
import AssetChart from './AssetChart';
import ScenarioCard from './steps/ScenarioCard';
import { getSimulation } from '../lib/api';

const SERIES_STYLE = {
  move_now: { color: '#eb6834', dashed: false },
  wait_12m: { color: '#1baf7a', dashed: true },
  wait_24m: { color: '#2a78d6', dashed: true },
};

export default function Simulation({ form, result, onBack, onRestart }) {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let alive = true;
    getSimulation(form, result).then((res) => {
      if (alive) {
        setData(res);
        setSelectedId(res.recommendedId);
      }
    });
    return () => {
      alive = false;
    };
  }, [form, result]);

  if (!data) {
    return <div className="py-24 text-center text-sm text-gray-400">시뮬레이션을 계산하는 중이에요…</div>;
  }

  const recommended = data.scenarios.find((s) => s.id === data.recommendedId);
  const selected = data.scenarios.find((s) => s.id === selectedId);
  const targetYears = Math.round(data.horizonMonths / 12);

  const chartSeries = data.scenarios.map((s) => ({
    id: s.id,
    label: s.label,
    path: s.path,
    bandLow: s.bandLow,
    bandHigh: s.bandHigh,
    ...SERIES_STYLE[s.id],
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 overflow-x-auto">
        <StepIndicator current={3} />
      </div>

      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
          <LineChartIcon size={28} />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">당신의 선택, 미래가 달라집니다</h2>
        <p className="mt-3 max-w-xl text-sm text-gray-500">
          독립 시점에 따라 {targetYears}년 후 자산이 어떻게 달라지는지 비교해보세요. AI가 분석한 최적의 안을
          추천해드려요.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-amber-50 p-6 sm:flex-row sm:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <ThumbsUp size={20} />
        </span>
        <div className="flex-1">
          <div className="font-bold text-amber-600">AI 추천: {recommended.label}</div>
          <p className="mt-1 text-sm text-gray-600">{data.recommendReason}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-gray-900">
          {selectedId === recommended.id ? '선택됨' : '추천 보기'}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
        <h3 className="text-base font-bold text-gray-900">{targetYears}년간 자산 변화 추이</h3>
        <p className="mt-1 text-xs text-gray-400">
          월 {recommended.postMoveSaving.toLocaleString()}만원 저축 가정, 현재 자산{' '}
          {Number(form.assets).toLocaleString()}만원 기준
        </p>
        <div className="mt-6">
          <AssetChart series={chartSeries} horizonMonths={data.horizonMonths} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {data.scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            recommended={scenario.id === data.recommendedId}
            selected={scenario.id === selectedId}
            onSelect={() => setSelectedId(scenario.id)}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-gray-600"
        >
          <ArrowLeft size={16} /> 지원제도로 돌아가기
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          처음부터 다시 진단하기 <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
