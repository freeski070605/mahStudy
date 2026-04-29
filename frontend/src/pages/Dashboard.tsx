import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Target } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import { EstheticsQuestion } from '../data/estheticsQuestionBank';
import { DashboardStats } from '../utils/studyProgress';

interface DashboardProps {
  stats: DashboardStats;
  questions: EstheticsQuestion[];
}

const Dashboard = ({ stats, questions }: DashboardProps) => {
  const navigate = useNavigate();
  const totalDue = stats.categoryMastery.reduce((sum, item) => sum + item.due, 0);

  return (
    <div className="space-y-6 pb-24">
      <section className="rounded-2xl bg-gradient-to-br from-white to-peach-50 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-peach-700">You’re getting closer to licensed.</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-950">Today’s goal: 20 cards</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {totalDue} cards are ready for review from {questions.length} exam-style practice items.
            </p>
          </div>
          <ProgressRing value={stats.readiness} />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white p-3 text-center">
            <Flame className="mx-auto text-peach-600" size={20} />
            <div className="mt-1 text-xl font-bold">{stats.dailyStreak}</div>
            <div className="text-xs text-stone-500">day streak</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center">
            <Sparkles className="mx-auto text-peach-600" size={20} />
            <div className="mt-1 text-xl font-bold">{stats.studiedToday}</div>
            <div className="text-xs text-stone-500">today</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center">
            <Target className="mx-auto text-peach-600" size={20} />
            <div className="mt-1 text-xl font-bold">{stats.accuracy}%</div>
            <div className="text-xs text-stone-500">accuracy</div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate('/smart-review')}
          className="rounded-2xl bg-stone-950 p-5 text-left text-white shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Continue studying</span>
            <ArrowRight size={22} />
          </div>
          <p className="mt-2 text-sm text-stone-300">Review your weak spots with spaced repetition.</p>
        </button>
        <button
          type="button"
          onClick={() => navigate('/exam')}
          className="rounded-2xl bg-peach-600 p-5 text-left text-white shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Mock exam ready?</span>
            <ArrowRight size={22} />
          </div>
          <p className="mt-2 text-sm text-peach-50">Take 25, 50, or 100 randomized questions.</p>
        </button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-950">Weakest categories</h2>
          <Link to="/study" className="text-sm font-semibold text-peach-700">
            Study all
          </Link>
        </div>
        <div className="space-y-3">
          {stats.weakestCategories.map((item) => (
            <button
              type="button"
              key={item.category}
              onClick={() => navigate(`/study/${encodeURIComponent(item.category)}`)}
              className="w-full rounded-xl border border-stone-100 bg-white p-4 text-left shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-stone-900">{item.category}</span>
                <span className="text-sm text-stone-500">{item.mastery}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-peach-500" style={{ width: `${item.mastery}%` }} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
