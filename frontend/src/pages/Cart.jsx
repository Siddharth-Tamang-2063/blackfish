import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fmt } from '../data/products'

export default function Cart() {
  const { items, subtotal, shipping, discountAmt, total, itemCount, removeItem, updateQty, setDiscount, discount } = useCart()
  const [code, setCode]       = useState('')
  const [discMsg, setDiscMsg] = useState('')
  const [discOk, setDiscOk]   = useState(false)

  const applyDiscount = useCallback(() => {
    if (code.toUpperCase() === 'YS20') {
      setDiscount({ pct: 20, code: 'YS20' })
      setDiscOk(true)
      setDiscMsg('✓ 20% OFF APPLIED')
    } else {
      setDiscMsg('INVALID CODE — TRY: YS20')
      setDiscOk(false)
    }
  }, [code, setDiscount])

  if (itemCount === 0) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-disp text-[8rem] lg:text-[12rem] leading-none text-[rgba(236,236,236,.04)] mb-5">CART</p>
      <p className="font-edit italic text-xl text-muted mb-2">Your cart is empty.</p>
      <p className="font-mono text-[10px] tracking-[.08em] text-[rgba(236,236,236,.2)] mb-10">
        / BROWSE THE COLLECTION AND FIND SOMETHING WORTH KEEPING
      </p>
      <Link to="/shop"
        className="inline-flex items-center gap-3 bg-lime text-black font-mono text-[9px] font-medium tracking-[.2em] uppercase px-8 py-3.5 hover:bg-[#d4ff5c] transition-colors">
        BROWSE COLLECTION →
      </Link>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-12 py-14">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-12 pb-6 border-b border-border">
        <h1 className="font-disp text-ink uppercase tracking-[.02em] leading-[.9]"
          style={{ fontSize: 'clamp(3rem,6vw,7rem)' }}>YOUR CART</h1>
        <span className="font-mono text-base text-muted">/ {itemCount} ITEMS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        {/* Items */}
        <div>
          <div className="border-t border-border">
            <AnimatePresence initial={false}>
              {items.map(item => (
                <CartItem key={item.key} item={item} onRemove={removeItem} onQty={updateQty} />
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-8">
            <Link to="/shop"
              className="font-mono text-[9px] tracking-[.2em] uppercase text-muted border-b border-border2 pb-0.5 hover:text-ink hover:border-ink transition-all">
              ← CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-bg3 border border-border p-8">
          <div className="sticky top-[100px]">
            <p className="font-mono text-[9px] tracking-[.25em] uppercase text-muted mb-6">/ ORDER SUMMARY</p>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-muted">Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between font-mono text-[11px] text-green-400">
                  <span>Discount ({discount?.code})</span>
                  <span>-{fmt(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="font-mono text-[9px] text-muted">Add {fmt(5000 - subtotal)} more for free delivery</p>
              )}
            </div>

            {/* Discount code */}
            <div className="flex border-b border-border2 mb-2">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                placeholder="DISCOUNT CODE (TRY: YS20)"
                disabled={discOk}
                className="flex-1 bg-transparent font-mono text-[11px] text-ink placeholder:text-muted py-2.5 focus:outline-none disabled:opacity-50" />
              <button onClick={applyDiscount} disabled={discOk || !code}
                className="font-mono text-[8px] tracking-[.2em] uppercase text-lime pl-3 py-2.5 hover:tracking-[.3em] transition-all disabled:opacity-30">
                APPLY →
              </button>
            </div>
            {discMsg && (
              <p className={`font-mono text-[9px] tracking-[.05em] mb-4 ${discOk ? 'text-green-400' : 'text-red'}`}>{discMsg}</p>
            )}

            {/* Total */}
            <div className="flex items-baseline justify-between pt-4 border-t border-border mt-4">
              <span className="font-mono text-[9px] tracking-[.2em] uppercase text-muted">TOTAL</span>
              <span className="font-disp text-lime tracking-[.04em]"
                style={{ fontSize: '1.8rem' }}>{fmt(total)}</span>
            </div>

            <Link to="/checkout"
              className="w-full mt-5 py-3.5 font-mono text-[9px] font-medium tracking-[.2em] uppercase bg-lime text-black hover:bg-[#d4ff5c] transition-colors text-center block">
              PROCEED TO CHECKOUT
            </Link>
            <p className="font-mono text-[8px] text-center text-muted mt-3 tracking-[.1em]">
              / CASH ON DELIVERY · SECURE CHECKOUT
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, onRemove, onQty }) {
  return (
    <motion.div layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
      className="flex gap-5 py-6 border-b border-border">
      {/* Image */}
      <Link to={`/product/${item.product.slug}`} className="w-24 h-32 flex-shrink-0 overflow-hidden bg-bg3">
        <img src={item.product.images[0]} alt={item.product.name} loading="lazy"
          className="w-full h-full object-cover [filter:saturate(.7)] hover:scale-105 transition-transform duration-500" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-1">/ {item.product.category}</p>
              <h3 className="font-edit italic text-base text-ink">{item.product.name}</h3>
            </div>
            <button onClick={() => onRemove(item.key)}
              className="text-muted hover:text-red transition-colors text-lg leading-none flex-shrink-0 p-1 -mr-1 -mt-1">×</button>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-mono text-[9px] tracking-[.1em] text-muted">SIZE: {item.size}</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[.1em] text-muted">
              <span className="w-2.5 h-2.5 inline-block border border-[rgba(255,255,255,.1)]"
                style={{ background: item.color.value }} />
              {item.color.name.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Stepper */}
          <div className="flex items-center border border-border h-8">
            <button onClick={() => onQty(item.key, item.qty - 1)}
              className="w-8 h-full flex items-center justify-center text-muted hover:text-lime transition-colors">−</button>
            <span className="w-8 text-center font-mono text-[11px]">{item.qty}</span>
            <button onClick={() => onQty(item.key, item.qty + 1)}
              className="w-8 h-full flex items-center justify-center text-muted hover:text-lime transition-colors">+</button>
          </div>
          <span className="font-mono text-[13px] font-medium">{fmt(item.product.price * item.qty)}</span>
        </div>
      </div>
    </motion.div>
  )
}