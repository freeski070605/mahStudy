import { ArrowRight, BookOpenCheck } from 'lucide-react';

interface CategoryCardProps {
  category: string;
  total: number;
  due: number;
  mastery: number;
  onClick: () => void;
}

const CategoryCard = ({ category, total, due, mastery, onClick }: CategoryCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-xl border border-peach-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-peach-400"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-peach-100 text-peach-700">
          <BookOpenCheck size={21} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-stone-900">{category}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {due} due now · {total} cards
          </p>
        </div>
      </div>
      <ArrowRight className="mt-1 shrink-0 text-stone-400" size={20} aria-hidden="true" />
    </div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
      <div className="h-full rounded-full bg-peach-500 transition-all" style={{ width: `${mastery}%` }} />
    </div>
    <div className="mt-2 text-xs font-medium text-stone-500">{mastery}% mastery</div>
  </button>
);

export default CategoryCard;
