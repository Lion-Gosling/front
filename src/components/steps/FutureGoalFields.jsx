import { useEffect, useRef, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import FormField from './FormField';
import RecommendationHeader from './RecommendationHeader';
import RecommendedField from './RecommendedField';
import FreeNoteField from './FreeNoteField';
import { getTargetAssetRecommendation } from '../../lib/api';

export default function FutureGoalFields({ form, setField }) {
  const [assetRec, setAssetRec] = useState(null);
  const [loadingAsset, setLoadingAsset] = useState(true);
  const assetTouched = useRef(false);

  useEffect(() => {
    let alive = true;
    setLoadingAsset(true);
    getTargetAssetRecommendation(form.age, form.income).then((rec) => {
      if (!alive) return;
      setAssetRec(rec);
      setLoadingAsset(false);
      if (!assetTouched.current) setField('targetAsset', String(rec.value));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age, form.income]);

  return (
    <>
      <RecommendationHeader />

      <RecommendedField
        loading={loadingAsset}
        label="목표자산"
        source={assetRec?.source}
        description={assetRec?.description}
        value={form.targetAsset}
        unit="만원"
        onChange={(v) => {
          assetTouched.current = true;
          setField('targetAsset', v);
        }}
        hint="이대로 진행할까요? 필요하면 직접 수정하세요"
      />

      <div>
        <FormField
          label="목표 기간"
          unit="년"
          value={form.targetYears}
          onChange={(v) => setField('targetYears', v)}
        />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <Lightbulb size={13} className="shrink-0" />
          사회초년생 기준 3~5년을 추천드려요
        </p>
      </div>

      <FreeNoteField form={form} setField={setField} />
    </>
  );
}
