import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ui/ProductCard'
import { products, categories } from '../data/products'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const cat  = params.get('category') || 'All'
  const sort = params.get('sort')     || 'newest'
  const sz   = params.get('size')     || ''

  // Detect if cat is a gender filter
  const isGender = cat === 'Mens' || cat === 'Womens'

  const set = useCallback((k, v) => {
    setParams(prev => {
      const n = new URLSearchParams(prev)
      !v || v === 'All' || v === 'newest' ? n.delete(k) : n.set(k, v)
      return n
    })
  }, [setParams])

  const reset = useCallback(() => setParams({}), [setParams])

  const filtered = useMemo(() => {
    let r = products
      .filter(p => {
        if (cat === 'All') return true
        if (isGender) return p.gender === cat.toLowerCase()
        return p.category === cat
      })
      .filter(p => !sz || p.sizes.includes(sz))
    if (sort === 'price-asc')  r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'rating')     r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [cat, sort, sz, isGender])

  const hasFilters = cat !== 'All' || sz

  const Sidebar = () => (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[8px] tracking-[.3em] uppercase text-lime mb-4">/ Category</p>
        <div className="space-y-0.5">
          {categories.map(c => (
            <button key={c} onClick={() => set('category', c)}
              className={`flex items-center justify-between w-full text-left font-mono text-[11px] tracking-[.06em] px-3 py-2.5 transition-all rounded-sm
                ${cat === c
                  ? 'bg-lime/10 text-lime border-l-2 border-lime pl-3'
                  : 'text-[rgba(236,236,236,.45)] hover:text-ink hover:bg-white/5 border-l-2 border-transparent'}`}>
              <span>{c}</span>
              <span className="text-[9px] text-muted">
                {c === 'All' ? products.length : products.filter(p => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-7">
        <p className="font-mono text-[8px] tracking-[.3em] uppercase text-lime mb-4">/ Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button key={s} onClick={() => set('size', sz === s ? '' : s)}
              className={`font-mono text-[10px] w-10 h-10 border transition-all
                ${sz === s
                  ? 'bg-lime text-black border-lime font-bold'
                  : 'border-border text-muted hover:border-lime hover:text-lime'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <div className="border-t border-border pt-6">
          <button onClick={reset}
            className="font-mono text-[9px] tracking-[.2em] uppercase text-red hover:text-ink transition-colors flex items-center gap-2">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            CLEAR ALL FILTERS
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 border-b border-border flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ COLLECTION</p>
          <h1 className="font-disp text-ink uppercase leading-[.9]"
            style={{ fontSize: 'clamp(2rem,5vw,6rem)' }}>
            {cat === 'All' ? 'ALL PRODUCTS' : cat.toUpperCase()}
          </h1>
        </div>
        <span className="font-mono text-[10px] tracking-[.1em] text-muted">{filtered.length} PIECES</span>
      </div>

      <div className="max-w-[1440px] mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-border sticky top-[96px] h-[calc(100vh-96px)] overflow-y-auto scrollbar-none">
          <div className="p-6 border-b border-border mb-2">
            <p className="font-mono text-[9px] tracking-[.25em] uppercase text-muted">FILTERS</p>
          </div>
          <div className="p-6">
            <Sidebar />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-muted tracking-[.08em]">{filtered.length} RESULTS</span>
            <div className="flex items-center gap-5">
              <button onClick={() => setFilterOpen(true)}
                className="lg:hidden font-mono text-[9px] tracking-[.2em] uppercase text-muted hover:text-lime transition-colors">
                FILTERS
              </button>
              <select value={sort} onChange={e => set('sort', e.target.value)}
                className="font-mono text-[9px] tracking-[.15em] uppercase bg-transparent text-muted border-b border-border2 pb-1 focus:outline-none cursor-crosshair">
                <option value="newest">NEWEST</option>
                <option value="price-asc">PRICE: LOW → HIGH</option>
                <option value="price-desc">PRICE: HIGH → LOW</option>
                <option value="rating">BEST RATED</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-32 text-center">
                <p className="font-disp text-[6rem] text-[rgba(236,236,236,.05)] leading-none mb-6">NOTHING<br />HERE</p>
                <button onClick={reset} className="font-mono text-[9px] tracking-[.2em] uppercase text-lime underline">
                  RESET FILTERS
                </button>
              </motion.div>
            ) : (
              <motion.div key={`${cat}-${sort}-${sz}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16,1,0.3,1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-bg2 z-50 overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border mb-6">
                <span className="font-mono text-[9px] tracking-[.2em] uppercase">FILTERS</span>
                <button onClick={() => setFilterOpen(false)} className="text-muted hover:text-lime">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="px-6"><Sidebar /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}