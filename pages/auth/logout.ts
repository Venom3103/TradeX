// /pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    maxAge: -1,
    path: '/',
  }));

  res.status(200).json({ message: 'Logged out successfully' });
}
