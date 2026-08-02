// 데모용 KOSIS 통계 근사치입니다. 월급여 추천은 아직 백엔드 엔드포인트가 없어
// 로컬 근사치로 남겨둡니다(목표자산/생활비/목표기간은 benchmarks.js의 실제 API로 대체됨).

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

function pickBand(bands, age, key = 'value') {
  return bands.find((b) => age <= b.max)?.[key] ?? bands[bands.length - 1][key];
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
