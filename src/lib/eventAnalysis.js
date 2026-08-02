// 실제 백엔드로 나가는 진짜 API 호출입니다 (목업 아님).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/simulation/events/analyze/';

export async function analyzeEventText(text) {
  const res = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`문장 분석 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json();
}
