
import type { NextApiRequest, NextApiResponse } from 'next'
const SAMPLE_PRICES = { AAPL: 172.45 + Math.round(Math.random()*100)/100, GOOGL: 2710.55 + Math.round(Math.random()*100)/100, MSFT:322.10 + Math.round(Math.random()*100)/100, TSLA:255.21 + Math.round(Math.random()*100)/100 }
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  res.status(200).json({ prices: SAMPLE_PRICES })
}
