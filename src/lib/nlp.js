// 데모용 간단 키워드 매칭입니다. 실제로는 백엔드의 자연어처리 모델이 문장을 인코딩해
// 어떤 항목(소득 변동, 이사 계획 변경 등)에 해당하는지 판별해 내려줍니다.
// 반환값의 형태(label/sourceQuote)만 유지한 채 내부를 실제 fetch 호출로 바꾸면
// 화면 쪽 코드는 손댈 필요가 없습니다.

const FETCH_DELAY_MS = 700;

function delay(value) {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), FETCH_DELAY_MS));
}

const PATTERNS = [
  { label: '소득 변동', keywords: ['이직', '퇴사', '월급', '연봉', '인상', '삭감', '휴직', '창업', '소득'] },
  { label: '이사 계획 변경', keywords: ['이사', '독립을 미루', '더 빨리 독립', '늦게 독립'] },
  { label: '부모님 지원', keywords: ['부모님', '지원받', '보태주', '증여'] },
  { label: '결혼 계획', keywords: ['결혼', '예비', '신혼'] },
];

export async function analyzeFreeText(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return delay(null);
  const matched = PATTERNS.find((p) => p.keywords.some((k) => trimmed.includes(k)));
  if (!matched) return delay(null);
  return delay({ label: matched.label, sourceQuote: trimmed });
}
