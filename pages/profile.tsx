'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Layout from '../components/Layout'
const fetcher = (url:string)=>fetch(url).then(r=>r.json())
export default function ProfilePage(){ const { data, mutate } = useSWR('/api/state', fetcher); const user = data?.user || { name:'Guest', email:'' }; const [name,setName]=useState(user.name||''); async function save(){ await fetch('/api/profile', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) }); mutate() } return (<Layout><div className="card p-6 max-w-md"><h1 className="text-2xl font-bold mb-3">Profile</h1><div className="mb-3 small">Name</div><input className="input mb-3" value={name} onChange={e=>setName(e.target.value)} /><button className="btn" onClick={save}>Save</button></div></Layout>) }
