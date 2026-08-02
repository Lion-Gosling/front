import { ChevronDown } from 'lucide-react';

function normalize(opt) {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt;
}

export default function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        >
          {options.map(normalize).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
