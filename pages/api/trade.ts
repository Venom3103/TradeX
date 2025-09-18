
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({ error:'Method not allowed' })
  const auth = req.headers.authorization || ''
  const token = auth.split(' ')[1] || null
  if(!token) return res.status(401).json({ error:'Unauthorized' })
  let userId = null
  try{ const payload:any = jwt.verify(token, JWT_SECRET); userId = Number(payload.sub) }catch(e){ return res.status(401).json({ error:'Invalid token' }) }
  const { symbol, qty } = req.body || {}
  if(!symbol || !qty) return res.status(400).json({ error:'Missing symbol or qty' })
  const price = 100 // in real app fetch from market
  const trade = await prisma.trade.create({ data: { symbol, quantity: Number(qty), price, side: 'buy', userId } })
  // update user holdings (JSON)
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if(!user) return res.status(404).json({ error:'User not found' })
  const holdings = (user.holdings as any) || {}
  holdings[symbol] = (holdings[symbol]||0) + Number(qty)
  const updated = await prisma.user.update({ where: { id: userId }, data: { holdings, balance: (user.balance||0) - Number(qty)*price } })
  res.status(200).json({ ok:true, trade, user: updated })
}
