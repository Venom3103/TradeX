import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwt';
import prisma from './prisma';

export async function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    const payload: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch (err) {
    return null;
  }
}
