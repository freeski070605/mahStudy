import { EstheticsQuestion } from '../data/estheticsQuestionBank';

export interface ExamAnswer {
  question: EstheticsQuestion;
  selected?: string;
  correct: boolean;
}

export interface ExamResult {
  score: number;
  total: number;
  percent: number;
  answers: ExamAnswer[];
  categoryBreakdown: Record<string, { correct: number; total: number }>;
  durationSeconds: number;
}
