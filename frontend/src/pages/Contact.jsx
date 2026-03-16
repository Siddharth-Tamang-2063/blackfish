import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUBJECTS = ['Order Issue', 'Exchange & Return', 'Wholesale Enquiry', 'Press & Media', 'Other']

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-2">/ {label.toUpperCase()}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="font-mono text-[9px] text-red mt-1.5 tracking-[.08em]">
            / {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = (hasErr) =>
  `w-full bg-transparent border-b py-2.5 font-mono text-[12px] text-ink placeholder:text-muted focus:outline-none transition-colors tracking-[.04em] ${hasErr ? 'border-red' : 'border-border2 focus:border-ink'}`

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [errs, setErrs]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]   = useState(false)
  const [shake, setShake] = useState(false)

  const validate = useCallback(() => {
    const e = {}
    if (!form.name.trim())                                 e.name    = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))   e.email   = 'Invalid email'
    if (!form.subject)                                     e.subject = 'Required'
    if (form.message.trim().length < 10)                   e.message = 'Please write more (min 10 chars)'
    return e
  }, [form])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrs(v)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    setErrs({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setDone(true)
  }, [validate])

  const change = useCallback((field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errs[field]) setErrs(v => ({ ...v, [field]: undefined }))
  }, [errs])

  return (
    <div className="min-h-[calc(100vh-84px)] grid grid-cols-1 lg:grid-cols-2">

      {/* Left info panel */}
      <div className="bg-bg2 border-r border-border px-8 sm:px-12 lg:px-16 py-14 sm:py-20 flex flex-col justify-between gap-12">
        <div>
          <p className="font-mono text-[9px] tracking-[.3em] uppercase text-muted mb-5">/ GET IN TOUCH</p>
          <h1 className="font-disp text-ink uppercase leading-[.9] mb-12"
            style={{ fontSize: 'clamp(2.5rem,5vw,6rem)' }}>
            WE'D<br />LOVE TO<br /><span className="text-ink">HEAR YOU.</span>
          </h1>
          {[
            { l: 'EMAIL',   v: 'hello@blackfish.com.np', href: 'mailto:hello@blackfish.com.np' },
            { l: 'PHONE',   v: '+977 98-0000-0000',       href: 'tel:+9779800000000' },
            { l: 'ADDRESS', v: 'Kathmandu, Nepal' },
            { l: 'HOURS',   v: 'Sun – Fri, 10:00 – 18:00' },
          ].map(({ l, v, href }) => (
            <div key={l} className="mb-6">
              <p className="font-mono text-[8px] tracking-[.25em] uppercase text-muted mb-1">/ {l}</p>
              <p className="font-mono text-[11px] tracking-[.04em] text-ink/70">
                {href ? <a href={href} className="hover:text-ink transition-colors">{v}</a> : v}
              </p>
            </div>
          ))}
        </div>
        <div>
          <p className="font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-3">/ FOLLOW ALONG</p>
          <div className="flex gap-5">
            {['Instagram', 'Facebook', 'TikTok'].map(s => (
              <a key={s} href="#"
                className="font-mono text-[9px] tracking-[.18em] uppercase text-muted border-b border-transparent hover:text-ink hover:border-ink transition-all">
                {s.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="px-8 sm:px-12 lg:px-16 py-14 sm:py-20 overflow-y-auto">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="success"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-12 h-12 border border-ink flex items-center justify-center mb-6 text-ink">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              </div>
              <h2 className="font-disp text-[2.5rem] text-ink uppercase tracking-[.04em] mb-3">MESSAGE<br />SENT.</h2>
              <p className="font-mono text-[11px] text-muted leading-[1.75]">
                Thank you for reaching out.<br />We typically respond within 24 hours on business days.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.5 }}>
              <h2 className="font-disp text-[2.5rem] sm:text-[2.8rem] text-ink uppercase tracking-[.04em] leading-[.9] mb-10">
                SEND A<br />MESSAGE
              </h2>
              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Name" error={errs.name}>
                    <input type="text" value={form.name} onChange={change('name')}
                      placeholder="Your name" className={inputCls(!!errs.name)} />
                  </Field>
                  <Field label="Email" error={errs.email}>
                    <input type="email" value={form.email} onChange={change('email')}
                      placeholder="your@email.com" className={inputCls(!!errs.email)} />
                  </Field>
                </div>

                <Field label="Subject" error={errs.subject}>
                  <select value={form.subject} onChange={change('subject')}
                    className={`${inputCls(!!errs.subject)} appearance-none bg-bg`}>
                    <option value="" disabled>Select a subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                <Field label="Message" error={errs.message}>
                  <textarea value={form.message} onChange={change('message')}
                    placeholder="Tell us what's on your mind..." rows={5}
                    className={`${inputCls(!!errs.message)} resize-none`} />
                </Field>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 font-mono text-[9px] font-bold tracking-[.2em] uppercase bg-ink text-white hover:bg-ink/80 transition-colors disabled:opacity-40 flex items-center justify-center gap-2.5 rounded-full">
                  {loading ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      SENDING...
                    </>
                  ) : 'SEND MESSAGE →'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}