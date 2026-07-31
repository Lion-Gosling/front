// 데모용 KOSIS 통계 근사치입니다. 실제로는 백엔드가 KOSIS API(임금근로일자리 소득통계,
// 가계금융복지조사 등)를 나이·소득 구간으로 조회해 추천값을 계산해 내려줍니다.
// 이 파일은 그 응답의 형태(value/source/description)만 흉내낸 것으로, 나중에
// 이 함수들 내부만 실제 fetch 호출로 바꾸면 화면 쪽 코드는 손댈 필요가 없습니다.

const FETCH_DELAY_MS = 450;

function delay(value) {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), FETCH_DELAY_MS));
}

// 연령대별 세후 평균 월급여 근사치 (만원) — KOSIS 임금근로일자리 소득통계 흉내
const INCOME_BANDS = [
  { max: 24, value: 230 },
  { max: 29, value: 300 },
  { max: 34, value: 355 },
  { max: 39, value: 410 },
  { max: 44, value: 440 },
  { max: 49, value: 445 },
  { max: 54, value: 420 },
  { max: 59, value: 380 },
  { max: Infinity, value: 300 },
];

// 연령대별 "3년 내 목표로 삼는 자산" 근사치 (만원) — KOSIS 가계금융복지조사 흉내
const TARGET_ASSET_BANDS = [
  { max: 24, value: 1800 },
  { max: 29, value: 2500 },
  { max: 34, value: 3500 },
  { max: 39, value: 4800 },
  { max: 44, value: 6000 },
  { max: Infinity, value: 7000 },
];

function pickBand(bands, age) {
  return bands.find((b) => age <= b.max)?.value ?? bands[bands.length - 1].value;
}

function ageGroupLabel(age) {
  const decade = Math.floor(age / 10) * 10;
  const half = age % 10 < 5 ? '초반' : '중반';
  if (decade < 20) return '10대';
  return `${decade === 20 ? '20' : decade}대 ${half}`;
}

export async function getIncomeRecommendation(age) {
  const ageNum = Number(age) || 27;
  const value = pickBand(INCOME_BANDS, ageNum);
  return delay({
    value,
    source: 'KOSIS 임금근로일자리 소득통계',
    description: `${ageNum}세 또래 평균 세후 월급여는 약 ${value}만원이에요.`,
  });
}

export async function getTargetAssetRecommendation(age, income) {
  const ageNum = Number(age) || 27;
  const incomeNum = Number(income) || 0;
  const base = pickBand(TARGET_ASSET_BANDS, ageNum);
  // 입력한 소득이 또래 평균보다 높으면 목표치도 비례해 조금 끌어올림
  const incomeRef = pickBand(INCOME_BANDS, ageNum);
  const adjusted = incomeNum > 0 ? Math.round((base * (incomeNum / incomeRef)) / 100) * 100 : base;
  return delay({
    value: adjusted,
    source: 'KOSIS 가계금융복지조사',
    description: `보통 ${ageGroupLabel(ageNum)}가 3년 내 목표로 삼는 자산은 약 ${adjusted.toLocaleString()}만원대예요.`,
  });
}
