// 실제 백엔드로 나가는 API 호출입니다 (persona.js와 동일한 패턴).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/simulation/scenarios/';

export function buildScenarioPayload(profileId, form) {
  return {
    profile_id: profileId,
    district: form.district,
    housing_type: form.housingType,
    desired_area_pyeong: Number(form.areaPyeong) || 0,
    contract_slider_pct: Math.round(Number(form.contractSliderPct) || 0),
    wants_loan: !!form.wantsLoan,
  };
}

export async function createScenario(profileId, form) {
  const payload = buildScenarioPayload(profileId, form);

  const res = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`scenario 생성 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json(); // 201 Created 시 서버가 내려주는 scenario 레코드
}
