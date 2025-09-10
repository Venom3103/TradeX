
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method==='GET'){
    const users = await prisma.user.findMany()
    return res.status(200).json({ users })
  }
  const body = req.body || {}
  if(body.signup){
    const { email, name, password } = body
    if(!email) return res.status(400).json({ error: 'Missing email' })
    const exists = await prisma.user.findUnique({ where: { email } })
    if(exists) return res.status(400).json({ error: 'User exists' })
    const hash = password ? bcrypt.hashSync(password, 10) : null
    const user = await prisma.user.create({ data: { email, name: name||'Trader', password: hash, holdings: {} } })
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', cookie.serialize('papertradex_token', token, { path:'/', httpOnly:true }))
    return res.status(200).json({ ok:true })
  }
  if(body.login){
    const { email, password } = body
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = password ? bcrypt.compareSync(password, user.password||'') : true
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', cookie.serialize('papertradex_token', token, { path:'/', httpOnly:true }))
    return res.status(200).json({ ok:true })
  }
  if(body.name){
    // update first user for demo
    const u = await prisma.user.findFirst()
    if(!u) return res.status(404).json({ error: 'No user' })
    const updated = await prisma.user.update({ where: { id: u.id }, data: { name: body.name } })
    return res.status(200).json({ ok:true, profile: updated })
  }
  return res.status(400).json({ error: 'Invalid request' })
}
