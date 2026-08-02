import { Landmark, ArrowUpRight } from 'lucide-react';

const won = (v) => Math.round((v ?? 0) / 10000);

function buildConditions(program) {
  const items = [];

  if (program.age_min != null && program.age_max != null) {
    items.push(`만 ${program.age_min}~${program.age_max}세`);
  }
  if (program.income_max_annual != null) {
    items.push(`연소득 ${won(program.income_max_annual).toLocaleString()}만원 이하`);
  }
  if (program.income_ratio_min != null || program.income_ratio_max != null) {
    const min = program.income_ratio_min;
    const max = program.income_ratio_max;
    if (min != null && max != null) items.push(`소득 대비 임차료 ${min}~${max}%`);
    else if (max != null) items.push(`소득 대비 임차료 ${max}% 이하`);
    else items.push(`소득 대비 임차료 ${min}% 이상`);
  }
  if (program.asset_max != null) items.push(`자산 ${won(program.asset_max).toLocaleString()}만원 이하`);
  if (program.deposit_max != null) items.push(`보증금 ${won(program.deposit_max).toLocaleString()}만원 이하`);
  if (program.rent_max != null) items.push(`월세 ${won(program.rent_max).toLocaleString()}만원 이하`);

  return items;
}

export default function SupportProgramCard({ program }) {
  const conditions = buildConditions(program);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Landmark size={20} />
          </span>
          <div className="font-bold text-gray-900">{program.name}</div>
        </div>
        {program.is_kb_exclusive ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            KB 단독 상품
          </span>
        ) : (
          program.is_kb_available && (
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              KB에서 가입 가능
            </span>
          )
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">{program.benefit_desc}</p>

      {conditions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {conditions.map((c) => (
            <span key={c} className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-500">
              {c}
            </span>
          ))}
        </div>
      )}

      {program.source_url && (
        <a
          href={program.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-end gap-1 border-t border-gray-50 pt-4 text-xs font-semibold text-amber-500"
        >
          자세히 보기 <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}
