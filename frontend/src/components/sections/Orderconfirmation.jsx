import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { fmt } from '../../data/products'

export default function OrderConfirmation() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { items: cartItems, subtotal, shipping, discountAmt, total: cartTotal } = useCart()
  const cleared   = useRef(false)

  const state = location.state
  // Redirect if accessed directly without order state
  useEffect(() => { if (!state?.orderId) navigate('/') }, [state, navigate])

  // Clear cart once after order is placed
  useEffect(() => {
    if (state?.orderId && !cleared.current) {
      cleared.current = true
      // Cart will clear when user navigates away — we keep it for display
    }
  }, [state])

  if (!state?.orderId) return null

  const { orderId, form, total, items, payMethod } = state
  const isCOD      = payMethod === 'cod'
  const payLabel   = payMethod === 'esewa' ? 'eSewa' : payMethod === 'khalti' ? 'Khalti' : 'Cash on Delivery'

  return (
    <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-12 sm:py-20">

      {/* Success animation */}
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 bg-lime flex items-center justify-center mb-6">
          <svg width="28" height="28" fill="none" stroke="black" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>
        <p className="font-mono text-[10px] tracking-[.3em] uppercase text-lime mb-3">/ Order Placed Successfully</p>
        <h1 className="font-disp text-ink uppercase leading-[.9] mb-4"
          style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
          THANK YOU!
        </h1>
        <p className="font-mono text-[11px] text-muted leading-[1.8] max-w-[400px]">
          Your order has been received. We will contact you on <span className="text-ink">{form.phone}</span> to confirm and arrange delivery.
        </p>
      </motion.div>

      {/* Order ID */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-bg3 border border-lime/30 p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-muted mb-1">/ Order ID</p>
          <p className="font-disp text-lime text-[1.6rem] tracking-[.05em]">{orderId}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-muted mb-1">/ Total Paid</p>
          <p className="font-disp text-ink text-[1.6rem]">{fmt(total)}</p>
        </div>
      </motion.div>

      {/* Items ordered */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="border border-border mb-6">
        <div className="p-4 border-b border-border">
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime">/ Items Ordered</p>
        </div>
        {items.map(item => (
          <div key={item.key} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <img src={item.product.images[0]} alt={item.product.name}
              className="w-12 h-16 object-cover flex-shrink-0 [filter:saturate(.6)]" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] text-ink">{item.product.name}</p>
              <p className="font-mono text-[9px] text-muted">Size: {item.size} · Qty: {item.qty}</p>
            </div>
            <p className="font-mono text-[11px] font-medium flex-shrink-0">{fmt(item.product.price * item.qty)}</p>
          </div>
        ))}
      </motion.div>

      {/* Delivery + Payment info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-border p-5">
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-3">/ Delivery</p>
          <p className="font-mono text-[11px] text-ink">{form.name}</p>
          <p className="font-mono text-[11px] text-muted">{form.phone}</p>
          <p className="font-mono text-[11px] text-muted">{form.address}</p>
          <p className="font-mono text-[11px] text-muted">{form.city}{form.province ? `, ${form.province}` : ''}</p>
        </div>
        <div className="border border-border p-5">
          <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-3">/ Payment</p>
          <p className="font-mono text-[11px] text-ink">{payLabel}</p>
          {form.screenshot && (
            <img src={form.screenshot} alt="Payment proof" className="h-16 mt-2 object-contain border border-border" />
          )}
          {isCOD && (
            <p className="font-mono text-[10px] text-muted mt-1 leading-[1.7]">Pay <span className="text-ink">{fmt(total)}</span> when your order arrives.</p>
          )}
        </div>
      </motion.div>

      {/* What's next */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-bg3 border border-border p-6 mb-10">
        <p className="font-mono text-[8px] tracking-[.25em] uppercase text-lime mb-5">/ What Happens Next</p>
        <div className="space-y-4">
          {[
            { n: '01', t: 'Order Confirmed', d: 'We will call or WhatsApp you within 24 hours to confirm your order.' },
            { n: '02', t: 'Processing',      d: 'Your items are packed and prepared for dispatch.' },
            { n: '03', t: 'Out for Delivery',d: 'Your order is on its way. Delivery takes 2–5 days across Nepal.' },
            { n: '04', t: 'Delivered',       d: isCOD ? `Pay ${fmt(total)} to our delivery person on arrival.` : 'Your order has been delivered. Enjoy!' },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-4">
              <span className="font-disp text-lime/30 text-[1.4rem] leading-none flex-shrink-0 w-8">{s.n}</span>
              <div>
                <p className="font-mono text-[10px] text-ink mb-0.5">{s.t}</p>
                <p className="font-mono text-[9px] text-muted leading-[1.7]">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3">
        <Link to="/shop"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 bg-lime text-black font-mono text-[9px] font-bold tracking-[.2em] uppercase px-8 py-3.5 hover:bg-[#d4ff5c] transition-colors">
          CONTINUE SHOPPING →
        </Link>
        <Link to="/"
          className="flex-1 sm:flex-none inline-flex items-center justify-center font-mono text-[9px] tracking-[.2em] uppercase text-muted border border-border px-8 py-3.5 hover:text-ink hover:border-border2 transition-all">
          GO HOME
        </Link>
      </motion.div>

    </div>
  )
}