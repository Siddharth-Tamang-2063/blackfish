import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useScrollLock } from '../../hooks'
import { products } from '../../data/products'
import logo from '../../assets/logoblackfish.jpeg'

const links = [
  { label: 'HOME',    to: '/' },
  { label: 'MENS',    to: '/shop?category=Mens' },
  { label: 'WOMENS',  to: '/shop?category=Womens' },
  { label: 'CONTACT', to: '/contact' },
]

const announceItems = [
  'Free Delivery All Over Nepal', '·', 'Cash on Delivery Available', '·',
  '7-Day Easy Returns', '·', 'Black Fish — Nepal\'s Trendy Store', '·',
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [drawer, setDrawer]       = useState(false)
  const [search, setSearch]       = useState(false)
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const { itemCount }             = useCart()
  const { count: wishCount }      = useWishlist()
  const { lock, unlock }          = useScrollLock()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { drawer ? lock() : unlock() }, [drawer, lock, unlock])
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { setSearch(false); setDrawer(false) } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleSearch = (q) => {
    setQuery(q)
    setResults(!q.trim() ? [] : products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5))
  }

  const location = useLocation()

  const isLinkActive = (to) => {
    const [path, search] = to.split('?')
    if (path !== location.pathname) return false
    if (!search) return location.search === ''
    return location.search === '?' + search
  }

  const doubled = [...announceItems, ...announceItems, ...announceItems, ...announceItems]

  return (
    <>
      {/* Announce */}
      <div className="h-8 bg-lime overflow-hidden flex items-center pause-on-hover">
        <div className="animate-marquee flex whitespace-nowrap">
          {doubled.map((t, i) => (
            <span key={i} className="font-mono text-[10px] font-medium text-black tracking-[.15em] uppercase px-8">{t}</span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className={`sticky top-0 z-50 h-[60px] flex items-center bg-bg border-b border-border transition-all duration-300 ${scrolled ? 'shadow-[0_1px_0_rgba(186,255,41,.1)]' : ''}`}>
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden   flex-shrink-0">
              <img src={logo} alt="Black Fish" className="w-full h-full object-cover" />
            </div>
            <span className="font-disp text-[28px] tracking-[.1em] text-ink">
              BLACK<span className="text-lime"> FISH</span>
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`font-mono text-[11px] tracking-[.22em] uppercase transition-colors relative group
                  ${isLinkActive(l.to) ? 'text-ink' : 'text-muted hover:text-ink'}`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-lime transition-all duration-300 ${isLinkActive(l.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <button onClick={() => setSearch(!search)} className="hidden lg:block text-muted hover:text-lime transition-colors">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </button>
            {/* Wishlist — desktop only */}
            <Link to="/shop" className="hidden lg:block relative text-muted hover:text-lime transition-colors">
              {wishCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime text-black text-[8px] font-bold flex items-center justify-center rounded-full">{wishCount}</span>}
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
              </svg>
            </Link>
            {/* Cart */}
            <Link to="/cart" className="relative text-muted hover:text-lime transition-colors">
              <AnimatePresence mode="wait">
                {itemCount > 0 && (
                  <motion.span key={itemCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime text-black text-[8px] font-bold flex items-center justify-center rounded-full">
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
              </svg>
            </Link>
            {/* Mobile hamburger */}
            <button onClick={() => setDrawer(true)} className="lg:hidden text-muted hover:text-lime transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* Search panel */}
      <AnimatePresence>
        {search && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed top-[84px] left-0 right-0 z-40 bg-bg2 border-b border-border shadow-xl">
            <div className="max-w-2xl mx-auto px-6 py-5">
              <div className="flex items-center gap-3 border-b border-border2 pb-3">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
                <input autoFocus value={query} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-muted focus:outline-none" />
                <button onClick={() => { setSearch(false); setQuery(''); setResults([]) }} className="text-muted hover:text-lime">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              {results.length > 0 && (
                <div className="py-2">
                  {results.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`}
                      onClick={() => { setSearch(false); setQuery(''); setResults([]) }}
                      className="flex items-center gap-4 py-3 px-2 hover:bg-bg3 transition-colors">
                      <div className="w-10 h-14 shrink-0 overflow-hidden bg-bg3">
                        <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover [filter:saturate(.6)]" />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[.2em] uppercase text-lime mb-0.5">/ {p.category}</p>
                        <p className="font-edit italic text-sm text-ink">{p.name}</p>
                        <p className="font-mono text-[10px] text-muted">Rs. {p.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {query && results.length === 0 && (
                <p className="py-6 text-center font-mono text-sm text-muted">No results for "{query}"</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-bg2 z-50 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-disp text-xl tracking-[.1em]">BLACK<span className="text-lime"> FISH</span></span>
                <button onClick={() => setDrawer(false)} className="text-muted hover:text-lime">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-1">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setDrawer(false)}
                    className="block font-disp text-3xl tracking-[.04em] text-ink py-3 border-b border-border hover:text-lime transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 space-y-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-lime" />
                  <span className="font-mono text-[9px] tracking-[.2em] uppercase text-muted">Free delivery all over Nepal</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}