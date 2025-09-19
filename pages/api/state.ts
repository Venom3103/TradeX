import type { NextApiRequest, NextApiResponse } from 'next'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const SAMPLE_PRICES = { AAPL: 172.45, GOOGL: 2710.55, MSFT: 322.10, TSLA: 255.21 }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.headers.cookie || ''
  const parsed = raw ? cookie.parse(raw) : {}
  const token = parsed.papertradex_token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null)

  let user = null

  if (token) {
    try {
      const payload: any = jwt.verify(token, JWT_SECRET)
      user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } })
    } catch (e) {
      user = null
    }
  }

  // Fallback if token invalid or user not found
  if (!user) {
    user = await prisma.user.findFirst()
  }

  // If still null, create a dummy object (never undefined)
  if (!user) {
    user = {
      id: 0,
      name: 'Demo User',
      email: 'demo@tradex.com',
    }
  }

  res.status(200).json({ user, prices: SAMPLE_PRICES })
}
