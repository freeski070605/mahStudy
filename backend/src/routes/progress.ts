import { Router } from 'express';
import UserProgress from '../models/UserProgress.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const emptyProgress = () => ({
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

router.use(requireAuth);

router.get('/', async (req, res) => {
  const progress = await UserProgress.findOneAndUpdate(
    { userId: req.user?.id },
    { $setOnInsert: { userId: req.user?.id, ...emptyProgress() } },
    { upsert: true, new: true },
  ).lean();
  res.json({ progress });
});

router.put('/', async (req, res) => {
  const allowed = {
    ...emptyProgress(),
    ...req.body,
    userId: req.user?.id,
  };
  const progress = await UserProgress.findOneAndUpdate({ userId: req.user?.id }, allowed, { upsert: true, new: true });
  res.json({ progress });
});

router.get('/dashboard', async (req, res) => {
  const progress = await UserProgress.findOne({ userId: req.user?.id }).lean();
  res.json({ progress: progress ?? emptyProgress() });
});

router.get('/weak-categories', async (req, res) => {
  const progress = await UserProgress.findOne({ userId: req.user?.id }).lean();
  res.json({ missedQuestions: progress?.missedQuestions ?? [] });
});

router.get('/streak', async (req, res) => {
  const progress = await UserProgress.findOne({ userId: req.user?.id }).lean();
  res.json({ dailyStreak: progress?.dailyStreak ?? 0, lastStudyDate: progress?.lastStudyDate });
});

router.post('/card/:cardId', async (req, res) => {
  const progress = await UserProgress.findOneAndUpdate(
    { userId: req.user?.id },
    {
      $set: {
        [`cardProgress.${req.params.cardId}`]: req.body,
      },
    },
    { upsert: true, new: true },
  );
  res.json({ progress });
});

router.post('/exam-result', async (req, res) => {
  const progress = await UserProgress.findOneAndUpdate(
    { userId: req.user?.id },
    { $push: { examHistory: { $each: [req.body], $position: 0, $slice: 20 } } },
    { upsert: true, new: true },
  );
  res.json({ progress });
});

export default router;
