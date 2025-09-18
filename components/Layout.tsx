'use client'
import Sidebar from './Sidebar'
export default function Layout({children}:{children:React.ReactNode}){return (<div className="min-h-screen flex container gap-6"><Sidebar /><main className="flex-1">{children}</main></div>)}
