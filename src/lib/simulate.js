// 이 파일은 실제 백엔드(몬테카를로 시뮬레이션 서비스)가 붙기 전까지 쓰는
// 단순화된 결정론적(deterministic) 근사치입니다. 핵심 가정만 반영합니다:
// - 독립을 미루는 동안에는 지금과 비슷한 수준의 주거비를 이미 부담하고 있다고 보고,
//   대기 기간의 월 저축액은 "지금 독립"했을 때의 저축액과 동일하게 둡니다.
// - 다만 미룬 기간만큼 희망 지역의 시장 임대료가 오른 상태로 계약하게 되므로,
//   이사 시점이 늦을수록 이사 이후의 월 저축액은 더 낮아집니다.
// → 미루는 것이 "지금 당장 더 아끼는 방법"은 아니고, 그저 미래의 주거비를
//   더 비싸게 확정짓는 효과만 낸다는 것을 보여주기 위한 단순 모델입니다.

const RENT_GROWTH_ANNUAL = 0.035;

const SCENARIO_DEFS = [
  { id: 'move_now', label: '지금 독립', delayMonths: 0, description: '현재 시점에 희망 지역으로 즉시 이사' },
  { id: 'wait_12m', label: '1년 후 독립', delayMonths: 12, description: '1년간 현재 거주지를 유지한 뒤, 그 시점 시세로 이사' },
  { id: 'wait_24m', label: '2년 후 독립', delayMonths: 24, description: '2년간 현재 거주지를 유지한 뒤, 그 시점 시세로 이사' },
];

function buildScenarioPath(form, delayMonths, horizonMonths) {
  const income = Number(form.income) || 0;
  const expense = Number(form.expense) || 0;
  const assets0 = Number(form.assets) || 0;
  const baseRent = Number(form.rent) || 0;

  const grownRent = baseRent * Math.pow(1 + RENT_GROWTH_ANNUAL, delayMonths / 12);
  const preMoveSaving = income - expense - baseRent;
  const postMoveSaving = income - expense - grownRent;

  const path = [assets0];
  let cash = assets0;
  let monthsToGoal = null;
  const targetAsset = Number(form.targetAsset) || 0;

  for (let m = 1; m <= horizonMonths; m++) {
    const saving = m <= delayMonths ? preMoveSaving : postMoveSaving;
    cash += saving;
    path.push(cash);
    if (monthsToGoal === null && cash >= targetAsset) monthsToGoal = m;
  }

  return { path, preMoveSaving, postMoveSaving, grownRent, monthsToGoal };
}

export async function simulateScenarios(form, result) {
  const targetYears = Number(form.targetYears) || 5;
  const horizonMonths = Math.max(Math.round(targetYears * 12), 12);

  const scenarios = SCENARIO_DEFS.map((def) => {
    const { path, preMoveSaving, postMoveSaving, monthsToGoal } = buildScenarioPath(
      form,
      def.delayMonths,
      horizonMonths
    );
    const finalAsset = Math.round(path[path.length - 1]);
    return {
      ...def,
      monthlySaving: Math.round(def.delayMonths > 0 ? preMoveSaving : postMoveSaving),
      postMoveSaving: Math.round(postMoveSaving),
      finalAsset,
      monthsToGoal,
      yearsToGoal: monthsToGoal ? monthsToGoal / 12 : null,
      path: path.map((v) => Math.round(v)),
    };
  });

  const reachable = scenarios.filter((s) => s.monthsToGoal !== null);
  const recommended =
    reachable.length > 0
      ? reachable.reduce((best, s) => (s.monthsToGoal < best.monthsToGoal ? s : best))
      : scenarios[0];

  return {
    horizonMonths,
    recommendedId: recommended.id,
    recommendReason:
      recommended.id === 'move_now'
        ? '월 저축 여력이 충분하고, 목표 자산을 가장 빠르게 달성할 수 있어 지금 독립을 시작하는 것이 유리합니다.'
        : `지금 독립하면 희망 조건의 부담이 커요. ${recommended.label} 시나리오가 목표 자산을 더 빠르게 달성합니다.`,
    scenarios,
  };
}
