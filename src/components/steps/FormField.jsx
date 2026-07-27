export default function FormField({ label, unit, value, onChange, type = 'number', placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
