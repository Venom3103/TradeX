// pages/api/state.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

type UserType = {
  id: number;
  name: string;
  email: string;
  balance: number;
  holdings: Record<string, number>;
};

type PricesType = Record<string, number>;

const SAMPLE_PRICES: PricesType = {
  AAPL: 172.45,
  GOOGL: 2710.55,
  MSFT: 322.1,
  TSLA: 255.21,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: UserType; prices: PricesType } | { error: string }>
) {
  try {
    const rawCookies = req.headers.cookie || '';
    const parsed = rawCookies ? cookie.parse(rawCookies) : {};
    const token =
      parsed.papertradex_token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    let user: UserType | null = null;

    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      const dbUser = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
      if (dbUser) {
        user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          balance: dbUser.balance,
          holdings: (typeof dbUser.holdings === 'string' ? JSON.parse(dbUser.holdings) : dbUser.holdings) || {},
        };
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!user) return res.status(401).json({ error: 'User not found' });

    res.status(200).json({ user, prices: SAMPLE_PRICES });
  } catch (err) {
    console.error('API /state error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
