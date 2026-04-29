import { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

const publicUser = (user: { id?: unknown; _id?: unknown; name: string; email: string; isAdmin: boolean }) => ({
  id: String(user.id ?? user._id),
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
});

router.post(
  '/register',
  [body('name').trim().isLength({ min: 1 }), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Name, valid email, and 6-character password are required' });
      return;
    }

    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      res.status(409).json({ error: 'An account already exists for this email' });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const isFirstUser = (await User.estimatedDocumentCount()) === 0;
    const user = await User.create({ name: req.body.name, email: req.body.email, passwordHash, isAdmin: isFirstUser });
    await UserProgress.create({ userId: user._id });
    const token = signToken({ id: String(user._id), email: user.email, isAdmin: user.isAdmin });
    res.status(201).json({ token, user: publicUser(user) });
  },
);

router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 1 })], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email: req.body.email });
  const valid = user ? await bcrypt.compare(req.body.password, user.passwordHash) : false;
  if (!user || !valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signToken({ id: String(user._id), email: user.email, isAdmin: user.isAdmin });
  res.json({ token, user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: publicUser(user) });
});

router.post('/logout', (_req, res) => {
  res.json({ ok: true });
});

export default router;
