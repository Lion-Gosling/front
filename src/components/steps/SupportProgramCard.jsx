import { Home, Landmark, CreditCard, Sprout, Building2, Coins, Clock, ArrowUpRight } from 'lucide-react';

const ICONS = { home: Home, landmark: Landmark, card: CreditCard, sprout: Sprout, building: Building2, coins: Coins };

const COLOR = {
  amber: 'bg-amber-100 text-amber-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  teal: 'bg-teal-100 text-teal-600',
};

const STATUS_BADGE = {
  eligible: 'bg-green-50 text-green-700',
  conditional: 'bg-amber-50 text-amber-700',
};

const STATUS_LABEL = { eligible: '신청 가능', conditional: '조건부 가능' };

export default function SupportProgramCard({ program }) {
  const Icon = ICONS[program.icon] ?? Home;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLOR[program.color]}`}>
            <Icon size={20} />
          </span>
          <div>
            <div className="font-bold text-gray-900">{program.title}</div>
            <div className="text-xs text-gray-400">{program.org}</div>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[program.status]}`}>
          {STATUS_LABEL[program.status]}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">{program.description}</p>

      <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-bold text-rose-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs">₩</span>
          {program.savingLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <Clock size={14} />
          {program.schedule}
        </span>
        <span className="flex items-center gap-1 font-semibold text-amber-500">
          자세히 보기 <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
}
