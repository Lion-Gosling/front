// 컴포넌트가 실제로 import하는 단일 진입점.
// 지금은 로컬 계산 함수를 감싸고 있을 뿐이지만, 함수 시그니처(입력: form/result,
// 출력: Promise)를 유지한 채 내부만 실제 백엔드 fetch 호출로 바꾸면
// 화면 쪽 코드는 손댈 필요가 없습니다.
import { diagnose as diagnoseLocal } from './calculate';
import { getSupportPrograms as getSupportProgramsLocal } from './supportPrograms';
import { simulateScenarios as simulateScenariosLocal } from './simulate';

export async function diagnose(form) {
  // 향후: return fetch('/api/diagnose', { method: 'POST', body: JSON.stringify(form) }).then((r) => r.json());
  return diagnoseLocal(form);
}

export async function getSupportPrograms(form, result) {
  // 향후: return fetch('/api/support-programs', { method: 'POST', body: JSON.stringify({ form, result }) }).then((r) => r.json());
  return getSupportProgramsLocal(form, result);
}

export async function getSimulation(form, result) {
  // 향후: return fetch('/api/simulate', { method: 'POST', body: JSON.stringify({ form, result }) }).then((r) => r.json());
  return simulateScenariosLocal(form, result);
}
