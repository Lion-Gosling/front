// 지원제도 카탈로그 + 자격 판정. 실제 서비스에서는 이 파일 전체가
// 백엔드의 "추천 지원제도" API 응답으로 대체될 자리입니다.

const CATALOG = [
  {
    id: 'youth-rent-support',
    icon: 'home',
    color: 'amber',
    title: '청년 월세 지원',
    org: '국토교통부',
    description: '월세 20만원 범위 내에서 최대 12개월간 월세를 지원받을 수 있는 제도입니다. 소득 기준 충족 시 신청 가능합니다.',
    savingLabel: '연간 최대 240만원 절감',
    annualSaving: 2_400_000,
    tags: ['만 19~34세', '부모님과 별도 거주', '소득 기준 충족'],
    schedule: '수시 신청',
    minAge: 19,
    maxAge: 34,
    maxMonthlyIncomeManwon: 320,
  },
  {
    id: 'buttimok-loan',
    icon: 'landmark',
    color: 'blue',
    title: '버팀목 전세자금 대출',
    org: '주택도시기금',
    description: '전세보증금의 최대 70%까지 저금리(연 1.5~2.5%)로 대출받을 수 있는 상품입니다. 청년층 우대금리가 적용됩니다.',
    savingLabel: '연간 이자 약 180만원 절감',
    annualSaving: 1_800_000,
    tags: ['만 19~34세', '무주택 세대주', '연소득 5천만원 이하'],
    schedule: '상시 신청',
    minAge: 19,
    maxAge: 34,
    maxMonthlyIncomeManwon: 417,
  },
  {
    id: 'kb-youth-account',
    icon: 'card',
    color: 'amber',
    title: 'KB 청년 주거래 우대 통장',
    org: 'KB국민은행',
    description: '급여이체 및 주거래 실적에 따라 최대 연 4.5% 금리와 각종 수수료 면제 혜택을 제공하는 청년 전용 통장입니다.',
    savingLabel: '연간 약 45만원 추가 이자',
    annualSaving: 450_000,
    tags: ['만 19~39세', '급여이체 실적', 'KB국민은행 신규/기존 고객'],
    schedule: '한정 판매',
    minAge: 19,
    maxAge: 39,
  },
  {
    id: 'youth-hope-savings',
    icon: 'sprout',
    color: 'green',
    title: '청년내일저축계좌',
    org: '보건복지부',
    description: '본인 저축액에 정부가 1:1 매칭 지원하는 자산형성 지원 제도입니다. 3년간 최대 1,440만원을 모을 수 있습니다.',
    savingLabel: '3년간 정부 지원금 720만원',
    lumpSum: { amount: 7_200_000, years: 3 },
    tags: ['만 19~34세', '근로소득 기준 충족', '가구소득 기준 충족'],
    schedule: '연 1회 모집',
    minAge: 19,
    maxAge: 34,
    maxMonthlyIncomeManwon: 250,
    conditional: true,
  },
  {
    id: 'youth-dream-account',
    icon: 'building',
    color: 'teal',
    title: '청년 주택드림 청약통장',
    org: '국토교통부',
    description: '청년층의 내 집 마련을 지원하는 청약통장으로, 최대 연 4.5% 금리와 소득공제 혜택을 함께 받을 수 있습니다.',
    savingLabel: '연간 소득공제 + 이자 약 100만원',
    annualSaving: 1_000_000,
    tags: ['만 19~34세', '무주택자', '연소득 3천만원 이하'],
    schedule: '상시 신청',
    minAge: 19,
    maxAge: 34,
    maxMonthlyIncomeManwon: 250,
  },
  {
    id: 'kb-hope-savings',
    icon: 'coins',
    color: 'amber',
    title: 'KB 청년 희망 적금',
    org: 'KB국민은행',
    description: '기본 금리 3.5%에 우대금리 최대 1.5%를 더해 최대 연 5.0% 금리를 제공하는 청년 전용 적금 상품입니다.',
    savingLabel: '연간 약 36만원 추가 이자',
    annualSaving: 360_000,
    tags: ['만 19~39세', '월 30만원 이내 납입', '1년 이상 가입'],
    schedule: '상시 판매',
    minAge: 19,
    maxAge: 39,
  },
];

function evaluate(program, form) {
  const age = Number(form.age) || 0;
  if (age < program.minAge || age > program.maxAge) return 'ineligible';
  if (program.maxMonthlyIncomeManwon && Number(form.income) > program.maxMonthlyIncomeManwon) {
    return 'conditional';
  }
  return program.conditional ? 'conditional' : 'eligible';
}

export async function getSupportPrograms(form) {
  const evaluated = CATALOG.map((program) => ({ ...program, status: evaluate(program, form) })).filter(
    (p) => p.status !== 'ineligible'
  );

  const annualSavingTotal = evaluated
    .filter((p) => p.annualSaving)
    .reduce((sum, p) => sum + p.annualSaving, 0);

  const lumpSums = evaluated.filter((p) => p.lumpSum);

  return {
    programs: evaluated,
    annualSavingTotal,
    lumpSums,
  };
}
