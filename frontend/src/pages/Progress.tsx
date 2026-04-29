import ProgressRing from '../components/ProgressRing';
import { DashboardStats, StudyState } from '../utils/studyProgress';

interface ProgressProps {
  stats: DashboardStats;
  progress: StudyState;
}

const Progress = ({ stats, progress }: ProgressProps) => (
  <div className="space-y-6 pb-24">
    <div>
      <p className="text-sm font-semibold text-peach-700">Progress</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-950">Your readiness profile</h1>
    </div>
    <section className="grid gap-3 sm:grid-cols-[auto_1fr]">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <ProgressRing value={stats.readiness} label="ready" size={144} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Cards studied</p>
          <p className="mt-2 text-3xl font-bold text-stone-950">{progress.totalCardsStudied}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Correct</p>
          <p className="mt-2 text-3xl font-bold text-stone-950">{progress.correctAnswers}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Missed</p>
          <p className="mt-2 text-3xl font-bold text-stone-950">{progress.incorrectAnswers}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Saved</p>
          <p className="mt-2 text-3xl font-bold text-stone-950">{progress.savedQuestions.length}</p>
        </div>
      </div>
    </section>

    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-stone-950">Category mastery</h2>
      <div className="mt-4 space-y-3">
        {stats.categoryMastery.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-semibold text-stone-800">{item.category}</span>
              <span className="text-stone-500">{item.mastery}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-peach-500" style={{ width: `${item.mastery}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Progress;
