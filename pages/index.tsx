
'use client'
import useSWR from 'swr'
import Layout from '../components/Layout'
import Header from '../components/Header'
import PortfolioChart from '../components/PortfolioChart'
import TradePanel from '../components/TradePanel'
const fetcher = (url:string)=>fetch(url).then(r=>r.json())
export default function Home(){
  const { data, mutate } = useSWR('/api/state', fetcher)
  if(!data) return <Layout><div className="card p-6">Loading...</div></Layout>
  const user = data.user || { name:'Guest', balance:0, holdings:{} }
  const prices = data.prices || {}
  return (
    <Layout>
      <Header name={user.name} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="small">Balance</div>
                <div className="big">${(user.balance||0).toLocaleString()}</div>
              </div>
              <div className="small">Net P&L <div className="text-green-400 font-semibold">+2.3%</div></div>
            </div>
            <div className="mt-4"><PortfolioChart /></div>
          </div>
          <div className="card p-4">
            <div className="small mb-2">Recommendations</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3"><div className="font-semibold">AAPL</div><div className="small text-green-400">+1.9%</div></div>
              <div className="card p-3"><div className="font-semibold">GOOGL</div><div className="small text-red-400">-0.2%</div></div>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <TradePanel onTrade={()=>mutate()} />
          <div className="card p-4">
            <div className="small mb-2">Portfolio</div>
            {Object.keys(user.holdings||{}).length===0 && <div className="small">No holdings</div>}
            {Object.entries(user.holdings||{}).map(([sym,qty])=>(
              <div key={sym} className="flex justify-between py-2">
                <div>{sym}</div>
                <div>${((prices as any)[sym]||100).toLocaleString()} · <span className="font-semibold">{qty} shares</span></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Layout>
  )
}
