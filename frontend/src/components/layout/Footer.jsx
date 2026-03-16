import { Link } from 'react-router-dom'
import { useState } from 'react'
import { categories } from '../../data/products'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <footer className="bg-bg border-t border-border pt-12 sm:pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-10 sm:pb-14 border-b border-border">

          {/* Brand — full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-disp text-3xl tracking-[.08em] text-ink block mb-3">
              BLACK<span className="text-lime"> FISH</span>
            </Link>
            <p className="font-mono text-[10px] leading-[1.85] text-muted max-w-[260px]">
              Nepal's trendy clothing store. Top quality fits, fast delivery to every district across Nepal.
            </p>
            {/* Social links on mobile sit under brand */}
            <div className="flex gap-5 mt-5">
              {['Instagram', 'Facebook', 'TikTok'].map(s => (
                <a key={s} href="#"
                  className="font-mono text-[8px] tracking-[.15em] uppercase text-muted hover:text-lime transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-4">/ Shop</p>
            <ul className="space-y-2.5">
              {categories.filter(c => c !== 'All').map(c => (
                <li key={c}>
                  <Link to={`/shop?category=${encodeURIComponent(c)}`}
                    className="font-mono text-[11px] tracking-[.06em] text-[rgba(236,236,236,.4)] hover:text-lime transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-4">/ Help</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Contact Us',    to: '/contact' },
                { label: 'Size Guide',    to: '#' },
                { label: 'Return Policy', to: '#' },
                { label: 'Shipping Info', to: '#' },
                { label: 'Track Order',   to: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="font-mono text-[11px] tracking-[.06em] text-[rgba(236,236,236,.4)] hover:text-lime transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter — full width on sm, normal on lg */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-4">/ Stay Updated</p>
            <p className="font-mono text-[11px] text-muted mb-4 leading-[1.75] max-w-[300px]">
              Get new drops before everyone else. No spam, just the good stuff.
            </p>
            {joined ? (
              <p className="font-mono text-[9px] text-lime tracking-[.1em]">✓ YOU'RE IN. DROPS INCOMING.</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (email) setJoined(true) }}
                className="flex border-b border-border2 max-w-[340px]">
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent font-mono text-[11px] text-ink placeholder:text-muted py-2.5 focus:outline-none min-w-0" />
                <button type="submit"
                  className="font-mono text-[8px] tracking-[.2em] uppercase text-lime py-2.5 pl-4 whitespace-nowrap hover:tracking-[.3em] transition-all">
                  JOIN →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 sm:pt-8">
          <p className="font-mono text-[9px] text-[rgba(236,236,236,.2)] tracking-[.1em]">
            © 2025 BLACK FISH NEPAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap gap-2">
            {['eSewa', 'Khalti', 'COD', 'Bank Transfer'].map(p => (
              <span key={p} className="font-mono text-[8px] tracking-[.08em] border border-border text-muted px-2.5 py-1">
                {p}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}