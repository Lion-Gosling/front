import { Info, Sparkles } from 'lucide-react';

const HIGHLIGHT_RE = /(\d[\d,]*(?:만원대|만원|세|년|개월|%))/g;

function highlight(text) {
  return text.split(HIGHLIGHT_RE).map((part, i) =>
    HIGHLIGHT_RE.test(part) ? (
      <strong key={i} className="font-bold text-gray-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function RecommendedField({ loading, label, source, description, value, unit, onChange, hint }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded bg-gray-100" />
          <div className="h-6 w-20 rounded-full bg-gray-100" />
        </div>
        <div className="mt-3 h-4 w-24 rounded-full bg-gray-100" />
        <div className="mt-3 h-4 w-full rounded bg-gray-100" />
        <div className="mt-1 h-4 w-2/3 rounded bg-gray-100" />
        <div className="mt-4 h-[52px] w-full rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">
          <Sparkles size={12} />
          추천값
        </span>
      </div>

      <span className="inline-block rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
        {source}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{highlight(description)}</p>
      <div className="relative mt-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <Info size={13} className="shrink-0" />
          {hint}
        </p>
      )}
    </div>
  );
}
