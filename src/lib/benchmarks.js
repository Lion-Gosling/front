// 실제 백엔드로 나가는 API 호출입니다 (persona.js / scenario.js와 동일한 패턴, GET만 다름).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/benchmarks/targets/';

export async function fetchBenchmarkTargets(age, income) {
  const url = new URL(`${API_BASE_URL}${API_PATH}`);
  url.searchParams.set('age', age);
  url.searchParams.set('income', income);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`benchmark 조회 실패 (${res.status} ${res.statusText}): ${body}`);
  }
  return res.json();
}
