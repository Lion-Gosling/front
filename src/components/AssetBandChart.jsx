import { useMemo, useState } from 'react';
import { motion } from 'motion/react';

const W = 760;
const H = 300;
const MARGIN = { top: 28, right: 24, bottom: 36, left: 54 };
const PLOT_W = W - MARGIN.left - MARGIN.right;
const PLOT_H = H - MARGIN.top - MARGIN.bottom;

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

export default function AssetBandChart({ horizonMonths, renewalMonth, median, p5, p95 }) {
  const [hoverMonth, setHoverMonth] = useState(null);

  const maxValue = Math.max(...p95);
  const ticks = niceTicks(maxValue);
  const niceMax = ticks[ticks.length - 1] || 1;

  const xAt = (month) => MARGIN.left + (month / horizonMonths) * PLOT_W;
  const yAt = (value) => MARGIN.top + PLOT_H - (value / niceMax) * PLOT_H;

  const xTickStep = Math.max(Math.round(horizonMonths / 4 / 3) * 3, 3);
  const xTicks = [];
  for (let m = 0; m <= horizonMonths; m += xTickStep) xTicks.push(m);
  if (xTicks[xTicks.length - 1] !== horizonMonths) xTicks.push(horizonMonths);

  const medianPath = useMemo(
    () => median.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)},${yAt(v)}`).join(' '),
    [median, horizonMonths, niceMax]
  );

  const bandPath = useMemo(() => {
    const top = p95.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)},${yAt(v)}`).join(' ');
    const bottom = p5
      .map((v, i) => i)
      .reverse()
      .map((i) => `L ${xAt(i)},${yAt(p5[i])}`)
      .join(' ');
    return `${top} ${bottom} Z`;
  }, [p5, p95, horizonMonths, niceMax]);

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const month = Math.round(((px - MARGIN.left) / PLOT_W) * horizonMonths);
    setHoverMonth(Math.min(Math.max(month, 0), horizonMonths));
  };

  const hoverX = hoverMonth !== null ? xAt(hoverMonth) : null;
  const tooltipOnLeft = hoverX !== null && hoverX > W * 0.6;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverMonth(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={MARGIN.left} x2={W - MARGIN.right} y1={yAt(t)} y2={yAt(t)} stroke="#e1e0d9" strokeWidth={1} />
            <text x={MARGIN.left - 10} y={yAt(t) + 4} textAnchor="end" fontSize={11} fill="#898781">
              {Math.round(t / 1000)}천
            </text>
          </g>
        ))}

        {xTicks.map((m) => (
          <text key={m} x={xAt(m)} y={H - MARGIN.bottom + 20} textAnchor="middle" fontSize={11} fill="#898781">
            {m}개월
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

        <motion.path
          d={bandPath}
          fill="#1baf7a"
          fillOpacity={0.12}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <line
          x1={xAt(renewalMonth)}
          x2={xAt(renewalMonth)}
          y1={MARGIN.top}
          y2={H - MARGIN.bottom}
          stroke="#eb6834"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={xAt(renewalMonth)} y={MARGIN.top - 12} textAnchor="middle" fontSize={10} fill="#eb6834">
          계약갱신
        </text>

        <motion.path
          d={medianPath}
          fill="none"
          stroke="#0b0b0b"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {hoverX !== null && (
          <>
            <line x1={hoverX} x2={hoverX} y1={MARGIN.top} y2={H - MARGIN.bottom} stroke="#c3c2b7" strokeWidth={1} />
            <circle cx={hoverX} cy={yAt(median[hoverMonth])} r={4} fill="#0b0b0b" stroke="#fafaf8" strokeWidth={2} />
            <circle cx={hoverX} cy={yAt(p95[hoverMonth])} r={3} fill="#1baf7a" stroke="#fafaf8" strokeWidth={2} />
            <circle cx={hoverX} cy={yAt(p5[hoverMonth])} r={3} fill="#1baf7a" stroke="#fafaf8" strokeWidth={2} />
          </>
        )}
      </svg>

      {hoverMonth !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(hoverX / W) * 100}%`,
            top: `${(MARGIN.top / H) * 100}%`,
            transform: tooltipOnLeft ? 'translateX(-100%)' : 'translateX(0)',
          }}
        >
          <div className="mb-1 font-semibold text-gray-900">{hoverMonth}개월차</div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="inline-block h-0.5 w-3 rounded-full bg-gray-900" />
            <span>중앙값</span>
            <span className="ml-auto font-semibold text-gray-900">{median[hoverMonth].toLocaleString()}만원</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="inline-block h-2 w-3 rounded-sm bg-[#1baf7a]/30" />
            <span>p95</span>
            <span className="ml-auto font-semibold text-gray-900">{p95[hoverMonth].toLocaleString()}만원</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="inline-block h-2 w-3 rounded-sm bg-[#1baf7a]/30" />
            <span>p5</span>
            <span className="ml-auto font-semibold text-gray-900">{p5[hoverMonth].toLocaleString()}만원</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block h-0.5 w-4 rounded-full bg-gray-900" />
          중앙값
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block h-3 w-4 rounded-sm bg-[#1baf7a]/20" />
          p5~p95
        </span>
      </div>
    </div>
  );
}
