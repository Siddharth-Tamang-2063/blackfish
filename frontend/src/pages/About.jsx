import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TIMELINE = [
  { yr: '2022', title: 'BLACK FISH FOUNDED', desc: 'Black Fish started with a simple idea — bring trendy, high quality clothing to Nepal at prices that actually make sense. We launched our first collection online and sold out in weeks.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop' },
  { yr: '2023', title: 'FIRST BIG DROP',     desc: 'Our first major collection launched with 10 pieces. It sold out in under 2 weeks. We started shipping to every district in Nepal — not just Kathmandu.', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=70&auto=format&fit=crop' },
  { yr: '2024', title: 'CASH ON DELIVERY',   desc: 'We introduced COD across all of Nepal. This was a game changer — more customers could now shop with confidence without any upfront payment risk.', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70&auto=format&fit=crop' },
  { yr: '2025', title: 'NEW SEASON',         desc: 'Our biggest collection yet. Hoodies, tees, cargo pants, jackets, and thrift picks — all carefully chosen, all top quality. 15,000+ happy customers and counting.', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70&auto=format&fit=crop' },
]

const VALUES = [
  { n: '01', t: 'Quality',      d: 'We only sell clothes we would wear ourselves. Every piece is checked for quality — good fabric, clean stitching, and fits that actually look good on real people.' },
  { n: '02', t: 'Trendy Fits',  d: 'We keep up with what is actually in style. No boring basics — just clean, modern fits that work for everyday life in Nepal.' },
  { n: '03', t: 'Nepal First',  d: 'We ship to every district. We support COD. We price fairly. Because great clothing should be accessible to everyone in Nepal — not just Kathmandu.' },
]

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }} className={className}>
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=75&auto=format&fit=crop"
          alt="Black Fish Nepal" loading="eager"
          className="absolute inset-0 w-full h-full object-cover [filter:brightness(.3)_saturate(.4)]" />
        <div className="relative z-10 text-center">
          <p className="font-mono text-[9px] tracking-[.3em] uppercase text-lime mb-4">/ EST. 2022, NEPAL</p>
          <h1 className="font-disp text-ink uppercase leading-[.85] tracking-[.04em]"
            style={{ fontSize: 'clamp(4rem,12vw,14rem)' }}>
            BLACK<br /><span className="text-lime">FISH</span>
          </h1>
        </div>
      </section>

      {/* Intro quote */}
      <div className="max-w-[800px] mx-auto px-12 py-20 text-center">
        <FadeIn>
          <blockquote className="font-edit italic text-ink leading-[1.5]"
            style={{ fontSize: 'clamp(1.2rem,2.2vw,1.8rem)' }}>
            "We are a Nepal-based clothing store built for people who want to look good without overthinking it — great fits, real quality, and fair prices."
          </blockquote>
        </FadeIn>
      </div>

      {/* Timeline */}
      <div className="border-t border-border py-20">
        <div className="max-w-[1440px] mx-auto px-12 mb-16">
          <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ OUR JOURNEY</p>
          <h2 className="font-disp text-ink uppercase leading-[.9]"
            style={{ fontSize: 'clamp(3rem,6vw,7rem)' }}>
            HOW WE<br /><span style={{ WebkitTextStroke: '1px #1D1D1F', color: 'transparent' }}>GOT HERE</span>
          </h2>
        </div>
        <div className="max-w-[1100px] mx-auto px-12 space-y-20">
          {TIMELINE.map((t, i) => (
            <FadeIn key={t.yr} delay={0.1}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <p className="font-disp text-[4.5rem] text-lime/20 leading-none mb-[-6px]">{t.yr}</p>
                  <h3 className="font-disp text-[2.2rem] text-ink uppercase tracking-[.04em] mb-3">{t.title}</h3>
                  <p className="font-mono text-[11px] text-muted leading-[1.85]">{t.desc}</p>
                </div>
                <div className={`overflow-hidden aspect-[4/3] bg-bg3 ${i % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
                  <img src={t.img} alt={t.title} loading="lazy"
                    className="w-full h-full object-cover [filter:saturate(.5)_brightness(.8)] hover:[filter:saturate(.7)_brightness(.9)] transition-all duration-500" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-bg2 border-y border-border py-20 px-12">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="mb-14">
            <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ WHAT WE STAND FOR</p>
            <h2 className="font-disp text-ink uppercase leading-[.9]"
              style={{ fontSize: 'clamp(3rem,6vw,7rem)' }}>
              THREE<br /><span style={{ WebkitTextStroke: '1px #1D1D1F', color: 'transparent' }}>THINGS</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 border border-border">
            {VALUES.map((v, i) => (
              <FadeIn key={v.n} delay={i * 0.1}>
                <div className={`p-10 ${i < VALUES.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}`}>
                  <p className="font-disp text-[3rem] text-lime/20 mb-4">{v.n}</p>
                  <h3 className="font-disp text-[1.8rem] text-ink uppercase tracking-[.04em] mb-3">{v.t.toUpperCase()}</h3>
                  <p className="font-mono text-[11px] text-muted leading-[1.8]">{v.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}