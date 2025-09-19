// pages/api/trade.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

type TradeResponse = {
  message: string;
  balance?: number;
  holdings?: Record<string, number>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TradeResponse>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    // Get token
    const rawCookies = req.headers.cookie || '';
    const parsed = rawCookies ? cookie.parse(rawCookies) : {};
    const token =
      parsed.papertradex_token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    // Verify token and get user
    const payload: any = jwt.verify(token, JWT_SECRET);
    const dbUser = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!dbUser) return res.status(401).json({ message: 'User not found' });

    const { symbol, quantity, side, price } = req.body;
    if (!symbol || !quantity || !side || !price)
      return res.status(400).json({ message: 'All fields required' });

    const qty = Number(quantity);
    const p = Number(price);
    if (isNaN(qty) || isNaN(p) || qty <= 0 || p <= 0)
      return res.status(400).json({ message: 'Invalid quantity or price' });

    const holdings: Record<string, number> =
      typeof dbUser.holdings === 'string' ? JSON.parse(dbUser.holdings) : dbUser.holdings || {};
    let newBalance = dbUser.balance;

    if (side === 'buy') {
      if (newBalance < p * qty) return res.status(400).json({ message: 'Insufficient balance' });
      newBalance -= p * qty;
      holdings[symbol] = (holdings[symbol] || 0) + qty;
    } else if (side === 'sell') {
      if ((holdings[symbol] || 0) < qty) return res.status(400).json({ message: 'Not enough shares to sell' });
      newBalance += p * qty;
      holdings[symbol] -= qty;
    } else return res.status(400).json({ message: 'Invalid trade side' });

    await prisma.trade.create({
      data: { userId: dbUser.id, symbol, quantity: qty, side, price: p },
    });

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { balance: newBalance, holdings },
    });

    res.status(200).json({ message: 'Trade executed', balance: newBalance, holdings });
  } catch (err) {
    console.error('Trade API error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
