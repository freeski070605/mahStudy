import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Flashcard from '../components/Flashcard';
import { EstheticsQuestion } from '../data/estheticsQuestionBank';
import { DashboardStats, StudyState, dueQuestions } from '../utils/studyProgress';

interface StudyProps {
  mode?: 'category' | 'smart';
  questions: EstheticsQuestion[];
  progress: StudyState;
  stats: DashboardStats;
  onAttempt: (question: EstheticsQuestion, correct: boolean) => void;
  onToggleSaved: (questionId: string) => void;
}

const Study = ({ mode = 'category', questions, progress, stats, onAttempt, onToggleSaved }: StudyProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const selectedCategory = params.category ? decodeURIComponent(params.category) : undefined;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    if (mode === 'smart') return dueQuestions(questions, progress, 60);
    if (selectedCategory) {
      return questions.filter((question) => question.category === selectedCategory);
    }
    return [];
  }, [mode, progress, questions, selectedCategory]);

  const current = deck[index % Math.max(deck.length, 1)];

  const handleMark = (correct: boolean) => {
    if (!current) return;
    onAttempt(current, correct);
    setFlipped(false);
    setIndex((value) => value + 1);
  };

  if (!selectedCategory && mode !== 'smart') {
    return (
      <div className="space-y-5 pb-24">
        <div>
          <p className="text-sm font-semibold text-peach-700">Category study</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-950">Choose a focus area</h1>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.categoryMastery.map((item) => (
            <CategoryCard
              key={item.category}
              category={item.category}
              total={item.total}
              due={item.due}
              mastery={item.mastery}
              onClick={() => navigate(`/study/${encodeURIComponent(item.category)}`)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="grid min-h-[65vh] place-items-center pb-24 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-950">Nothing due right now</h1>
          <p className="mt-2 text-stone-600">Your smart review queue is clear. A mock exam is a good next move.</p>
          <button
            type="button"
            onClick={() => navigate('/exam')}
            className="mt-5 rounded-xl bg-peach-600 px-5 py-3 font-semibold text-white"
          >
            Take mock exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-peach-700">{mode === 'smart' ? 'Smart review' : selectedCategory}</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-950">
            Card {(index % deck.length) + 1} of {deck.length}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/study')}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
        >
          Categories
        </button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-peach-500" style={{ width: `${(((index % deck.length) + 1) / deck.length) * 100}%` }} />
      </div>
      <Flashcard
        question={current}
        flipped={flipped}
        saved={progress.savedQuestions.includes(current.id)}
        onFlip={() => setFlipped((value) => !value)}
        onMark={handleMark}
        onSave={() => onToggleSaved(current.id)}
      />
    </div>
  );
};

export default Study;
