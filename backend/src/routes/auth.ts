import { Router, Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

const jwtSecret: Secret = process.env.JWT_SECRET || 'dev';
const jwtExpiryRaw: string = (process.env.JWT_EXPIRY as string) || '1h';
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh';
const refreshExpiryRaw: string = (process.env.REFRESH_TOKEN_EXPIRY as string) || '7d';

const parseExpiry = (input: string, fallbackSeconds: number): number => {
  const m = /^(\d+)([smhd])?$/.exec(input);
  if (!m) return fallbackSeconds;
  const num = Number(m[1]);
  const unit = m[2] || 's';
  if (unit === 's') return num;
  if (unit === 'm') return num * 60;
  if (unit === 'h') return num * 3600;
  if (unit === 'd') return num * 86400;
  return fallbackSeconds;
};

const jwtExpiry = parseExpiry(jwtExpiryRaw, 3600);
const refreshExpiry = parseExpiry(refreshExpiryRaw, 7 * 86400);

const signTokens = (userId: string) => {
  const accessOptions: SignOptions = { expiresIn: jwtExpiry };
  const refreshOptions: SignOptions = { expiresIn: refreshExpiry };
  const accessToken = jwt.sign({ sub: userId }, jwtSecret, accessOptions);
  const refreshToken = jwt.sign({ sub: userId }, refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
};

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const existed = await User.findOne({ email });
  if (existed) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = new User({ email, password, name });
  await user.save();
  const { accessToken, refreshToken } = signTokens(user.id);
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { accessToken, refreshToken } = signTokens(user.id);
  res.status(200).json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

router.post('/refresh', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }
  try {
    const payload = jwt.verify(token, refreshSecret) as { sub: string };
    const { accessToken, refreshToken } = signTokens(payload.sub);
    res.status(200).json({ accessToken, refreshToken });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
