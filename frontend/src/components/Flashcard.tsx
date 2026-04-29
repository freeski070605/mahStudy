import { Bookmark, BookmarkCheck, RotateCcw } from 'lucide-react';
import { EstheticsQuestion } from '../data/estheticsQuestionBank';

interface FlashcardProps {
  question: EstheticsQuestion;
  flipped: boolean;
  saved: boolean;
  onFlip: () => void;
  onMark: (correct: boolean) => void;
  onSave: () => void;
}

const difficultyTone: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-rose-50 text-rose-700',
};

const Flashcard = ({ question, flipped, saved, onFlip, onMark, onSave }: FlashcardProps) => (
  <section className="space-y-4">
    <button
      type="button"
      onClick={onFlip}
      className="min-h-[360px] w-full rounded-2xl border border-peach-100 bg-white p-5 text-left shadow-lg shadow-peach-100/60 transition duration-300 [perspective:1000px] focus:outline-none focus:ring-2 focus:ring-peach-400 sm:min-h-[420px]"
    >
      <div className={`flex h-full flex-col transition duration-300 ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className={`${flipped ? 'hidden' : 'flex'} h-full flex-col`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-peach-100 px-3 py-1 text-xs font-semibold text-peach-800">
                {question.type.replace('_', ' ')}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyTone[question.difficulty]}`}>
                {question.difficulty}
              </span>
            </div>
            <RotateCcw className="text-stone-400" size={18} aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-stone-400">{question.category}</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-950">{question.question}</h2>
          {question.type !== 'flashcard' && (
            <div className="mt-6 space-y-2">
              {question.choices.map((choice) => (
                <div key={choice} className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                  {choice}
                </div>
              ))}
            </div>
          )}
          <p className="mt-auto pt-8 text-center text-sm font-medium text-stone-400">Tap to reveal answer</p>
        </div>

        <div className={`${flipped ? 'flex [transform:rotateY(180deg)]' : 'hidden'} h-full flex-col`}>
          <p className="text-sm font-medium uppercase tracking-wide text-peach-700">Answer</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-950">{question.answer}</h2>
          <p className="mt-5 rounded-xl bg-peach-50 p-4 text-base leading-relaxed text-stone-700">{question.explanation}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-auto pt-8 text-center text-sm font-medium text-stone-400">Mark how you did</p>
        </div>
      </div>
    </button>

    <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
      <button
        type="button"
        onClick={() => onMark(false)}
        className="rounded-xl border border-rose-100 bg-white px-4 py-3 font-semibold text-rose-700 shadow-sm"
      >
        Missed it
      </button>
      <button
        type="button"
        onClick={() => onMark(true)}
        className="rounded-xl bg-peach-600 px-4 py-3 font-semibold text-white shadow-sm shadow-peach-200"
      >
        Got it
      </button>
      <button
        type="button"
        onClick={onSave}
        aria-label={saved ? 'Remove saved question' : 'Save question'}
        className="grid h-12 w-12 place-items-center rounded-xl border border-peach-100 bg-white text-peach-700 shadow-sm"
      >
        {saved ? <BookmarkCheck size={21} /> : <Bookmark size={21} />}
      </button>
    </div>
  </section>
);

export default Flashcard;
