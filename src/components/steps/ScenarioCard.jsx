import { Check } from 'lucide-react';

export default function ScenarioCard({ scenario, recommended, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col rounded-2xl border p-6 text-left transition ${
        selected ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      {recommended && (
        <span className="mb-3 inline-block w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-900">
          AI 추천
        </span>
      )}
      <div className="font-bold text-gray-900">{scenario.label}</div>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{scenario.description}</p>

      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
        <div>
          <div className="text-xs text-gray-400">월 저축 가능액</div>
          <div className="text-lg font-bold text-gray-900">{scenario.monthlySaving.toLocaleString()}만원</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">{`${Math.round(scenario.path.length / 12)}년 후 예상 자산`}</div>
          <div className="text-lg font-bold text-gray-900">
            {scenario.finalAsset.toLocaleString()}만원
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">목표 자산 달성</div>
          <div className={`text-sm font-bold ${scenario.yearsToGoal ? 'text-green-600' : 'text-gray-400'}`}>
            {scenario.yearsToGoal ? `${scenario.yearsToGoal.toFixed(1)}년 후 달성` : '기간 내 미달성'}
          </div>
        </div>
      </div>

      {selected && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-amber-100 pt-4 text-sm font-semibold text-amber-600">
          <Check size={16} /> 선택한 시나리오
        </div>
      )}
    </button>
  );
}
