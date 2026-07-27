import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function WizardShell({
  title,
  subtitle,
  page,
  totalPages,
  onBack,
  onNext,
  nextLabel = '다음',
  nextIcon = ArrowRight,
  children,
}) {
  const NextIcon = nextIcon;

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-400">
          {page} / {totalPages}
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-500">{subtitle}</p>

      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${(page / totalPages) * 100}%` }}
        />
      </div>

      <div className="space-y-6">{children}</div>

      <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-gray-600"
        >
          <ArrowLeft size={16} /> 이전
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
        >
          {nextLabel} <NextIcon size={16} />
        </button>
      </div>
    </div>
  );
}
