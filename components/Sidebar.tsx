'use client'

import Link from 'next/link'

export default function Sidebar() {
  const items = ['/', '/portfolio', '/trade', '/market', '/profile']
  const labels = ['Dashboard', 'Portfolio', 'Trade', 'Market', 'Profile']

  return (
    <aside className="hidden md:block w-60 pr-6">
      <div className="card p-6 h-full">
        <div className="text-xl font-bold mb-4">Menu</div>
        <nav className="flex flex-col gap-3">
          {items.map((p, i) => (
            <Link
              key={p}
              href={p}
              className="px-3 py-2 rounded hover:bg-white/5"
            >
              {labels[i]}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
