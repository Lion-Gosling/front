import FormField from './FormField';
import SelectField from './SelectField';

const REGIONS = [
  '서울 마포구',
  '서울 강남구',
  '서울 성동구',
  '서울 관악구',
  '경기 성남시',
  '경기 고양시',
  '인천 연수구',
];

export default function HousingPlanFields({ form, setField }) {
  return (
    <>
      <SelectField
        label="희망 지역"
        value={form.region}
        onChange={(v) => setField('region', v)}
        options={REGIONS}
      />
      <FormField
        label="희망 보증금"
        unit="만원"
        value={form.deposit}
        onChange={(v) => setField('deposit', v)}
      />
      <FormField
        label="희망 월세"
        unit="만원"
        value={form.rent}
        onChange={(v) => setField('rent', v)}
      />
    </>
  );
}
