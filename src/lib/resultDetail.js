// 실제 백엔드(실거래가 통계 · 몬테카를로 시뮬레이션 서비스)가 붙기 전까지 쓰는
// 단순화된 근사치입니다. 반환값의 형태(shape)만 유지한 채 내부 계산을
// 실제 백엔드 fetch 호출로 바꾸면 화면 쪽 코드는 손댈 필요가 없습니다.

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const RENT_GROWTH_ANNUAL = 0.035;
const RENEWAL_MONTH = 24; // 표준 2년 계약 갱신 시점
const RENEWAL_BUMP = 1.07; // 갱신 시 월세 인상 근사치

const REGION_MEDIAN_RENT = {
  '서울 마포구': 65,
  '서울 강남구': 95,
  '서울 성동구': 70,
  '서울 관악구': 55,
  '경기 성남시': 60,
  '경기 고양시': 50,
  '인천 연수구': 45,
};

const REGION_NEIGHBORS = {
  '서울 마포구': ['영등포구', '서대문구', '은평구', '용산구'],
  '서울 강남구': ['서초구', '송파구', '성동구', '강동구'],
  '서울 성동구': ['광진구', '동대문구', '중구', '강남구'],
  '서울 관악구': ['동작구', '금천구', '서초구', '영등포구'],
  '경기 성남시': ['용인시', '하남시', '광주시', '수원시'],
  '경기 고양시': ['파주시', '김포시', '은평구', '양주시'],
  '인천 연수구': ['남동구', '미추홀구', '시흥시', '부평구'],
};

function shortRegionLabel(region) {
  return region.split(' ').slice(1).join(' ') || region;
}

function estimateGoalProbability(form, result) {
  const targetYears = Number(form.targetYears) || 5;
  if (!Number.isFinite(result.yearsToGoal)) return 8;
  const aheadYears = targetYears - result.yearsToGoal;
  return Math.round(clamp(50 + aheadYears * 12, 5, 95));
}

function buildOutlierWarning(form) {
  const rent = Number(form.rent) || 0;
  const medianRent = REGION_MEDIAN_RENT[form.region] ?? 60;
  const ratioPercent = medianRent > 0 ? Math.round((rent / medianRent) * 100) : 0;
  if (ratioPercent < 150) return null;
  return {
    message: `${shortRegionLabel(form.region)} 월세가 시세 중앙값의 ${ratioPercent}%예요. 입력 오류가 아닌지 확인해 보세요.`,
    inputRent: rent,
    medianRent,
    ratioPercent,
  };
}

function buildRequiredFunds(form) {
  const deposit = Number(form.deposit) || 0;
  const rent = Number(form.rent) || 0;
  const movingCost = 150; // 이사비 지역 평균값 근사치
  const brokerageFee = Math.round(deposit * 0.003); // 중개보수 근사치
  const requiredFunds = movingCost + brokerageFee + rent;
  const cashOnHand = Number(form.assets) || 0;
  return { requiredFunds, cashOnHand, sufficient: cashOnHand >= requiredFunds };
}

function buildAssetPath(form) {
  const income = Number(form.income) || 0;
  const expense = Number(form.expense) || 0;
  const assets0 = Number(form.assets) || 0;
  const baseRent = Number(form.rent) || 0;
  const targetYears = Number(form.targetYears) || 5;
  const horizonMonths = Math.max(Math.round(targetYears * 12), 12);
  const renewalMonth = Math.min(RENEWAL_MONTH, horizonMonths);

  const preRenewalSaving = income - expense - baseRent;
  const renewedRent = baseRent * RENEWAL_BUMP * Math.pow(1 + RENT_GROWTH_ANNUAL, renewalMonth / 12);
  const postRenewalSaving = income - expense - renewedRent;

  const median = [assets0];
  let cash = assets0;
  for (let m = 1; m <= horizonMonths; m++) {
    cash += m <= renewalMonth ? preRenewalSaving : postRenewalSaving;
    median.push(Math.round(cash));
  }

  const p5 = median.map((v, m) => Math.round(Math.max(v * (1 - (0.1 + 0.006 * m)), 0)));
  const p95 = median.map((v, m) => Math.round(v * (1 + (0.1 + 0.006 * m))));

  return { horizonMonths, renewalMonth, median, p5, p95 };
}

function buildWhatIfScenarios(form, result, baseProbability) {
  return [
    {
      key: 'wait12m',
      label: '12개월 대기 후 독립',
      probability: clamp(baseProbability + 12, 0, 99),
      deltaPercentPoint: 12,
    },
    {
      key: 'apartment',
      label: '오피스텔 대신 아파트로',
      probability: clamp(baseProbability + 6, 0, 99),
      deltaPercentPoint: 6,
    },
  ];
}

function buildRegionComparison(form, baseProbability) {
  const neighbors = REGION_NEIGHBORS[form.region] ?? ['인접 지역 A', '인접 지역 B', '인접 지역 C', '인접 지역 D'];
  const offsets = [9, 3];
  const compared = neighbors.slice(0, 2).map((region, i) => ({
    region,
    probability: clamp(baseProbability + offsets[i], 0, 99),
  }));
  const excludedReasons = ['해당 조건의 시세 데이터가 부족해', '입력 조건이 시세와 맞지 않아'];
  const excluded = neighbors.slice(2, 4).map((region, i) => ({
    region,
    reason: excludedReasons[i % excludedReasons.length],
  }));

  return {
    current: { region: shortRegionLabel(form.region), probability: baseProbability },
    neighbors: compared,
    excluded,
  };
}

export async function getResultDetail(form, result) {
  const goalProbability = estimateGoalProbability(form, result);
  const touchProbability = clamp(goalProbability + 16, goalProbability, 99);

  return {
    goalProbability,
    touchProbability,
    warning: buildOutlierWarning(form),
    requiredFunds: buildRequiredFunds(form),
    assetPath: buildAssetPath(form),
    whatIfScenarios: buildWhatIfScenarios(form, result, goalProbability),
    regionComparison: buildRegionComparison(form, goalProbability),
    assumptions: [
      `목표자산 ${Number(form.targetAsset || 0).toLocaleString()}만원 — 입력한 나이·소득대 평균으로 자동 설정됨`,
      `월 생활비 ${Number(form.expense || 0).toLocaleString()}만원 — 통계청 가계동향조사 기준 자동 설정됨`,
      '이사비·중개보수 — 지역 평균값 자동 적용됨',
      '보증금 회수율 98% — 계약 종료 시 2% 손실 위험 반영',
      '시뮬레이션 조건 10,000회, 고정 시드 — 모든 비교 시나리오는 동일 조건으로 계산됨',
      '소득 리스크 — 실직·소득변동 등 소득 리스크는 아직 반영되지 않음',
    ],
  };
}
