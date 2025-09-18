// /pages/api/trade.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });

  const { symbol, quantity, side, price } = req.body;
  if (!symbol || !quantity || !side || !price) return res.status(400).json({ message: 'All fields required' });

  const holdings = user.holdings || {};
  let newBalance = user.balance;

  if (side === 'buy') {
    if (user.balance < price * quantity) return res.status(400).json({ message: 'Insufficient balance' });
    newBalance -= price * quantity;
    holdings[symbol] = (holdings[symbol] || 0) + quantity;
  } else if (side === 'sell') {
    if ((holdings[symbol] || 0) < quantity) return res.status(400).json({ message: 'Not enough shares to sell' });
    newBalance += price * quantity;
    holdings[symbol] -= quantity;
  } else return res.status(400).json({ message: 'Invalid trade side' });

  await prisma.trade.create({ data: { userId: user.id, symbol, quantity, side, price } });
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance, holdings } });

  return res.status(200).json({ message: 'Trade executed', balance: newBalance, holdings });
}
