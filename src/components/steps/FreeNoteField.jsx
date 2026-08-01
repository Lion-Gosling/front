import { useRef, useState } from 'react';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { getTextInsight } from '../../lib/api';

const LIKELIHOOD_OPTIONS = [
  { key: 'uncertain', label: '불확실' },
  { key: 'ambiguous', label: '애매함' },
  { key: 'certain', label: '확실' },
];

export default function FreeNoteField({ form, setField }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [detection, setDetection] = useState(null); // { label, sourceQuote } | null
  const [confirmed, setConfirmed] = useState(null); // true | false | null
  const [likelihood, setLikelihood] = useState(null);
  const lastAnalyzed = useRef('');

  const resetFollowUp = () => {
    setDetection(null);
    setConfirmed(null);
    setLikelihood(null);
  };

  const handleChange = (value) => {
    setField('note', value);
    if (value !== lastAnalyzed.current) resetFollowUp();
  };

  const runAnalysis = async () => {
    const text = form.note || '';
    if (!text.trim() || text === lastAnalyzed.current) return;
    lastAnalyzed.current = text;
    setAnalyzing(true);
    const result = await getTextInsight(text);
    setAnalyzing(false);
    setDetection(result);
  };

  const handleConfirm = (isCorrect) => {
    setConfirmed(isCorrect);
    if (!isCorrect) setField('noteInsight', null);
  };

  const handleLikelihood = (key) => {
    setLikelihood(key);
    setField('noteInsight', { label: detection.label, sourceQuote: detection.sourceQuote, likelihood: key });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
          <Sparkles size={20} />
        </span>
        <div>
          <div className="font-bold text-gray-900">추가로 알려주고 싶은 내용이 있나요?</div>
          <p className="mt-0.5 text-sm text-gray-400">자유롭게 적어주시면 AI가 진단에 참고할게요 (선택)</p>
        </div>
      </div>

      <textarea
        value={form.note || ''}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={runAnalysis}
        placeholder="예) 다음 달에 이직해서 월급이 오를 것 같아요"
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />

      {analyzing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          AI가 문장을 분석하고 있어요…
        </div>
      )}

      {!analyzing && detection && confirmed === null && (
        <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-500" />
            <div>
              <p className="font-semibold text-violet-700">&ldquo;{detection.label}&rdquo;이 확인되었습니다.</p>
              <p className="mt-1 text-sm text-violet-500">입력하신 내용이 맞을까요?</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => handleConfirm(true)}
              className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
            >
              맞아요
            </button>
            <button
              type="button"
              onClick={() => handleConfirm(false)}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-500 transition hover:border-gray-300"
            >
              아니에요
            </button>
          </div>
        </div>
      )}

      {confirmed === false && (
        <p className="mt-3 text-xs text-gray-400">알겠어요, 이 내용은 진단에 반영하지 않을게요.</p>
      )}

      {confirmed === true && !likelihood && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-sm font-semibold text-gray-700">이 일이 발생할 가능성은 어느 정도인가요?</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {LIKELIHOOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleLikelihood(opt.key)}
                className="rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition hover:border-amber-300 hover:text-gray-700"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {confirmed === true && likelihood && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <CheckCircle2 size={16} className="shrink-0" />
          &ldquo;{detection.label}&rdquo; · {LIKELIHOOD_OPTIONS.find((o) => o.key === likelihood)?.label}(으)로
          반영했어요
        </div>
      )}
    </div>
  );
}
