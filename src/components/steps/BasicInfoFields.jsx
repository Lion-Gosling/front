import { useEffect, useRef, useState } from 'react';
import FormField from './FormField';
import RecommendationHeader from './RecommendationHeader';
import RecommendedField from './RecommendedField';
import { getIncomeRecommendation } from '../../lib/api';

export default function BasicInfoFields({ form, setField }) {
  const [incomeRec, setIncomeRec] = useState(null);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const incomeTouched = useRef(false);

  useEffect(() => {
    let alive = true;
    setLoadingIncome(true);
    getIncomeRecommendation(form.age).then((rec) => {
      if (!alive) return;
      setIncomeRec(rec);
      setLoadingIncome(false);
      if (!incomeTouched.current) setField('income', String(rec.value));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age]);

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
          incomeTouched.current = true;
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
      <FormField
        label="월평균 지출"
        unit="만원"
        value={form.expense}
        onChange={(v) => setField('expense', v)}
      />
      <FormField
        label="대출금 (대출 이력이 있으면 입력)"
        unit="만원"
        value={form.debt}
        onChange={(v) => setField('debt', v)}
        placeholder="0"
      />
    </>
  );
}
