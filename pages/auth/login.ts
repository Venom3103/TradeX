// /pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password || '');
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ userId: user.id });

  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    path: '/',
    sameSite: 'strict',
  }));

  res.status(200).json({ message: 'Logged in successfully', userId: user.id });
}
