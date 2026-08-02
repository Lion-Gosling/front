// 실제 백엔드로 나가는 진짜 API 호출입니다 (목업 아님).
//
// 요청하신 경로는 /profiles/{event_id}/events/ 였는데, event_answers 바디 자체가
// 여러 event_id를 담는 배열이라 경로 파라미터가 개별 이벤트를 가리킬 수는 없어 보여요.
// createPersona()가 만든 persona(=profile)의 id를 붙이는 /profiles/{profile_id}/events/로
// 이해하고 구현했습니다 — 맞는지 확인 부탁드려요.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export function buildEventAnswersPayload(events) {
  return {
    event_answers: events.map(({ event_id, label, answers }) => ({ event_id, label, answers })),
  };
}

export async function submitEventAnswers(profileId, events) {
  if (!events.length) return null;

  const res = await fetch(`${API_BASE_URL}/profiles/${profileId}/events/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildEventAnswersPayload(events)),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`이벤트 답변 제출 실패 (${res.status} ${res.statusText}): ${body}`);
  }

  return res.json().catch(() => null);
}
