// 실제 백엔드로 나가는 API 호출입니다 (benchmarks.js와 동일한 GET 패턴).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PATH = '/support/programs/';

export async function fetchSupportPrograms(profileId) {
  const url = new URL(`${API_BASE_URL}${API_PATH}`);
  url.searchParams.set('profile_id', profileId);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`지원제도 조회 실패 (${res.status} ${res.statusText}): ${body}`);
  }
  return res.json();
}
