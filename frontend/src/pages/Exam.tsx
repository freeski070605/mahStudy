import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileCheck2, TimerReset } from 'lucide-react';
import { EstheticsQuestion } from '../data/estheticsQuestionBank';
import { ExamResult } from '../utils/examTypes';
import { shuffle } from '../utils/studyProgress';

interface ExamProps {
  questions: EstheticsQuestion[];
  onComplete: (result: ExamResult) => void;
}

const examOptions = [
  { count: 25, minutes: 10, label: 'Quick quiz' },
  { count: 50, minutes: 20, label: 'Half mock' },
  { count: 100, minutes: 45, label: 'Full mock exam' },
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const Exam = ({ questions, onComplete }: ExamProps) => {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(25);
  const [examQuestions, setExamQuestions] = useState<EstheticsQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const current = examQuestions[currentIndex];
  const currentChoices = useMemo(() => (current ? shuffle(current.choices) : []), [current]);
  const selectedOption = examOptions.find((option) => option.count === selectedCount) ?? examOptions[0];
  const progress = examQuestions.length ? ((currentIndex + 1) / examQuestions.length) * 100 : 0;

  const examReadyQuestions = useMemo(
    () => questions.filter((question) => question.choices.length >= 4 && question.type !== 'flashcard'),
    [questions],
  );

  const finishExam = () => {
    if (!startedAt || examQuestions.length === 0) return;
    const examAnswers = examQuestions.map((question) => {
      const selected = answers[question.id];
      return { question, selected, correct: selected === question.correctAnswer };
    });
    const score = examAnswers.filter((answer) => answer.correct).length;
    const categoryBreakdown = examAnswers.reduce<Record<string, { correct: number; total: number }>>((acc, answer) => {
      const category = answer.question.category;
      acc[category] = acc[category] ?? { correct: 0, total: 0 };
      acc[category].total += 1;
      acc[category].correct += answer.correct ? 1 : 0;
      return acc;
    }, {});
    const result: ExamResult = {
      score,
      total: examQuestions.length,
      percent: Math.round((score / examQuestions.length) * 100),
      answers: examAnswers,
      categoryBreakdown,
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    };
    onComplete(result);
    sessionStorage.setItem('esthetics-last-exam-result', JSON.stringify(result));
    navigate('/results');
  };

  useEffect(() => {
    if (!startedAt) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          finishExam();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [answers, examQuestions, startedAt]);

  const startExam = () => {
    const option = examOptions.find((item) => item.count === selectedCount) ?? examOptions[0];
    setExamQuestions(shuffle(examReadyQuestions).slice(0, option.count));
    setAnswers({});
    setCurrentIndex(0);
    setSecondsLeft(option.minutes * 60);
    setStartedAt(Date.now());
  };

  if (!startedAt) {
    return (
      <div className="space-y-6 pb-24">
        <div>
          <p className="text-sm font-semibold text-peach-700">Timed mock exam</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-950">Choose your exam length</h1>
          <p className="mt-3 text-stone-600">Randomized exam-style practice questions with explanations after scoring.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {examOptions.map((option) => (
            <button
              type="button"
              key={option.count}
              onClick={() => setSelectedCount(option.count)}
              className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                selectedCount === option.count ? 'border-peach-500 bg-peach-50' : 'border-stone-100 bg-white'
              }`}
            >
              <FileCheck2 className="text-peach-700" size={24} />
              <h2 className="mt-4 text-xl font-bold text-stone-950">{option.count} questions</h2>
              <p className="mt-1 text-sm text-stone-600">{option.label}</p>
              <p className="mt-3 text-sm font-semibold text-peach-700">{option.minutes} minutes</p>
            </button>
          ))}
        </div>
        <button type="button" onClick={startExam} className="w-full rounded-xl bg-stone-950 px-5 py-4 font-bold text-white">
          Start {selectedOption.label}
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <p className="text-stone-600">Loading exam questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-peach-700">
              Question {currentIndex + 1} of {examQuestions.length}
            </p>
            <p className="mt-1 text-sm text-stone-500">{current.category}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm font-bold text-stone-800">
            <Clock size={16} />
            {formatTime(secondsLeft)}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-peach-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-peach-100 px-3 py-1 text-xs font-semibold text-peach-800">{current.difficulty}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">exam-style</span>
        </div>
        <h1 className="mt-5 text-2xl font-bold leading-tight text-stone-950">{current.question}</h1>
        <div className="mt-6 space-y-3">
          {currentChoices.map((choice) => {
            const checked = answers[current.id] === choice;
            return (
              <button
                type="button"
                key={choice}
                onClick={() => setAnswers((value) => ({ ...value, [current.id]: choice }))}
                className={`w-full rounded-xl border px-4 py-4 text-left font-medium transition ${
                  checked ? 'border-peach-500 bg-peach-50 text-stone-950' : 'border-stone-100 bg-stone-50 text-stone-700'
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
          disabled={currentIndex === 0}
          className="rounded-xl border border-stone-200 bg-white px-4 py-3 font-semibold text-stone-700 disabled:opacity-40"
        >
          Back
        </button>
        {currentIndex === examQuestions.length - 1 ? (
          <button type="button" onClick={finishExam} className="rounded-xl bg-peach-600 px-4 py-3 font-bold text-white">
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((value) => Math.min(examQuestions.length - 1, value + 1))}
            className="rounded-xl bg-stone-950 px-4 py-3 font-bold text-white"
          >
            Next
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={finishExam}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-stone-500"
      >
        <TimerReset size={17} />
        Finish early
      </button>
    </div>
  );
};

export default Exam;
