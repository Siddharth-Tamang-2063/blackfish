import { useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { fmt } from '../../data/products'

const ESEWA_NUMBER  = '9800000000'
const KHALTI_NUMBER = '9811111111'

const steps = ['Delivery', 'Payment', 'Confirm']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10 sm:mb-14">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center gap-2 ${i <= current ? 'text-ink' : 'text-muted'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all
              ${i < current ? 'bg-lime border-lime text-black'
              : i === current ? 'border-lime text-lime'
              : 'border-border text-muted'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="font-mono text-[9px] tracking-[.15em] uppercase hidden sm:block">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-16 h-px mx-2 sm:mx-3 transition-all ${i < current ? 'bg-lime' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function InputField({ label, error, children }) {
  return (
    <div>
      <label className="block font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-1.5">/ {label}</label>
      {children}
      {error && <p className="font-mono text-[9px] text-red mt-1">{error}</p>}
    </div>
  )
}

const inputCls = (err) =>
  `w-full bg-bg3 border-b ${err ? 'border-red' : 'border-border2 focus:border-lime'} font-mono text-[12px] text-ink px-0 py-2.5 focus:outline-none transition-colors placeholder:text-muted`

// ─── Step 1: Delivery ───────────────────────────────────────────
function DeliveryStep({ form, setForm, onNext }) {
  const [errs, setErrs] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit number required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim())    e.city    = 'Required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrs(e); return }
    onNext()
  }

  const ch = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errs[field]) setErrs(v => ({ ...v, [field]: undefined }))
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-disp text-[2rem] sm:text-[2.5rem] text-ink uppercase tracking-[.04em] mb-8">Delivery Details</h2>
      <div className="space-y-6">
        <InputField label="Full Name" error={errs.name}>
          <input value={form.name} onChange={ch('name')} placeholder="Your full name" className={inputCls(errs.name)} />
        </InputField>
        <InputField label="Phone Number" error={errs.phone}>
          <input value={form.phone} onChange={ch('phone')} placeholder="98XXXXXXXX" className={inputCls(errs.phone)} />
        </InputField>
        <InputField label="Delivery Address" error={errs.address}>
          <input value={form.address} onChange={ch('address')} placeholder="Street / Tole / Ward No." className={inputCls(errs.address)} />
        </InputField>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="City / District" error={errs.city}>
            <input value={form.city} onChange={ch('city')} placeholder="e.g. Kathmandu" className={inputCls(errs.city)} />
          </InputField>
          <InputField label="Province (optional)">
            <input value={form.province} onChange={ch('province')} placeholder="e.g. Bagmati" className={inputCls(false)} />
          </InputField>
        </div>
        <InputField label="Order Notes (optional)">
          <textarea value={form.notes} onChange={ch('notes')} rows={3}
            placeholder="Any special instructions..."
            className={`${inputCls(false)} resize-none`} />
        </InputField>
      </div>
      <button onClick={handleNext}
        className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-lime text-black font-mono text-[9px] font-bold tracking-[.2em] uppercase px-10 py-3.5 hover:bg-[#d4ff5c] transition-colors">
        CONTINUE TO PAYMENT →
      </button>
    </motion.div>
  )
}

// ─── Step 2: Payment ────────────────────────────────────────────
function PaymentStep({ form, setForm, total, onNext, onBack }) {
  const [errs, setErrs] = useState({})
  const fileRef = useRef(null)

  const validate = () => {
    const e = {}
    if (!form.payMethod) e.payMethod = 'Select a payment method'
    if (form.payMethod !== 'cod') {
      if (!form.screenshot) e.screenshot = 'Screenshot is required'
    }
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrs(e); return }
    onNext()
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm(f => ({ ...f, screenshot: ev.target.result, screenshotName: file.name }))
    reader.readAsDataURL(file)
    if (errs.screenshot) setErrs(v => ({ ...v, screenshot: undefined }))
  }

  const ch = (field) => (val) => {
    setForm(f => ({ ...f, [field]: val }))
    if (errs[field]) setErrs(v => ({ ...v, [field]: undefined }))
  }

  const isDigital = form.payMethod === 'esewa' || form.payMethod === 'khalti'
  const payNum = form.payMethod === 'esewa' ? ESEWA_NUMBER : KHALTI_NUMBER

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-disp text-[2rem] sm:text-[2.5rem] text-ink uppercase tracking-[.04em] mb-8">Payment Method</h2>

      {/* Method selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { id: 'esewa',  label: 'eSewa',  color: '#60BB46', desc: 'Digital wallet' },
          { id: 'khalti', label: 'Khalti', color: '#5C2D91', desc: 'Digital wallet' },
          { id: 'cod',    label: 'Cash on Delivery', color: '#BAFF29', desc: 'Pay when received' },
        ].map(m => (
          <button key={m.id} onClick={() => ch('payMethod')(m.id)}
            className={`border p-4 text-left transition-all ${form.payMethod === m.id ? 'border-lime bg-lime/5' : 'border-border hover:border-border2'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: form.payMethod === m.id ? '#BAFF29' : '#333' }}>
                {form.payMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-lime" />}
              </div>
              <span className="font-mono text-[11px] font-bold tracking-[.05em]" style={{ color: m.color }}>{m.label}</span>
            </div>
            <p className="font-mono text-[9px] text-muted ml-5">{m.desc}</p>
          </button>
        ))}
      </div>
      {errs.payMethod && <p className="font-mono text-[9px] text-red mb-4">{errs.payMethod}</p>}

      {/* eSewa / Khalti instructions */}
      <AnimatePresence>
        {isDigital && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-bg3 border border-border p-6 mb-8 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0 font-mono text-lime text-[11px] font-bold">1</div>
              <div>
                <p className="font-mono text-[11px] text-ink mb-1">Send <span className="text-lime font-bold">{fmt(total)}</span> to the {form.payMethod === 'esewa' ? 'eSewa' : 'Khalti'} number below</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-disp text-[1.4rem] text-lime tracking-[.05em]">{payNum}</span>
                  <button onClick={() => navigator.clipboard?.writeText(payNum)}
                    className="font-mono text-[8px] tracking-[.15em] uppercase text-muted border border-border px-2 py-1 hover:text-lime hover:border-lime transition-all">
                    COPY
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0 font-mono text-lime text-[11px] font-bold">2</div>
              <p className="font-mono text-[11px] text-ink">After payment, enter the <span className="text-lime">Transaction ID</span> and upload the <span className="text-lime">payment screenshot</span> below</p>
            </div>

            <div className="border-t border-border pt-5">
              <div>
                <label className="block font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-1.5">/ Payment Screenshot *</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                  className={`w-full border-2 border-dashed p-6 text-center transition-all hover:border-lime group ${errs.screenshot ? 'border-red' : form.screenshot ? 'border-lime bg-lime/5' : 'border-border'}`}>
                  {form.screenshot ? (
                    <div className="space-y-2">
                      <img src={form.screenshot} alt="screenshot" className="h-24 mx-auto object-contain" />
                      <p className="font-mono text-[9px] text-lime">{form.screenshotName}</p>
                      <p className="font-mono text-[8px] text-muted">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-8 h-8 mx-auto text-muted group-hover:text-lime transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                      </svg>
                      <p className="font-mono text-[10px] text-muted group-hover:text-ink transition-colors">Upload payment screenshot</p>
                      <p className="font-mono text-[8px] text-muted">JPG, PNG, WEBP supported</p>
                    </div>
                  )}
                </button>
                {errs.screenshot && <p className="font-mono text-[9px] text-red mt-1">{errs.screenshot}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {form.payMethod === 'cod' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-bg3 border border-border p-5 mb-8 flex items-start gap-3">
            <div className="w-5 h-5 bg-lime flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" fill="none" stroke="black" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            </div>
            <div>
              <p className="font-mono text-[11px] text-ink mb-1">Pay when your order arrives</p>
              <p className="font-mono text-[10px] text-muted leading-[1.7]">Our delivery person will collect <span className="text-ink">{fmt(total)}</span> when they hand over your order. Please keep exact change ready.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack}
          className="font-mono text-[9px] tracking-[.2em] uppercase text-muted border border-border px-8 py-3.5 hover:text-ink hover:border-border2 transition-all">
          ← BACK
        </button>
        <button onClick={handleNext}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 bg-lime text-black font-mono text-[9px] font-bold tracking-[.2em] uppercase px-10 py-3.5 hover:bg-[#d4ff5c] transition-colors">
          REVIEW ORDER →
        </button>
      </div>
    </motion.div>
  )
}

// ─── Step 3: Confirm ────────────────────────────────────────────
function ConfirmStep({ form, items, subtotal, shipping, discountAmt, total, onBack, onPlace, placing }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="font-disp text-[2rem] sm:text-[2.5rem] text-ink uppercase tracking-[.04em] mb-8">Review Order</h2>

      {/* Items */}
      <div className="border border-border mb-6">
        <div className="p-4 border-b border-border">
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime">/ Items ({items.length})</p>
        </div>
        {items.map(item => (
          <div key={item.key} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover flex-shrink-0 [filter:saturate(.7)]" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] text-ink truncate">{item.product.name}</p>
              <p className="font-mono text-[9px] text-muted">SIZE: {item.size} · QTY: {item.qty}</p>
            </div>
            <p className="font-mono text-[11px] font-medium flex-shrink-0">{fmt(item.product.price * item.qty)}</p>
          </div>
        ))}
      </div>

      {/* Delivery */}
      <div className="border border-border mb-6 p-5">
        <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-3">/ Delivery To</p>
        <p className="font-mono text-[11px] text-ink">{form.name}</p>
        <p className="font-mono text-[11px] text-muted">{form.phone}</p>
        <p className="font-mono text-[11px] text-muted">{form.address}, {form.city}{form.province ? `, ${form.province}` : ''}</p>
        {form.notes && <p className="font-mono text-[10px] text-muted mt-1 italic">Note: {form.notes}</p>}
      </div>

      {/* Payment */}
      <div className="border border-border mb-6 p-5">
        <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-3">/ Payment</p>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] text-ink capitalize">
            {form.payMethod === 'cod' ? 'Cash on Delivery' : form.payMethod === 'esewa' ? 'eSewa' : 'Khalti'}
          </p>
        </div>
        {form.screenshot && (
          <img src={form.screenshot} alt="Payment screenshot" className="h-20 mt-3 object-contain border border-border" />
        )}
      </div>

      {/* Total */}
      <div className="border border-border p-5 mb-8 space-y-2.5">
        <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-3">/ Total</p>
        <div className="flex justify-between font-mono text-[11px]"><span className="text-muted">Subtotal</span><span>{fmt(subtotal)}</span></div>
        {discountAmt > 0 && <div className="flex justify-between font-mono text-[11px] text-green-400"><span>Discount</span><span>-{fmt(discountAmt)}</span></div>}
        <div className="flex justify-between font-mono text-[11px]"><span className="text-muted">Shipping</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span></div>
        <div className="flex justify-between items-baseline pt-2 border-t border-border">
          <span className="font-mono text-[9px] tracking-[.2em] uppercase text-muted">TOTAL</span>
          <span className="font-disp text-lime text-[1.8rem]">{fmt(total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack}
          className="font-mono text-[9px] tracking-[.2em] uppercase text-muted border border-border px-8 py-3.5 hover:text-ink hover:border-border2 transition-all">
          ← BACK
        </button>
        <button onClick={onPlace} disabled={placing}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 bg-lime text-black font-mono text-[9px] font-bold tracking-[.2em] uppercase px-10 py-3.5 hover:bg-[#d4ff5c] transition-colors disabled:opacity-60">
          {placing ? (
            <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>PLACING...</>
          ) : 'PLACE ORDER ✓'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Checkout Page ──────────────────────────────────────────
export default function Checkout() {
  const { items, subtotal, shipping, discountAmt, total, itemCount } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', province: '', notes: '',
    payMethod: '', screenshot: null, screenshotName: '',
  })

  const placeOrder = useCallback(async () => {
    setPlacing(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1600))
    const orderId = 'BF' + Date.now().toString().slice(-8)
    navigate('/order-confirmation', { state: { orderId, form, total, items, payMethod: form.payMethod } })
  }, [form, total, items, navigate])

  if (itemCount === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-disp text-[5rem] leading-none text-[rgba(236,236,236,.05)] mb-4">EMPTY</p>
      <p className="font-edit italic text-xl text-muted mb-6">Your cart is empty.</p>
      <Link to="/shop" className="bg-lime text-black font-mono text-[9px] font-bold tracking-[.2em] uppercase px-8 py-3.5 hover:bg-[#d4ff5c] transition-colors">
        BROWSE COLLECTION →
      </Link>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 sm:mb-12 pb-6 border-b border-border flex items-baseline justify-between">
        <h1 className="font-disp text-ink uppercase tracking-[.02em] leading-[.9]"
          style={{ fontSize: 'clamp(2.2rem,5vw,5rem)' }}>CHECKOUT</h1>
        <Link to="/cart" className="font-mono text-[9px] tracking-[.15em] uppercase text-muted hover:text-lime transition-colors">
          ← CART
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
        {/* Left — steps */}
        <div>
          <StepIndicator current={step} />
          <AnimatePresence mode="wait">
            {step === 0 && <DeliveryStep key="delivery" form={form} setForm={setForm} onNext={() => setStep(1)} />}
            {step === 1 && <PaymentStep  key="payment"  form={form} setForm={setForm} total={total} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <ConfirmStep  key="confirm"  form={form} items={items} subtotal={subtotal} shipping={shipping} discountAmt={discountAmt} total={total} onBack={() => setStep(1)} onPlace={placeOrder} placing={placing} />}
          </AnimatePresence>
        </div>

        {/* Right — order summary */}
        <div className="order-first lg:order-last">
          <div className="bg-bg3 border border-border p-5 sticky top-[96px]">
            <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-5">/ Order Summary</p>
            <div className="space-y-3 mb-5 max-h-[280px] overflow-y-auto scrollbar-none">
              {items.map(item => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover [filter:saturate(.6)]" />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime text-black font-mono text-[8px] font-bold flex items-center justify-center rounded-full">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-ink truncate">{item.product.name}</p>
                    <p className="font-mono text-[9px] text-muted">{item.size}</p>
                  </div>
                  <p className="font-mono text-[10px] flex-shrink-0">{fmt(item.product.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between font-mono text-[10px]"><span className="text-muted">Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discountAmt > 0 && <div className="flex justify-between font-mono text-[10px] text-green-400"><span>Discount</span><span>-{fmt(discountAmt)}</span></div>}
              <div className="flex justify-between font-mono text-[10px]"><span className="text-muted">Shipping</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span></div>
              <div className="flex justify-between items-baseline pt-3 border-t border-border">
                <span className="font-mono text-[9px] uppercase text-muted tracking-[.15em]">TOTAL</span>
                <span className="font-disp text-lime text-[1.6rem]">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}