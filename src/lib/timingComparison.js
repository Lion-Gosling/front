// 실제 백엔드로 나가는 API 호출입니다 (scenario.js / diagnosis.js와 동일한 패턴).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/simulation/timing-comparisons/';

export async function createTimingComparison(scenarioId) {
  const res = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: scenarioId }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`timing comparison 생성 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json(); // 201 Created 시 서버가 내려주는 { id, variants: [...] }
}
