import { useRef, useState } from 'react';
import { Sparkles, Loader2, CircleSlash2 } from 'lucide-react';
import EventCard from './EventCard';
import { getTextInsight } from '../../lib/api';

export default function FreeNoteField({ form, setField }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null); // { text, categories, abstained, ignored_reason } | null
  const [statusByEvent, setStatusByEvent] = useState({}); // { [event_id]: 'confirmed' | 'rejected' }
  const [answersByEvent, setAnswersByEvent] = useState({}); // { [event_id]: { [question_id]: value } }
  const lastAnalyzed = useRef('');

  // event_answers 제출 API가 기대하는 평평한 배열로 정리해서 form에 반영한다.
  // '아니요'로 응답한 이벤트는 아예 포함하지 않는다.
  const syncConfirmedEvents = (status, answers) => {
    const confirmed = [];
    (analysis?.categories ?? []).forEach((category) => {
      category.events.forEach((event) => {
        if (status[event.event_id] === 'confirmed') {
          confirmed.push({
            event_id: event.event_id,
            label: event.label,
            label_ko: event.label_ko,
            answers: answers[event.event_id] ?? {},
          });
        }
      });
    });
    setField('confirmedEvents', confirmed);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setStatusByEvent({});
    setAnswersByEvent({});
    setField('confirmedEvents', []);
  };

  const handleChange = (value) => {
    setField('note', value);
    if (value !== lastAnalyzed.current) resetAnalysis();
  };

  const runAnalysis = async () => {
    const text = form.note || '';
    if (!text.trim() || text === lastAnalyzed.current) return;
    lastAnalyzed.current = text;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await getTextInsight(text);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSetStatus = (eventId, status) => {
    const nextStatus = { ...statusByEvent, [eventId]: status };
    setStatusByEvent(nextStatus);
    syncConfirmedEvents(nextStatus, answersByEvent);
  };

  const handleQuestionChange = (eventId, questionId, value) => {
    const nextAnswers = {
      ...answersByEvent,
      [eventId]: { ...answersByEvent[eventId], [questionId]: value },
    };
    setAnswersByEvent(nextAnswers);
    syncConfirmedEvents(statusByEvent, nextAnswers);
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
        placeholder="예) 2년 뒤에 결혼할 계획이 있어서 결혼 비용이 좀 들 것 같아요"
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />

      {analyzing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          AI가 문장을 분석하고 있어요…
        </div>
      )}

      {!analyzing && error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-400">
          <CircleSlash2 size={16} className="shrink-0" />
          문장 분석에 실패했어요 ({error})
        </div>
      )}

      {!analyzing && !error && analysis?.abstained && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-400">
          <CircleSlash2 size={16} className="shrink-0" />
          {analysis.ignored_reason ?? '특별히 인식되는 내용이 없어요'}
        </div>
      )}

      {!analyzing &&
        !error &&
        !analysis?.abstained &&
        analysis?.categories.map((category) => (
          <div key={category.category_id} className="mt-5 first:mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{category.category_name}</p>
            {category.events.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                status={statusByEvent[event.event_id]}
                onSetStatus={(status) => handleSetStatus(event.event_id, status)}
                answers={answersByEvent[event.event_id]}
                onQuestionChange={(questionId, value) => handleQuestionChange(event.event_id, questionId, value)}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
