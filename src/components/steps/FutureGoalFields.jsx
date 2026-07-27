import FormField from './FormField';

export default function FutureGoalFields({ form, setField }) {
  return (
    <>
      <FormField
        label="목표 자산"
        unit="만원"
        value={form.targetAsset}
        onChange={(v) => setField('targetAsset', v)}
      />
      <FormField
        label="목표 기간"
        unit="년"
        value={form.targetYears}
        onChange={(v) => setField('targetYears', v)}
      />
    </>
  );
}
