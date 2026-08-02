import { useEffect, useState } from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import RecommendationHeader from './RecommendationHeader';
import RecommendedField from './RecommendedField';
import { getIncomeRecommendation, getLivingCostRecommendation, getFutureGoalRecommendations } from '../../lib/api';

const HOUSING_TYPE_OPTIONS = [
  { value: 'family', label: '자가 · 가족 집에 거주 (임대료 없음)' },
  { value: 'monthly_rent', label: '월세로 거주 중' },
  { value: 'jeonse', label: '전세로 거주 중' },
];

export default function BasicInfoFields({ form, setField }) {
  const [incomeRec, setIncomeRec] = useState(null);
  const [loadingIncome, setLoadingIncome] = useState(true);

  const [livingCostRec, setLivingCostRec] = useState(null);
  const [loadingLivingCost, setLoadingLivingCost] = useState(true);

  const [futureGoalRec, setFutureGoalRec] = useState(null);
  const [loadingFutureGoal, setLoadingFutureGoal] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoadingIncome(true);
    getIncomeRecommendation(form.age).then((rec) => {
      if (!alive) return;
      setIncomeRec(rec);
      setLoadingIncome(false);
      if (!form.incomeTouched) setField('income', String(rec.value));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age]);

  useEffect(() => {
    let alive = true;
    setLoadingLivingCost(true);
    getLivingCostRecommendation(form.age, form.income).then((rec) => {
      if (!alive || !rec) return;
      setLivingCostRec(rec);
      setLoadingLivingCost(false);
      if (!form.expenseTouched) setField('expense', String(rec.value));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age, form.income]);

  useEffect(() => {
    let alive = true;
    setLoadingFutureGoal(true);
    getFutureGoalRecommendations(form.age, form.income).then((rec) => {
      if (!alive || !rec) return;
      setFutureGoalRec(rec);
      setLoadingFutureGoal(false);
      if (!form.targetAssetTouched) setField('targetAsset', String(rec.targetAsset.value));
      if (!form.targetYearsTouched) setField('targetYears', String(rec.targetYears.value));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age, form.income]);

  return (
    <>
      <FormField label="나이" unit="세" value={form.age} onChange={(v) => setField('age', v)} />

      <RecommendationHeader />

      <RecommendedField
        loading={loadingIncome}
        label="월급여"
        source={incomeRec?.source}
        description={incomeRec?.description}
        value={form.income}
        unit="만원"
        onChange={(v) => {
          setField('incomeTouched', true);
          setField('income', v);
        }}
        hint="이대로 진행할까요? 필요하면 직접 수정하세요"
      />

      <FormField
        label="현재 보유 자산"
        unit="만원"
        value={form.assets}
        onChange={(v) => setField('assets', v)}
      />

      <RecommendedField
        loading={loadingLivingCost}
        label="월 생활비"
        source={livingCostRec?.source}
        description={livingCostRec?.description}
        value={form.expense}
        unit="만원"
        onChange={(v) => {
          setField('expenseTouched', true);
          setField('expense', v);
        }}
        hint="이대로 진행할까요? 필요하면 직접 수정하세요"
      />

      <SelectField
        label="현재 거주 형태"
        value={form.currentHousingType}
        onChange={(v) => setField('currentHousingType', v)}
        options={HOUSING_TYPE_OPTIONS}
      />
      <FormField
        label="현재 월 주거비 (독립 전 내고 있는 비용)"
        unit="만원"
        value={form.currentHousingCost}
        onChange={(v) => setField('currentHousingCost', v)}
        placeholder="0"
      />

      <FormField
        label="대출 잔액 (대출 이력이 있으면 입력)"
        unit="만원"
        value={form.debtBalance}
        onChange={(v) => setField('debtBalance', v)}
        placeholder="0"
      />
      <FormField
        label="대출 월 상환액"
        unit="만원"
        value={form.debtMonthlyPayment}
        onChange={(v) => setField('debtMonthlyPayment', v)}
        placeholder="0"
      />

      <RecommendedField
        loading={loadingFutureGoal}
        label="목표자산"
        source={futureGoalRec?.targetAsset.source}
        description={futureGoalRec?.targetAsset.description}
        value={form.targetAsset}
        unit="만원"
        onChange={(v) => {
          setField('targetAssetTouched', true);
          setField('targetAsset', v);
        }}
        hint="이대로 진행할까요? 필요하면 직접 수정하세요"
      />

      <RecommendedField
        loading={loadingFutureGoal}
        label="목표 기간"
        source={futureGoalRec?.targetYears.source}
        description={futureGoalRec?.targetYears.description}
        value={form.targetYears}
        unit="년"
        onChange={(v) => {
          setField('targetYearsTouched', true);
          setField('targetYears', v);
        }}
        hint="이대로 진행할까요? 필요하면 직접 수정하세요"
      />
    </>
  );
}
