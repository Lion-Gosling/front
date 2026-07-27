// 보증금은 은행 예치 등 다른 곳에 두었을 때의 기회비용(연 4%)으로 환산해 월 주거비에 반영한다.
const DEPOSIT_OPPORTUNITY_RATE = 0.04;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function diagnose(form) {
  const income = Number(form.income) || 0;
  const expense = Number(form.expense) || 0;
  const assets = Number(form.assets) || 0;
  const deposit = Number(form.deposit) || 0;
  const rent = Number(form.rent) || 0;
  const targetAsset = Number(form.targetAsset) || 0;
  const targetYears = Number(form.targetYears) || 1;

  const monthlyHousingCost = rent + (deposit * DEPOSIT_OPPORTUNITY_RATE) / 12;
  const housingBurdenRatio = income > 0 ? (monthlyHousingCost / income) * 100 : 0;

  const monthlySavings = income - expense - rent;
  const savingsRatio = income > 0 ? (monthlySavings / income) * 100 : 0;

  const monthlyOutflow = expense + rent;
  const emergencyMonths = monthlyOutflow > 0 ? assets / monthlyOutflow : 0;

  const remainingToGoal = Math.max(targetAsset - assets, 0);
  const yearsToGoal =
    monthlySavings > 0 ? remainingToGoal / (monthlySavings * 12) : Infinity;

  const dti = housingBurdenRatio;

  const burdenPenalty = clamp((housingBurdenRatio - 20) * 1.5, 0, 40);
  const savingsPenalty = clamp((20 - savingsRatio) * 1, 0, 30);
  const emergencyPenalty = clamp((6 - emergencyMonths) * 3, 0, 20);
  const goalPenalty = Number.isFinite(yearsToGoal)
    ? clamp((yearsToGoal - targetYears) * 4, 0, 20)
    : 20;

  const score = Math.round(
    clamp(100 - burdenPenalty - savingsPenalty - emergencyPenalty - goalPenalty, 0, 100)
  );

  let grade;
  if (score >= 70) grade = { label: '적합', tone: 'green' };
  else if (score >= 40) grade = { label: '주의', tone: 'amber' };
  else grade = { label: '부담', tone: 'red' };

  const burdenTag = housingBurdenRatio <= 25 ? '적정' : housingBurdenRatio <= 35 ? '주의' : '위험';
  const savingsTag = savingsRatio >= 25 ? '양호' : savingsRatio >= 10 ? '보통' : '부족';
  const goalTag = Number.isFinite(yearsToGoal) && yearsToGoal <= targetYears ? '달성 가능' : '기간 초과';

  const reasons = [
    {
      type: housingBurdenRatio <= 30 ? 'check' : 'warning',
      title: `월 주거비 부담률 ${housingBurdenRatio.toFixed(1)}%`,
      desc:
        housingBurdenRatio <= 30
          ? '월 소득 대비 주거비 비율이 30% 미만으로 적정 수준입니다. 일반적으로 30% 이하를 권장합니다.'
          : '월 소득 대비 주거비 비율이 30%를 초과합니다. 희망 조건을 조정하는 것을 고려해보세요.',
    },
    {
      type: savingsRatio >= 10 ? 'check' : 'warning',
      title: `월 저축 가능 금액 ${Math.round(monthlySavings).toLocaleString()}만원`,
      desc: `소득에서 지출과 주거비를 제외한 금액입니다. 소득의 ${savingsRatio.toFixed(0)}%를 저축할 수 있어 재정 건전성이 ${
        savingsRatio >= 25 ? '양호합니다.' : savingsRatio >= 10 ? '보통입니다.' : '다소 부족합니다.'
      }`,
    },
    {
      type: emergencyMonths >= 6 ? 'check' : 'info',
      title: `비상금 ${emergencyMonths.toFixed(1)}개월분 확보`,
      desc: `현재 자산으로 약 ${emergencyMonths.toFixed(1)}개월치 생활비를 충당할 수 있습니다. 6개월 이상이면 안정적입니다.`,
    },
    {
      type: Number.isFinite(yearsToGoal) && yearsToGoal <= targetYears ? 'check' : 'warning',
      title: `목표 자산 달성까지 약 ${Number.isFinite(yearsToGoal) ? yearsToGoal.toFixed(1) : '∞'}년`,
      desc: Number.isFinite(yearsToGoal)
        ? `현재 저축 속도로 목표 자산 ${targetAsset.toLocaleString()}만원 달성까지 약 ${yearsToGoal.toFixed(
            1
          )}년이 소요됩니다. ${
            yearsToGoal <= targetYears
              ? `목표 기간(${targetYears}년) 내 달성 가능합니다.`
              : `목표 기간(${targetYears}년)보다 더 걸릴 것으로 예상됩니다.`
          }`
        : '현재 저축 여력으로는 목표 달성 시점을 예측하기 어렵습니다. 지출 구조를 점검해보세요.',
    },
  ];

  if (income <= 3500000 && assets <= 32000000) {
    reasons.push({
      type: 'tip',
      title: '청년 월세 지원 대상 가능성',
      desc: '소득 및 자산 기준을 고려할 때 청년 월세 지원 제도의 신청 대상일 가능성이 높습니다. 지원제도에서 확인해보세요.',
    });
  }

  return {
    score,
    grade,
    monthlyHousingCost: Math.round(monthlyHousingCost),
    housingBurdenRatio,
    burdenTag,
    monthlySavings: Math.round(monthlySavings),
    savingsTag,
    emergencyMonths,
    yearsToGoal,
    goalTag,
    dti,
    reasons,
  };
}
