import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserProgress extends Document {
  userId: Types.ObjectId;
  totalCardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  dailyStreak: number;
  lastStudyDate?: string;
  studiedToday: number;
  missedQuestions: string[];
  savedQuestions: string[];
  cardProgress: Map<string, unknown>;
  examHistory: unknown[];
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    totalCardsStudied: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastStudyDate: String,
    studiedToday: { type: Number, default: 0 },
    missedQuestions: [{ type: String }],
    savedQuestions: [{ type: String }],
    cardProgress: { type: Map, of: Schema.Types.Mixed, default: {} },
    examHistory: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true, minimize: false },
);

export default mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
