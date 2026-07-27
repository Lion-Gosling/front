import FormField from './FormField';

export default function BasicInfoFields({ form, setField }) {
  return (
    <>
      <FormField label="나이" unit="세" value={form.age} onChange={(v) => setField('age', v)} />
      <FormField
        label="월 소득 (세후)"
        unit="만원"
        value={form.income}
        onChange={(v) => setField('income', v)}
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
    </>
  );
}
