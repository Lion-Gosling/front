// 실제 백엔드로 나가는 첫 번째 진짜 API 호출입니다 (나머지 lib 파일들과 달리 목업이 아님).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/profiles/financial-profiles/';

// 화면에서는 "만원" 단위로 입력받지만 백엔드는 "원" 단위를 기대합니다.
function toWon(manwon) {
  const n = Number(manwon);
  return Number.isFinite(n) ? Math.round(n * 10000) : 0;
}

export function buildPersonaPayload(form) {
  return {
    age: Number(form.age) || 0,
    monthly_income: toWon(form.income),
    current_cash: toWon(form.assets),
    monthly_living_cost: toWon(form.expense),
    debt_balance: toWon(form.debtBalance),
    debt_monthly_payment: toWon(form.debtMonthlyPayment),
    target_asset: toWon(form.targetAsset),
    target_months: Math.round((Number(form.targetYears) || 0) * 12),
    current_monthly_housing_cost: toWon(form.currentHousingCost),
    current_housing_type: form.currentHousingType,
    is_target_asset_default: !form.targetAssetTouched,
    is_target_months_default: !form.targetYearsTouched,
    is_living_cost_default: !form.expenseTouched,
  };
}

export async function createPersona(form) {
  const payload = buildPersonaPayload(form);

  const res = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`persona 생성 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json(); // 201 Created 시 서버가 내려주는 persona 레코드(id 포함)
}
