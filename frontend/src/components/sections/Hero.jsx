import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScroll, useTransform, motion } from 'framer-motion'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden flex items-center bg-[#F5F5F7]">

      {/* BG with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=85&auto=format&fit=crop"
          alt="Black Fish Nepal"
          loading="eager"
          className="w-full h-full object-cover object-center [filter:brightness(.35)_saturate(.5)_contrast(1.1)]"
        />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      </motion.div>

      {/* Floating label top right — desktop only */}
      <div className="hidden lg:flex absolute top-8 right-14 items-center gap-2 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        <span className="font-mono text-[9px] tracking-[.25em] uppercase text-white/50">2025 Collection</span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-5 lg:gap-7 max-w-[780px] mx-auto lg:mx-0">

          <span className="animate-fadeup-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="font-mono text-[9px] tracking-[.2em] uppercase text-white/80">
              Black Fish Nepal · New Arrivals
            </span>
          </span>

          <h1
            className="animate-fadeup-2 text-white uppercase"
            style={{ 
              fontSize: 'clamp(3.8rem, 9vw, 11rem)', 
              fontFamily: 'Inter, -apple-system, sans-serif', 
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.04em'
            }}
          >
            YOUR NEXT<br />
            FAVOURITE<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>OUTFIT.</span>
          </h1>

          <p className="animate-fadeup-3 font-mono text-[10px] lg:text-[11px] leading-[1.9] text-white/50 max-w-[280px] lg:max-w-none">
            Trendy fits. Top quality fabric. Shipped all over Nepal.
          </p>

          <div className="animate-fadeup-3 flex flex-row items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 bg-white text-[#1D1D1F] font-bold text-[11px] tracking-[-0.01em] uppercase px-7 py-3.5 hover:bg-white/90 active:scale-95 transition-all duration-200 rounded-full shadow-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Shop Now
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
              </svg>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-bold text-[11px] tracking-[-0.01em] uppercase px-7 py-3.5 hover:bg-white/10 active:scale-95 transition-all duration-200 rounded-full"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Explore
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute right-10 bottom-16 flex-col items-center gap-2 z-10">
        <span className="font-mono text-[8px] tracking-[.25em] uppercase text-white/25 [writing-mode:vertical-lr] rotate-180">SCROLL</span>
        <div className="w-px h-14 bg-gradient-to-b from-white/40 to-transparent animate-scroll-pulse" />
      </div>

    </section>
  )
}