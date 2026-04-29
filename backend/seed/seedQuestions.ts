import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../src/models/Question.js';
import { estheticsQuestionBank, questionBankStats } from './estheticsQuestionBank.ts';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esthetics-study';

const seedQuestions = async () => {
  await mongoose.connect(MONGODB_URI);
  const operations = estheticsQuestionBank.map((question) => ({
    updateOne: {
      filter: { questionId: question.id },
      update: {
        $set: {
          questionId: question.id,
          type: question.type,
          category: question.category,
          difficulty: question.difficulty,
          question: question.question,
          answer: question.answer,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          tags: question.tags,
        },
      },
      upsert: true,
    },
  }));

  await Question.bulkWrite(operations, { ordered: false });
  const count = await Question.countDocuments();
  console.log(`Seeded ${questionBankStats.total} Esthetics Study Pro questions. Database now has ${count} questions.`);
  await mongoose.disconnect();
};

seedQuestions().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
