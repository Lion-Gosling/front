// 컴포넌트가 실제로 import하는 단일 진입점.
// 지금은 로컬 계산 함수를 감싸고 있을 뿐이지만, 함수 시그니처(입력: form/result,
// 출력: Promise)를 유지한 채 내부만 실제 백엔드 fetch 호출로 바꾸면
// 화면 쪽 코드는 손댈 필요가 없습니다.
import { getSupportPrograms as getSupportProgramsLocal } from './supportPrograms';
import { getIncomeRecommendation as getIncomeRecommendationLocal } from './recommend';
import { createPersona as createPersonaRemote } from './persona';
import { createScenario as createScenarioRemote } from './scenario';
import { createDiagnosis as createDiagnosisRemote } from './diagnosis';
import { mapDiagnosisResponse } from './diagnosisMapper';
import { createTimingComparison as createTimingComparisonRemote } from './timingComparison';
import { mapTimingComparisonResponse } from './timingComparisonMapper';
import { fetchBenchmarkTargets } from './benchmarks';
import { fetchHousingBenchmark as fetchHousingBenchmarkRemote } from './housingBenchmark';
import { analyzeEventText as analyzeEventTextRemote } from './eventAnalysis';
import { submitEventAnswers as submitEventAnswersRemote } from './eventSubmission';

const WON_PER_MANWON = 10000;
const won = (v) => Math.round((v ?? 0) / WON_PER_MANWON);

function hasValidAgeIncome(age, income) {
  return Number(age) > 0 && Number(income) >= 0;
}

export async function getSupportPrograms(form, result) {
  // 향후: return fetch('/api/support-programs', { method: 'POST', body: JSON.stringify({ form, result }) }).then((r) => r.json());
  return getSupportProgramsLocal(form, result);
}

export async function getSimulation(form, result) {
  if (!form.scenario?.id) throw new Error('scenario_id가 없습니다 (2번째 스텝이 아직 완료되지 않음)');
  const raw = await createTimingComparisonRemote(form.scenario.id);
  return mapTimingComparisonResponse(raw, form);
}

export async function getIncomeRecommendation(age) {
  // 향후: return fetch(`/api/recommend/income?age=${age}`).then((r) => r.json());
  return getIncomeRecommendationLocal(age);
}

export async function getLivingCostRecommendation(age, income) {
  if (!hasValidAgeIncome(age, income)) return null;
  const raw = await fetchBenchmarkTargets(age, income);
  const value = won(raw.living_cost_default);
  return {
    value,
    source: 'KOSIS 가계동향조사',
    description: `${raw.age_min}~${raw.age_max}세, 월소득 ${Number(income).toLocaleString()}만원 기준 또래 평균 월 생활비는 ${value}만원이에요.`,
  };
}

export async function getFutureGoalRecommendations(age, income) {
  if (!hasValidAgeIncome(age, income)) return null;
  const raw = await fetchBenchmarkTargets(age, income);
  const targetAssetValue = won(raw.target_asset_default);
  const targetYearsValue = Math.round((raw.target_months_default ?? 0) / 12);
  return {
    targetAsset: {
      value: targetAssetValue,
      source: 'KOSIS 가계금융복지조사',
      description: `보통 ${raw.age_min}~${raw.age_max}세가 목표로 삼는 자산은 약 ${targetAssetValue.toLocaleString()}만원대예요.`,
    },
    targetYears: {
      value: targetYearsValue,
      source: 'KOSIS 가계금융복지조사',
      description: `${raw.age_min}~${raw.age_max}세 사회초년생은 보통 약 ${targetYearsValue}년을 목표 기간으로 잡아요.`,
    },
  };
}

export async function getHousingBenchmark(district, housingType) {
  if (!district || !housingType) return null;
  return fetchHousingBenchmarkRemote(district, housingType);
}

// 이 아래부터는 목업이 아니라 실제 백엔드로 나가는 진짜 fetch 호출입니다.
export async function createPersona(form) {
  return createPersonaRemote(form);
}

export async function createScenario(profileId, form) {
  return createScenarioRemote(profileId, form);
}

export async function diagnose(form) {
  if (!form.scenario?.id) throw new Error('scenario_id가 없습니다 (2번째 스텝이 아직 완료되지 않음)');
  const raw = await createDiagnosisRemote(form.scenario.id);
  return mapDiagnosisResponse(raw, form);
}

export async function getTextInsight(text) {
  return analyzeEventTextRemote(text);
}

export async function submitEventAnswers(profileId, events) {
  return submitEventAnswersRemote(profileId, events);
}
