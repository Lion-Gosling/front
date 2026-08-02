import { Search } from 'lucide-react';

export default function RecommendationHeader({
  title = '맞춤 추천값',
  subtitle = 'KOSIS 통계 기준으로 기본값을 채워드렸어요',
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Search size={20} />
      </span>
      <div>
        <div className="font-bold text-gray-900">{title}</div>
        <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
