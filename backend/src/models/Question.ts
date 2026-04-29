import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'flashcard' | 'multiple_choice' | 'scenario';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface IQuestion extends Document {
  questionId: string;
  type: QuestionType;
  category: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

const questionSchema = new Schema<IQuestion>(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['flashcard', 'multiple_choice', 'scenario'], required: true },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

questionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const record = ret as unknown as Record<string, unknown>;
    record.id = record.questionId;
    delete record.questionId;
    delete record._id;
    delete record.__v;
    return ret;
  },
});

export default mongoose.model<IQuestion>('Question', questionSchema);
