// POST /simulation/diagnoses/ 원본 응답을 ResultPage.jsx가 쓰는 result 형태로 매핑한다.
// 예전에는 diagnose(로컬 mock)의 result + getResultDetail(로컬 mock)의 detail로 나뉘어 있었지만,
// 백엔드가 한 번의 호출로 둘을 합친 값을 내려주므로 여기서 같은 필드명으로 평탄화한다.

const WON_PER_MANWON = 10000;
// TODO: available_cash/monthly_saving/trajectory는 원 단위, required_move_in_cash는 이미 만원 단위로
// 보이는 등 응답 필드마다 단위가 달라 보임 — 백엔드에 단위 통일 여부 확인 필요.
const won = (v) => Math.round((v ?? 0) / WON_PER_MANWON);
// TODO: goal_probability 등 확률/비율 필드가 0~1 fraction이라고 가정하고 ×100 — 백엔드 확인 필요.
const pct = (v) => Math.round((v ?? 0) * 100);

const GRADE_TONE_BY_SUITABILITY = { 적합: 'green', 주의: 'amber', 부담: 'red' };

function burdenTagFromRatio(ratioPercent) {
  if (ratioPercent <= 25) return '적정';
  if (ratioPercent <= 35) return '주의';
  return '위험';
}

function mapAssetPath(raw) {
  const sorted = [...(raw.trajectory ?? [])].sort((a, b) => a.month - b.month);
  const startingCash = won(raw.available_cash);
  return {
    horizonMonths: sorted.at(-1)?.month ?? 0,
    renewalMonth: raw.contract_renewal_months?.[0] ?? sorted.at(-1)?.month ?? 0,
    median: [startingCash, ...sorted.map((t) => won(t.p50))],
    p5: [startingCash, ...sorted.map((t) => won(t.p5))],
    p95: [startingCash, ...sorted.map((t) => won(t.p95))],
  };
}

function mapWhatIfScenarios(raw) {
  return (raw.condition_comparisons ?? []).map((c, i) => ({
    key: `condition-${i}`,
    label: c.condition,
    probability: pct(c.goal_probability),
    deltaPercentPoint: pct(c.change),
  }));
}

// TODO: 백엔드가 아직 district_comparisons를 안 내려줄 때를 위한 임시 목데이터.
// 마포구 기준 실제 인접 자치구를, 이 진단의 실제 goal_probability에 시세 상대적 차이(대략치)만큼
// 가감해서 채운다. district_comparisons가 내려오기 시작하면 이 폴백은 제거.
const MOCK_NEIGHBOR_OFFSETS_BY_DISTRICT = {
  마포구: [
    { region: '서대문구', offset: 8 }, // 마포구보다 시세가 낮은 편
    { region: '은평구', offset: 14 }, // 마포구보다 시세가 눈에 띄게 낮은 편
    { region: '영등포구', offset: -4 }, // 마포구와 비슷하거나 약간 높은 편
    { region: '용산구', offset: -18 }, // 마포구보다 시세가 높은 편
  ],
};

function mockNeighbors(raw, form) {
  const offsets = MOCK_NEIGHBOR_OFFSETS_BY_DISTRICT[form.district];
  if (!offsets) return [];
  const base = pct(raw.goal_probability);
  return offsets.map(({ region, offset }) => ({
    region,
    probability: Math.min(100, Math.max(0, base + offset)),
  }));
}

function mapRegionComparison(raw, form) {
  const list = raw.district_comparisons ?? [];
  const neighbors = list
    .filter((d) => d.realism?.status === 'ok')
    .map((d) => ({ region: d.district, probability: pct(d.goal_probability) }));
  const excluded = list
    .filter((d) => d.realism?.status !== 'ok')
    .map((d) => ({ region: d.district, reason: d.realism?.warning || '비교 데이터 부족' }));
  return {
    current: { region: form.district, probability: pct(raw.goal_probability) },
    neighbors: neighbors.length > 0 ? neighbors : mockNeighbors(raw, form),
    excluded,
  };
}

export function mapDiagnosisResponse(raw, form) {
  const housingBurdenRatio = pct(raw.housing_burden_ratio);
  return {
    score: raw.achievement_score,
    grade: { label: raw.suitability, tone: GRADE_TONE_BY_SUITABILITY[raw.suitability] ?? 'amber' },
    scoreBreakdown: raw.score_breakdown,
    housingBurdenRatio,
    burdenTag: burdenTagFromRatio(housingBurdenRatio),
    monthlySavings: won(raw.monthly_saving),
    dti: pct(raw.dti),
    goalProbability: pct(raw.goal_probability),
    touchProbability: pct(raw.ever_reach_probability),
    requiredFunds: {
      requiredFunds: Math.round(raw.required_move_in_cash ?? 0),
      cashOnHand: won(raw.available_cash),
      sufficient: raw.feasible,
    },
    warning: raw.warnings?.length ? { message: raw.warnings[0] } : null,
    assetPath: mapAssetPath(raw),
    whatIfScenarios: mapWhatIfScenarios(raw),
    regionComparison: mapRegionComparison(raw, form),
    assumptions: raw.assumptions ?? [],
  };
}

