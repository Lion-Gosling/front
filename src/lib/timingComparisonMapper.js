// timing-comparisons 응답(원 단위, p5/p50/p95 몬테카를로 궤적)을
// Simulation.jsx / AssetChart.jsx / ScenarioCard.jsx가 기대하는 형태(만원 단위)로 변환합니다.

const WON_PER_MANWON = 10000;
const won = (v) => Math.round((v ?? 0) / WON_PER_MANWON);

const DELAY_META = {
  0: { id: 'move_now', description: '현재 시점에 희망 지역으로 즉시 이사' },
  12: { id: 'wait_12m', description: '1년간 현재 거주지를 유지한 뒤, 그 시점 시세로 이사' },
  24: { id: 'wait_24m', description: '2년간 현재 거주지를 유지한 뒤, 그 시점 시세로 이사' },
};

function mapVariant(variant, currentAssets) {
  const meta = DELAY_META[variant.move_in_after_months] ?? {
    id: `wait_${variant.move_in_after_months}m`,
    description: `${variant.move_in_after_months}개월 후 이사`,
  };
  const trajectory = [...variant.trajectory].sort((a, b) => a.month - b.month);

  const path = [currentAssets, ...trajectory.map((t) => won(t.p50))];
  const bandLow = [currentAssets, ...trajectory.map((t) => won(t.p5))];
  const bandHigh = [currentAssets, ...trajectory.map((t) => won(t.p95))];

  return {
    id: meta.id,
    label: variant.label,
    delayMonths: variant.move_in_after_months,
    description: meta.description,
    monthlySaving: won(variant.monthly_saving),
    postMoveSaving: won(variant.monthly_saving),
    finalAsset: path[path.length - 1],
    goalProb: variant.goal_prob ?? 0,
    path,
    bandLow,
    bandHigh,
  };
}

export function mapTimingComparisonResponse(raw, form) {
  const currentAssets = Number(form.assets) || 0;
  const scenarios = raw.variants.map((variant) => mapVariant(variant, currentAssets));
  const horizonMonths = Math.max(...scenarios.map((s) => s.path.length - 1), 0);

  const recommended = scenarios.reduce((best, s) => (s.goalProb > best.goalProb ? s : best), scenarios[0]);
  const recommendedPct = Math.round(recommended.goalProb * 100);
  const nowScenario = scenarios.find((s) => s.id === 'move_now');
  const nowPct = nowScenario ? Math.round(nowScenario.goalProb * 100) : null;

  const recommendReason =
    recommended.id === 'move_now'
      ? `월 저축 여력이 충분해 지금 독립해도 목표 자산 달성 확률이 가장 높아요 (${recommendedPct}%).`
      : `${recommended.label} 시나리오의 목표 자산 달성 확률이 ${recommendedPct}%로 가장 높아요.${
          nowPct !== null ? ` 지금 바로 독립하면 확률이 ${nowPct}%로 낮아져요.` : ''
        }`;

  return {
    id: raw.id,
    horizonMonths,
    recommendedId: recommended.id,
    recommendReason,
    scenarios,
  };
}
