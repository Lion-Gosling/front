// 실제 백엔드로 나가는 API 호출입니다 (persona.js / scenario.js와 동일한 패턴).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/simulation/diagnoses/';

export async function createDiagnosis(scenarioId) {
  const res = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: scenarioId }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`diagnosis 생성 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json(); // 201 Created 시 서버가 내려주는 diagnosis 레코드
}
