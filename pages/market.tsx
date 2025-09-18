'use client'
import useSWR from 'swr'
import Layout from '../components/Layout'
const fetcher = (url:string)=>fetch(url).then(r=>r.json())
export default function MarketPage(){ const { data } = useSWR('/api/market', fetcher); const prices = data?.prices || {}; return (<Layout><div className="card p-6"><h1 className="text-2xl font-bold mb-3">Market</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Object.entries(prices).map(([s,p])=>(<div key={s} className="card p-3"><div className="font-semibold">{s}</div><div className="small">${(p as number).toLocaleString()}</div></div>))}</div></div></Layout>) }
