import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const W = 760;
const H = 340;
const MARGIN = { top: 16, right: 54, bottom: 36, left: 60 };
const PLOT_W = W - MARGIN.left - MARGIN.right;
const PLOT_H = H - MARGIN.top - MARGIN.bottom;
const LINE_DURATION = 1;
const LINE_STAGGER = 0.18;

function niceTicks(maxValue, tickCount = 5) {
  if (maxValue <= 0) return [0];
  const rawStep = maxValue / (tickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  let niceResidual;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  else niceResidual = 1;
  const step = niceResidual * magnitude;
  const niceMax = Math.ceil(maxValue / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax + 1e-6; v += step) ticks.push(Math.round(v));
  return ticks;
}

function monthLabel(month) {
  const y = Math.floor(month / 12);
  const m = month % 12;
  return `${y}년 ${m}개월`;
}

export default function AssetChart({ series, horizonMonths }) {
  const containerRef = useRef(null);
  const [hoverMonth, setHoverMonth] = useState(null);

  const maxValue = Math.max(...series.flatMap((s) => s.path));
  const ticks = niceTicks(maxValue);
  const niceMax = ticks[ticks.length - 1];

  const xAt = (month) => MARGIN.left + (month / horizonMonths) * PLOT_W;
  const yAt = (value) => MARGIN.top + PLOT_H - (value / niceMax) * PLOT_H;

  const xTickStep = 6;
  const xTicks = [];
  for (let m = 0; m <= horizonMonths; m += xTickStep) xTicks.push(m);
  if (xTicks[xTicks.length - 1] !== horizonMonths) xTicks.push(horizonMonths);

  const linePaths = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        d: s.path.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)},${yAt(v)}`).join(' '),
      })),
    [series, horizonMonths, niceMax]
  );

  const endLabels = useMemo(() => {
    const raw = series
      .map((s) => ({
        id: s.id,
        label: s.label,
        color: s.color,
        value: s.path[s.path.length - 1],
        y: yAt(s.path[s.path.length - 1]),
      }))
      .sort((a, b) => a.y - b.y);

    for (let i = 1; i < raw.length; i++) {
      const minGap = 15;
      if (raw[i].y - raw[i - 1].y < minGap) raw[i].y = raw[i - 1].y + minGap;
    }
    return raw;
  }, [series, niceMax]);

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const month = Math.round(((px - MARGIN.left) / PLOT_W) * horizonMonths);
    setHoverMonth(Math.min(Math.max(month, 0), horizonMonths));
  };

  const hoverX = hoverMonth !== null ? xAt(hoverMonth) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverMonth(null)}
      >
        <defs>
          {series.map((s, i) => (
            <clipPath id={`chart-reveal-${s.id}`} key={s.id}>
              <motion.rect
                x={MARGIN.left}
                y={0}
                height={H}
                initial={{ width: 0 }}
                animate={{ width: PLOT_W }}
                transition={{ duration: LINE_DURATION, delay: i * LINE_STAGGER, ease: 'easeInOut' }}
              />
            </clipPath>
          ))}
        </defs>

        {ticks.map((t) => (
          <motion.g
            key={t}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={yAt(t)}
              y2={yAt(t)}
              stroke="#e1e0d9"
              strokeWidth={1}
            />
            <text x={MARGIN.left - 10} y={yAt(t) + 4} textAnchor="end" fontSize={11} fill="#898781">
              {t.toLocaleString()}만원
            </text>
          </motion.g>
        ))}

        {xTicks.map((m) => (
          <text key={m} x={xAt(m)} y={H - MARGIN.bottom + 20} textAnchor="middle" fontSize={11} fill="#898781">
            {monthLabel(m)}
          </text>
        ))}

        <line
          x1={MARGIN.left}
          x2={W - MARGIN.right}
          y1={H - MARGIN.bottom}
          y2={H - MARGIN.bottom}
          stroke="#c3c2b7"
          strokeWidth={1}
        />

        {hoverX !== null && (
          <line x1={hoverX} x2={hoverX} y1={MARGIN.top} y2={H - MARGIN.bottom} stroke="#c3c2b7" strokeWidth={1} />
        )}

        {linePaths.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={s.dashed ? '7 5' : undefined}
            clipPath={`url(#chart-reveal-${s.id})`}
          />
        ))}

        {series.map((s, i) => {
          const lastM = s.path.length - 1;
          return (
            <motion.circle
              key={s.id}
              cx={xAt(lastM)}
              cy={yAt(s.path[lastM])}
              r={5}
              fill={s.color}
              stroke="#fafaf8"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * LINE_STAGGER + LINE_DURATION, ease: 'backOut' }}
            />
          );
        })}

        {hoverMonth !== null &&
          series.map((s) => (
            <circle
              key={s.id}
              cx={xAt(hoverMonth)}
              cy={yAt(s.path[hoverMonth])}
              r={4}
              fill={s.color}
              stroke="#fafaf8"
              strokeWidth={2}
            />
          ))}

        {endLabels.map((l, i) => (
          <motion.text
            key={l.id}
            x={W - MARGIN.right + 6}
            y={l.y + 4}
            fontSize={11}
            fontWeight={700}
            fill="#0b0b0b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * LINE_STAGGER + LINE_DURATION }}
          >
            {l.value.toLocaleString()}
          </motion.text>
        ))}
      </svg>

      {hoverMonth !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(hoverX / W) * 100}%`,
            top: `${(MARGIN.top / H) * 100}%`,
          }}
        >
          <div className="mb-1 font-semibold text-gray-900">{monthLabel(hoverMonth)}</div>
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-gray-500">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
              <span className="ml-auto font-semibold text-gray-900">
                {s.path[hoverMonth].toLocaleString()}만원
              </span>
            </div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {series.map((s) => (
          <span key={s.id} className="flex items-center gap-2 text-xs text-gray-500">
            {s.dashed ? (
              <span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: s.color }} />
            ) : (
              <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} />
            )}
            {s.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
