import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated' });
  res.status(200).json(user);
}
