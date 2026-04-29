import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BookOpen, ClipboardList, Home, LineChart, UserRound } from 'lucide-react';
import AdminQuestions from './pages/AdminQuestions';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Results from './pages/Results';
import Study from './pages/Study';
import { EstheticsQuestion, estheticsQuestionBank } from './data/estheticsQuestionBank';
import { AuthUser, progressApi, questionApi } from './utils/api';
import { ExamResult } from './utils/examTypes';
import {
  getDashboardStats,
  loadStudyState,
  recordCardAttempt,
  recordExamResult,
  saveStudyState,
  StudyState,
  toggleSavedQuestion,
} from './utils/studyProgress';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/study', label: 'Study', icon: BookOpen },
  { to: '/exam', label: 'Exam', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: LineChart },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

const loadUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem('esthetics-study-user');
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
};

const AppShell = ({ children, user }: { children: React.ReactNode; user: AuthUser | null }) => {
  const location = useLocation();
  const showNav = user && !['/', '/auth'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-cream text-stone-900">
      {showNav && (
        <header className="sticky top-0 z-20 border-b border-peach-100/80 bg-cream/90 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link to="/dashboard" className="font-black text-stone-950">
              Esthetics Study Pro
            </Link>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-peach-700 shadow-sm">exam-style practice</span>
          </div>
        </header>
      )}
      <main className={showNav ? 'mx-auto max-w-5xl px-4 py-5' : ''}>{children}</main>
      {showNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-peach-100 bg-white/95 px-2 pb-2 pt-2 shadow-[0_-10px_30px_rgba(68,52,44,0.08)] backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex min-h-[56px] flex-col items-center justify-center rounded-xl text-xs font-semibold ${
                    active ? 'bg-peach-100 text-peach-800' : 'text-stone-500'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(loadUser);
  const [questions, setQuestions] = useState<EstheticsQuestion[]>(() => {
    const custom = localStorage.getItem('esthetics-custom-question-bank');
    return custom ? (JSON.parse(custom) as EstheticsQuestion[]) : estheticsQuestionBank;
  });
  const [progress, setProgress] = useState<StudyState>(loadStudyState);
  const [lastResult, setLastResult] = useState<ExamResult | undefined>();
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    questionApi
      .all()
      .then((apiQuestions) => {
        if (apiQuestions.length >= 500) {
          setQuestions(apiQuestions);
          setNotice('');
        }
      })
      .catch(() => {
        setNotice('Using the built-in offline question bank until the API is available.');
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => getDashboardStats(questions, progress), [progress, questions]);

  const handleAuth = (nextUser: AuthUser, token: string) => {
    localStorage.setItem('esthetics-study-token', token);
    localStorage.setItem('esthetics-study-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('esthetics-study-token');
    localStorage.removeItem('esthetics-study-user');
    setUser(null);
  };

  const handleAttempt = (question: EstheticsQuestion, correct: boolean) => {
    const next = recordCardAttempt(progress, question, correct);
    setProgress(next);
    progressApi.saveProgress(next).catch(() => undefined);
  };

  const handleToggleSaved = (questionId: string) => {
    const next = toggleSavedQuestion(progress, questionId);
    setProgress(next);
    progressApi.saveProgress(next).catch(() => undefined);
  };

  const handleExamComplete = (result: ExamResult) => {
    const missedIds = result.answers.filter((answer) => !answer.correct).map((answer) => answer.question.id);
    const next = recordExamResult(
      progress,
      {
        score: result.score,
        total: result.total,
        percent: result.percent,
        categoryBreakdown: result.categoryBreakdown,
      },
      missedIds,
    );
    setLastResult(result);
    setProgress(next);
    progressApi.saveProgress(next).catch(() => undefined);
  };

  const handleQuestionsChange = (nextQuestions: EstheticsQuestion[]) => {
    setQuestions(nextQuestions);
  };

  const requireUser = (element: React.ReactNode) => (user ? element : <Navigate to="/auth" replace />);

  useEffect(() => {
    saveStudyState(progress);
  }, [progress]);

  return (
    <AppShell user={user}>
      {loading && (
        <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-stone-600 shadow-lg">
          Loading study bank...
        </div>
      )}
      {notice && user && (
        <div className="mx-auto mb-4 max-w-5xl rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div>
      )}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route path="/dashboard" element={requireUser(<Dashboard stats={stats} questions={questions} />)} />
        <Route
          path="/study"
          element={requireUser(
            <Study questions={questions} progress={progress} stats={stats} onAttempt={handleAttempt} onToggleSaved={handleToggleSaved} />,
          )}
        />
        <Route
          path="/study/:category"
          element={requireUser(
            <Study questions={questions} progress={progress} stats={stats} onAttempt={handleAttempt} onToggleSaved={handleToggleSaved} />,
          )}
        />
        <Route
          path="/smart-review"
          element={requireUser(
            <Study
              mode="smart"
              questions={questions}
              progress={progress}
              stats={stats}
              onAttempt={handleAttempt}
              onToggleSaved={handleToggleSaved}
            />,
          )}
        />
        <Route path="/exam" element={requireUser(<Exam questions={questions} onComplete={handleExamComplete} />)} />
        <Route path="/results" element={requireUser(<Results result={lastResult} />)} />
        <Route path="/progress" element={requireUser(<Progress stats={stats} progress={progress} />)} />
        <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />} />
        <Route path="/admin" element={requireUser(<AdminQuestions questions={questions} onQuestionsChange={handleQuestionsChange} />)} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
