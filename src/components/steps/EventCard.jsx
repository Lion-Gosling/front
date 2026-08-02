import { Sparkles } from 'lucide-react';
import DynamicQuestionField from './DynamicQuestionField';

function shouldShow(question, answers) {
  if (!question.show_when) return true;
  return answers?.[question.show_when.question_id] === question.show_when.equals;
}

export default function EventCard({ event, status, onSetStatus, answers, onQuestionChange }) {
  return (
    <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50 p-5">
      <div className="flex items-start gap-3">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-500" />
        <div>
          <p className="font-semibold text-violet-700">&ldquo;{event.label_ko}&rdquo;가 맞나요?</p>
        </div>
      </div>

      {!status && (
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onSetStatus('confirmed')}
            className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
          >
            네
          </button>
          <button
            type="button"
            onClick={() => onSetStatus('rejected')}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-500 transition hover:border-gray-300"
          >
            아니요
          </button>
        </div>
      )}

      {status === 'rejected' && (
        <p className="mt-3 text-xs text-gray-400">알겠어요, 이 내용은 진단에 반영하지 않을게요.</p>
      )}

      {status === 'confirmed' && (
        <div className="mt-4 space-y-5 rounded-xl bg-white p-4">
          {event.questions
            .filter((q) => shouldShow(q, answers))
            .map((q) => (
              <DynamicQuestionField
                key={q.question_id}
                question={q}
                value={answers?.[q.question_id]}
                onChange={(v) => onQuestionChange(q.question_id, v)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
