
'use client'
import useSWR from 'swr'
import Layout from '../components/Layout'
const fetcher = (url:string)=>fetch(url).then(r=>r.json())
export default function PortfolioPage(){
  const { data } = useSWR('/api/state', fetcher)
  const user = data?.user || { holdings:{} }
  return (
    <Layout>
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-3">Portfolio</h1>
        {Object.entries(user.holdings||{}).length===0 && <div className="small">No holdings</div>}
        {Object.entries(user.holdings||{}).map(([s,q])=>(
          <div key={s} className="flex justify-between py-2 border-b border-white/3">
            <div>{s}</div><div>{q} shares</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
