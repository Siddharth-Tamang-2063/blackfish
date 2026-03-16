import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScroll, useTransform, motion } from 'framer-motion'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden flex items-center lg:items-end">

      {/* BG */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=85&auto=format&fit=crop"
          alt="Black Fish Nepal"
          loading="eager"
          className="w-full h-full object-cover object-center [filter:brightness(.38)_saturate(.65)]"
        />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-10 sm:py-0 sm:pb-24 lg:pb-32">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 lg:gap-8 max-w-[700px] mx-auto lg:mx-0">

          <p className="animate-fadeup-1 font-mono text-[8px] tracking-[.3em] uppercase text-lime">
            / BLACK FISH — NEW COLLECTION 2025
          </p>

          <h1
            className="animate-fadeup-2 font-disp text-white uppercase leading-[.87] tracking-[.01em]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 12rem)' }}
          >
            YOUR NEXT<br />
            FAVOURITE<br />
            <span className="text-lime">OUTFIT.</span>
          </h1>

          <p className="animate-fadeup-3 font-mono text-[10px] lg:text-[11px] leading-[1.9] text-white/55">
            Trendy fits. Top quality fabric.<br />
            Shipped all over Nepal.
          </p>

          <Link
            to="/shop"
            className="animate-fadeup-3 inline-flex items-center gap-3 bg-lime text-black font-mono text-[10px] font-bold tracking-[.25em] uppercase px-10 py-4 hover:bg-[#d4ff5c] hover:gap-5 hover:px-12 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(186,255,41,0.25)] hover:shadow-[0_0_40px_rgba(186,255,41,0.45)]"
          >
            SHOP NOW
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
            </svg>
          </Link>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute right-10 bottom-16 flex-col items-center gap-2 z-10">
        <span className="font-mono text-[8px] tracking-[.25em] uppercase text-white/25 [writing-mode:vertical-lr] rotate-180">SCROLL</span>
        <div className="w-px h-14 bg-gradient-to-b from-lime to-transparent animate-scroll-pulse" />
      </div>

    </section>
  )
}