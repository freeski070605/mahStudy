import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressRing from '../components/ProgressRing';
import { ExamResult } from '../utils/examTypes';

interface ResultsProps {
  result?: ExamResult;
}

const Results = ({ result }: ResultsProps) => {
  const navigate = useNavigate();
  const fallback = useMemo(() => {
    const saved = sessionStorage.getItem('esthetics-last-exam-result');
    return saved ? (JSON.parse(saved) as ExamResult) : undefined;
  }, []);
  const exam = result ?? fallback;

  if (!exam) {
    return (
      <div className="grid min-h-[65vh] place-items-center pb-24 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-950">No exam result yet</h1>
          <p className="mt-2 text-stone-600">Take a mock exam to see scoring and missed question review.</p>
          <button type="button" onClick={() => navigate('/exam')} className="mt-5 rounded-xl bg-peach-600 px-5 py-3 font-semibold text-white">
            Start exam
          </button>
        </div>
      </div>
    );
  }

  const missed = exam.answers.filter((answer) => !answer.correct);
  const minutes = Math.max(1, Math.round(exam.durationSeconds / 60));

  return (
    <div className="space-y-6 pb-24">
      <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <div className="mx-auto w-fit">
          <ProgressRing value={exam.percent} label="score" size={132} />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-stone-950">
          {exam.score} of {exam.total} correct
        </h1>
        <p className="mt-2 text-stone-600">Completed in {minutes} minutes. Review missed questions while they are fresh.</p>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Category breakdown</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(exam.categoryBreakdown).map(([category, item]) => {
            const percent = Math.round((item.correct / item.total) * 100);
            return (
              <div key={category}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-semibold text-stone-800">{category}</span>
                  <span className="text-stone-500">
                    {item.correct}/{item.total}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-peach-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-950">Missed questions</h2>
          <Link to="/smart-review" className="text-sm font-semibold text-peach-700">
            Smart review
          </Link>
        </div>
        {missed.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <h3 className="text-lg font-bold text-stone-950">Clean sweep</h3>
            <p className="mt-2 text-stone-600">No missed questions on this exam.</p>
          </div>
        ) : (
          missed.map((answer) => (
            <article key={answer.question.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-peach-700">{answer.question.category}</p>
              <h3 className="mt-2 text-lg font-bold text-stone-950">{answer.question.question}</h3>
              <p className="mt-3 text-sm text-rose-700">Your answer: {answer.selected ?? 'Not answered'}</p>
              <p className="mt-1 text-sm text-emerald-700">Correct answer: {answer.question.correctAnswer}</p>
              <p className="mt-3 rounded-xl bg-peach-50 p-4 text-sm leading-6 text-stone-700">{answer.question.explanation}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default Results;
