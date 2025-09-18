
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const SAMPLE_PRICES = { AAPL: 172.45, GOOGL: 2710.55, MSFT:322.10, TSLA:255.21 }
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const raw = req.headers.cookie || ''
  const parsed = raw ? cookie.parse(raw) : {}
  const token = parsed.papertradex_token || (req.headers.authorization?req.headers.authorization.split(' ')[1]:null)
  let user = null
  if(token){
    try{ const payload:any = jwt.verify(token, JWT_SECRET); user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } }) }catch(e){ user = null }
  }
  if(!user){ user = await prisma.user.findFirst() }
  res.status(200).json({ user, prices: SAMPLE_PRICES })
}
