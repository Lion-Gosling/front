// 실제 백엔드로 나가는 API 호출입니다 (benchmarks.js와 동일한 GET 패턴, 404만 별도 처리).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/benchmarks/housing/';

export async function fetchHousingBenchmark(district, housingType) {
  const url = new URL(`${API_BASE_URL}${API_PATH}`);
  url.searchParams.set('district', district);
  url.searchParams.set('housing_type', housingType);

  const res = await fetch(url);
  if (res.status === 404) return null; // 해당 조건의 시세 데이터 없음 (정상적인 404)
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`housing benchmark 조회 실패 (${res.status} ${res.statusText}): ${body}`);
  }
  return res.json();
}
