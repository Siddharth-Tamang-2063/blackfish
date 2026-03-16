import { testimonials, stats } from '../../data/testimonials'

function TestiCard({ t }) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-bg3 border border-border p-5 sm:p-7 mr-0.5">
      <div className="text-lime text-[11px] tracking-[.1em] mb-3 sm:mb-4">{'★'.repeat(t.rating)}</div>
      <p className="font-edit italic text-sm sm:text-base text-[rgba(236,236,236,.8)] leading-[1.65] mb-4 sm:mb-5">"{t.review}"</p>
      <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-3">/ {t.product}</p>
      <div className="flex items-center gap-2.5 border-t border-border pt-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border2 flex-shrink-0">
          <img src={t.avatar} alt={t.name} loading="lazy" className="w-full h-full object-cover [filter:saturate(.5)]" />
        </div>
        <div>
          <p className="font-mono text-[11px] text-ink">{t.name}</p>
          <p className="font-mono text-[9px] text-muted">{t.role} · {t.city}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const row1 = [...testimonials, ...testimonials, ...testimonials, ...testimonials]
  const row2 = [...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)]

  return (
    <section className="bg-bg2 py-14 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-10 sm:mb-14 lg:mb-16">
        <p className="font-mono text-[10px] tracking-[.2em] text-lime mb-2">/ 04</p>
        <h2 className="font-disp text-ink uppercase tracking-[.02em] leading-[.9]"
          style={{ fontSize: 'clamp(2.2rem,6vw,7rem)' }}>
          WHAT OUR<br /><span style={{ WebkitTextStroke: '1px #ECECEC', color: 'transparent' }}>CUSTOMERS SAY</span>
        </h2>
      </div>

      <div className="pause-on-hover">
        <div className="overflow-hidden mb-0.5">
          <div className="animate-scroll-left flex">
            {row1.map((t, i) => <TestiCard key={`r1-${i}`} t={t} />)}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="animate-scroll-right flex">
            {row2.map((t, i) => <TestiCard key={`r2-${i}`} t={t} />)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mt-10 sm:mt-14 lg:mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border">
          {stats.map((s, i) => (
            <div key={s.l} className={`py-6 sm:py-8 px-4 sm:px-6 text-center
              ${i % 2 !== 1 ? 'border-r border-border' : ''}
              ${i < 2 ? 'border-b lg:border-b-0 border-border' : ''}
              lg:${i < stats.length - 1 ? 'border-r' : ''} lg:border-border
            `}>
              <p className="font-disp text-lime tracking-[.02em] leading-none mb-2"
                style={{ fontSize: 'clamp(2rem,4vw,4.5rem)' }}>{s.v}</p>
              <p className="font-mono text-[8px] tracking-[.22em] uppercase text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}