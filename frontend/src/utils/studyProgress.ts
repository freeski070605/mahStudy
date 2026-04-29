import { EstheticsQuestion, categories } from '../data/estheticsQuestionBank';

export interface CardProgress {
  cardId: string;
  category: string;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  masteryLevel: number;
  nextReviewDate: string;
  lastReviewed?: string;
  saved?: boolean;
}

export interface ExamHistoryItem {
  id: string;
  date: string;
  score: number;
  total: number;
  percent: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

export interface StudyState {
  totalCardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  dailyStreak: number;
  lastStudyDate?: string;
  studiedToday: number;
  missedQuestions: string[];
  savedQuestions: string[];
  cardProgress: Record<string, CardProgress>;
  examHistory: ExamHistoryItem[];
}

export interface DashboardStats {
  readiness: number;
  studiedToday: number;
  dailyStreak: number;
  totalCardsStudied: number;
  accuracy: number;
  weakestCategories: Array<{ category: string; mastery: number }>;
  categoryMastery: Array<{ category: string; mastery: number; due: number; total: number }>;
}

const storageKey = 'esthetics-study-progress';
const oneDay = 24 * 60 * 60 * 1000;

export const emptyStudyState = (): StudyState => ({
  totalCardsStudied: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  dailyStreak: 0,
  studiedToday: 0,
  missedQuestions: [],
  savedQuestions: [],
  cardProgress: {},
  examHistory: [],
});

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const loadStudyState = (): StudyState => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return emptyStudyState();
    const parsed = JSON.parse(saved) as StudyState;
    return { ...emptyStudyState(), ...parsed };
  } catch {
    return emptyStudyState();
  }
};

export const saveStudyState = (state: StudyState) => {
  localStorage.setItem(storageKey, JSON.stringify(state));
};

const addDays = (days: number) => new Date(Date.now() + days * oneDay).toISOString();

const updateStreak = (state: StudyState) => {
  const today = todayKey();
  if (state.lastStudyDate === today) {
    return { dailyStreak: state.dailyStreak || 1, studiedToday: state.studiedToday + 1, lastStudyDate: today };
  }

  const yesterday = new Date(Date.now() - oneDay).toISOString().slice(0, 10);
  return {
    dailyStreak: state.lastStudyDate === yesterday ? state.dailyStreak + 1 : 1,
    studiedToday: 1,
    lastStudyDate: today,
  };
};

export const recordCardAttempt = (state: StudyState, question: EstheticsQuestion, correct: boolean): StudyState => {
  const previous = state.cardProgress[question.id] ?? {
    cardId: question.id,
    category: question.category,
    timesSeen: 0,
    timesCorrect: 0,
    timesWrong: 0,
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString(),
  };

  const masteryLevel = Math.max(0, Math.min(5, previous.masteryLevel + (correct ? 1 : -1)));
  const delayDays = correct ? [1, 2, 4, 7, 14, 30][masteryLevel] : masteryLevel === 0 ? 0.02 : 0.25;
  const nextProgress: CardProgress = {
    ...previous,
    timesSeen: previous.timesSeen + 1,
    timesCorrect: previous.timesCorrect + (correct ? 1 : 0),
    timesWrong: previous.timesWrong + (correct ? 0 : 1),
    masteryLevel,
    nextReviewDate: addDays(delayDays),
    lastReviewed: new Date().toISOString(),
  };

  const streak = updateStreak(state);
  const missedSet = new Set(state.missedQuestions);
  if (correct) {
    missedSet.delete(question.id);
  } else {
    missedSet.add(question.id);
  }

  const nextState: StudyState = {
    ...state,
    ...streak,
    totalCardsStudied: state.totalCardsStudied + 1,
    correctAnswers: state.correctAnswers + (correct ? 1 : 0),
    incorrectAnswers: state.incorrectAnswers + (correct ? 0 : 1),
    missedQuestions: Array.from(missedSet),
    cardProgress: { ...state.cardProgress, [question.id]: nextProgress },
  };
  saveStudyState(nextState);
  return nextState;
};

export const toggleSavedQuestion = (state: StudyState, questionId: string): StudyState => {
  const saved = new Set(state.savedQuestions);
  if (saved.has(questionId)) saved.delete(questionId);
  else saved.add(questionId);
  const nextState = { ...state, savedQuestions: Array.from(saved) };
  saveStudyState(nextState);
  return nextState;
};

export const isDue = (progress?: CardProgress) => !progress || new Date(progress.nextReviewDate).getTime() <= Date.now();

export const dueQuestions = (questions: EstheticsQuestion[], state: StudyState, limit = 30) =>
  questions
    .filter((question) => isDue(state.cardProgress[question.id]))
    .sort((a, b) => {
      const progressA = state.cardProgress[a.id];
      const progressB = state.cardProgress[b.id];
      return (progressA?.masteryLevel ?? 0) - (progressB?.masteryLevel ?? 0);
    })
    .slice(0, limit);

export const getDashboardStats = (questions: EstheticsQuestion[], state: StudyState): DashboardStats => {
  const categoryMastery = categories.map((category) => {
    const categoryQuestions = questions.filter((question) => question.category === category);
    const progressItems = categoryQuestions.map((question) => state.cardProgress[question.id]).filter(Boolean);
    const mastery =
      progressItems.length === 0
        ? 0
        : Math.round(
            (progressItems.reduce((sum, progress) => sum + progress.masteryLevel, 0) / (progressItems.length * 5)) * 100,
          );
    const due = categoryQuestions.filter((question) => isDue(state.cardProgress[question.id])).length;
    return { category, mastery, due, total: categoryQuestions.length };
  });

  const masteredPoints = Object.values(state.cardProgress).reduce((sum, progress) => sum + progress.masteryLevel, 0);
  const readiness = questions.length ? Math.round((masteredPoints / (questions.length * 5)) * 100) : 0;
  const answered = state.correctAnswers + state.incorrectAnswers;

  return {
    readiness,
    studiedToday: state.lastStudyDate === todayKey() ? state.studiedToday : 0,
    dailyStreak: state.dailyStreak,
    totalCardsStudied: state.totalCardsStudied,
    accuracy: answered ? Math.round((state.correctAnswers / answered) * 100) : 0,
    weakestCategories: [...categoryMastery].sort((a, b) => a.mastery - b.mastery).slice(0, 4),
    categoryMastery,
  };
};

export const recordExamResult = (
  state: StudyState,
  result: Omit<ExamHistoryItem, 'id' | 'date'>,
  missedIds: string[],
): StudyState => {
  const missed = new Set([...state.missedQuestions, ...missedIds]);
  const nextState: StudyState = {
    ...state,
    missedQuestions: Array.from(missed),
    examHistory: [
      {
        ...result,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      },
      ...state.examHistory,
    ].slice(0, 20),
  };
  saveStudyState(nextState);
  return nextState;
};

export const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
