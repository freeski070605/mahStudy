import { Router } from 'express';
import Question from '../models/Question.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

const normalizeQuestion = (body: Record<string, unknown>) => ({
  questionId: String(body.id ?? body.questionId),
  type: body.type,
  category: body.category,
  difficulty: body.difficulty,
  question: body.question,
  answer: body.answer,
  choices: body.choices,
  correctAnswer: body.correctAnswer ?? body.answer,
  explanation: body.explanation,
  tags: body.tags ?? [],
});

const toClient = (question: { [key: string]: unknown }) => ({
  id: question.questionId,
  type: question.type,
  category: question.category,
  difficulty: question.difficulty,
  question: question.question,
  answer: question.answer,
  choices: question.choices,
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  tags: question.tags,
});

router.get('/', async (req, res) => {
  const { category, difficulty, type } = req.query;
  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (type) filter.type = type;
  const questions = await Question.find(filter).sort({ category: 1, questionId: 1 }).lean();
  res.json({ questions: questions.map(toClient) });
});

router.get('/category/:category', async (req, res) => {
  const questions = await Question.find({ category: req.params.category }).sort({ questionId: 1 }).lean();
  res.json({ questions: questions.map(toClient) });
});

router.get('/random/:count', async (req, res) => {
  const count = Math.min(100, Math.max(1, Number(req.params.count) || 25));
  const questions = await Question.aggregate([{ $match: { type: { $ne: 'flashcard' } } }, { $sample: { size: count } }]);
  res.json({ questions: questions.map(toClient) });
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const question = await Question.create(normalizeQuestion(req.body));
  res.status(201).json({ question: question.toJSON() });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const question = await Question.findOneAndUpdate({ questionId: req.params.id }, normalizeQuestion({ ...req.body, id: req.params.id }), {
    new: true,
    runValidators: true,
  });
  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json({ question: question.toJSON() });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const deleted = await Question.findOneAndDelete({ questionId: req.params.id });
  if (!deleted) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json({ ok: true });
});

export default router;
