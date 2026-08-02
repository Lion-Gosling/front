// API가 내려주는 question 객체({input_type, unit, options, minimum, maximum, ...})를
// 그대로 해석해서 렌더링하는 범용 필드. 질문 종류가 늘어나도 이 컴포넌트는 안 바뀌어요.

export default function DynamicQuestionField({ question, value, onChange }) {
  if (question.input_type === 'select') {
    return (
      <div>
        <p className="text-sm font-semibold text-gray-700">{question.text}</p>
        <div
          className="mt-2 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${question.options.length}, minmax(0, 1fr))` }}
        >
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border py-2.5 text-sm font-bold transition ${
                value === opt.value
                  ? 'border-amber-400 bg-amber-400 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-amber-300 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.input_type === 'number') {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">{question.text}</label>
        <div className="relative mt-2">
          <input
            type="number"
            value={value ?? ''}
            min={question.minimum ?? undefined}
            max={question.maximum ?? undefined}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
          {question.unit && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {question.unit}
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
}
