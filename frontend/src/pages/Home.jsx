import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Hero from '../components/sections/Hero'
import Testimonials from '../components/sections/Testimonials'
import ProductCard from '../components/ui/ProductCard'
import { products } from '../data/products'

const COLLECTIONS = [
  { name: 'HOODIE\nCOLLECTION', sub: '/ Hoodies',  cat: 'Hoodies',  img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&q=70&auto=format&fit=crop' },
  { name: 'ESSENTIAL\nTEES',      sub: '/ T-Shirts', cat: 'T-Shirts', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=70&auto=format&fit=crop' },
  { name: 'OUTER\nWEAR',          sub: '/ Jackets',  cat: 'Jackets',  img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=70&auto=format&fit=crop' },
]
const TICKER = ['BLACK FISH NEPAL',"Nepal's Trendy Store",'TOP QUALITY','TRENDY FITS','SHIPS ALL OVER NEPAL','CASH ON DELIVERY','NEW COLLECTION 2025','BEST PRICE GUARANTEED']

function Ticker() {
  const doubled = [...TICKER, ...TICKER, ...TICKER]
  return (
    <div className="h-11 border-y border-border overflow-hidden flex items-center pause-on-hover">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((t, i) => (
          <div key={i} className="font-disp text-[16px] sm:text-[18px] tracking-[.08em] text-ink/50 px-6 sm:px-10 flex items-center gap-6 sm:gap-10">
            {t}<span className="text-ink/30 text-[12px]">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CollectionCard({ col }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
      className="group relative overflow-hidden cursor-crosshair"
    >
      <Link to={`/shop?category=${encodeURIComponent(col.cat)}`}>
        {/* On mobile use 4/3 ratio (landscape), on md+ use 3/4 (portrait) */}
        <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
          <img src={col.img} alt={col.name} loading="lazy"
            className="w-full h-full object-cover [filter:saturate(.6)_brightness(.8)] transition-all duration-700 ease-luxury group-hover:scale-105 group-hover:[filter:saturate(.3)_brightness(.5)]" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
            <p className="font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-1.5">{col.sub}</p>
            <h3 className="font-disp text-ink tracking-[.04em] uppercase leading-[.9] transition-colors duration-300 group-hover:text-lime"
              style={{ fontSize: 'clamp(1.6rem,4vw,3rem)' }}>
              {col.name.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
            </h3>
            <div className="mt-2 font-mono text-[9px] tracking-[.18em] uppercase text-lime flex items-center gap-1.5 opacity-0 translate-y-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              SHOP NOW →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section className="bg-bg border-t border-border py-14 sm:py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <h2 className="font-disp text-ink uppercase leading-[.9]" style={{ fontSize: 'clamp(2.4rem,6vw,7rem)' }}>
          GET NEW<br /><span className="text-lime">DROPS</span><br />FIRST
        </h2>
        <div>
          <p className="font-mono text-[11px] text-muted leading-[1.8] mb-6 sm:mb-8">
            New arrivals, exclusive deals, and sale access. You hear it first. Once a month — no spam.
          </p>
          {done ? (
            <p className="font-mono text-[9px] tracking-[.15em] text-lime">✓ YOU'RE IN. NEW DROPS COMING YOUR WAY.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setDone(true) }}
              className="flex border-b border-border2">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                placeholder="your@email.com"
                className="flex-1 bg-transparent font-mono text-[12px] text-ink placeholder:text-muted py-3 focus:outline-none min-w-0" />
              <button type="submit" className="font-mono text-[9px] tracking-[.2em] uppercase text-lime py-3 pl-4 whitespace-nowrap hover:tracking-[.3em] transition-all">
                JOIN →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const featured = products.filter(p => p.isFeatured).slice(0, 4)
  const trending = products.filter(p => p.isTrending).slice(0, 3)

  return (
    <>
      <Hero />
      <Ticker />

      {/* Collections */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 lg:pt-24 pb-0">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ 01</p>
            <h2 className="font-disp text-ink uppercase leading-[.9]" style={{ fontSize: 'clamp(2.2rem,6vw,7rem)' }}>
              THE COLLECTIONS
            </h2>
          </div>
          <Link to="/shop" className="font-mono text-[9px] tracking-[.2em] uppercase text-muted border-b border-border2 pb-0.5 hover:text-ink hover:border-ink transition-all whitespace-nowrap ml-4">
            VIEW ALL →
          </Link>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-20 lg:pb-24">
        {/* Mobile: 1 col. sm: 2 col (first card full width). md: 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
          {COLLECTIONS.map((col, i) => (
            <div key={col.cat} className={i === 0 ? 'sm:col-span-2 md:col-span-1' : ''}>
              <CollectionCard col={col} />
            </div>
          ))}
        </div>
      </div>


      {/* Featured */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ 02</p>
            <h2 className="font-disp text-ink uppercase leading-[.9]" style={{ fontSize: 'clamp(2.2rem,6vw,7rem)' }}>
              FEATURED<br /><span style={{ WebkitTextStroke: '1px #1D1D1F', color: 'transparent' }}>PIECES</span>
            </h2>
          </div>
          <Link to="/shop" className="font-mono text-[9px] tracking-[.2em] uppercase text-muted border-b border-border2 pb-0.5 hover:text-ink transition-all whitespace-nowrap ml-4">
            VIEW ALL →
          </Link>
        </div>
        {/* 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-bg2 border-y border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24">
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ 03</p>
              <h2 className="font-disp text-ink uppercase leading-[.9]" style={{ fontSize: 'clamp(2.2rem,6vw,7rem)' }}>
                TRENDING<br />RIGHT <span style={{ WebkitTextStroke: '1px #1D1D1F', color: 'transparent' }}>NOW</span>
              </h2>
            </div>
          </div>
          {/* 2 cols on mobile, 3 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </div>

      <Testimonials />
      <Newsletter />
    </>
  )
}