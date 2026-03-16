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
      <p className="font-disp text-[8rem] lg:text-[12rem] leading-none text-ink/5 mb-5">CART</p>
      <p className="font-edit italic text-xl text-ink/60 mb-2">Your cart is empty.</p>
      <p className="font-mono text-[10px] tracking-[.08em] text-muted mb-10">
        / BROWSE THE COLLECTION AND FIND SOMETHING WORTH KEEPING
      </p>
      <Link to="/shop"
        className="inline-flex items-center gap-3 bg-ink text-white font-mono text-[9px] font-bold tracking-[.2em] uppercase px-8 py-3.5 hover:bg-ink/80 transition-colors rounded-full">
        BROWSE COLLECTION →
      </Link>
    </div>
  )

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-10 sm:mb-12 pb-6 border-b border-border">
        <h1 className="font-disp text-ink uppercase leading-[.9]"
          style={{ fontSize: 'clamp(2.5rem,6vw,7rem)' }}>YOUR CART</h1>
        <span className="font-mono text-sm font-semibold text-muted">/ {itemCount} ITEMS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
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
        <div className="bg-bg2 border border-border p-6 sm:p-8 h-fit">
          <div className="sticky top-[100px]">
            <p className="font-mono text-[9px] tracking-[.25em] uppercase text-ink font-bold mb-6">/ ORDER SUMMARY</p>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between font-mono text-[12px]">
                <span className="text-muted font-medium">Subtotal</span>
                <span className="font-bold text-ink">{fmt(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between font-mono text-[12px] text-green-600">
                  <span>Discount ({discount?.code})</span>
                  <span>-{fmt(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between font-mono text-[12px]">
                <span className="text-muted font-medium">Shipping</span>
                <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-ink'}`}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="font-mono text-[9px] text-muted">Add {fmt(5000 - subtotal)} more for free delivery</p>
              )}
            </div>

            {/* Discount code */}
            <div className="flex border-b border-border2 mb-2">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                placeholder="DISCOUNT CODE"
                disabled={discOk}
                className="flex-1 bg-transparent font-mono text-[11px] text-ink placeholder:text-muted py-2.5 focus:outline-none disabled:opacity-50" />
              <button onClick={applyDiscount} disabled={discOk || !code}
                className="font-mono text-[8px] tracking-[.2em] uppercase text-ink font-bold pl-3 py-2.5 hover:opacity-60 transition-all disabled:opacity-30">
                APPLY →
              </button>
            </div>
            {discMsg && (
              <p className={`font-mono text-[9px] tracking-[.05em] mb-4 font-bold ${discOk ? 'text-green-600' : 'text-red'}`}>{discMsg}</p>
            )}

            {/* Total */}
            <div className="flex items-baseline justify-between pt-4 border-t border-border mt-4">
              <span className="font-mono text-[9px] tracking-[.2em] uppercase text-muted font-bold">TOTAL</span>
              <span className="font-disp text-ink tracking-[-0.02em] font-black"
                style={{ fontSize: '2rem' }}>{fmt(total)}</span>
            </div>

            <Link to="/checkout"
              className="w-full mt-5 py-3.5 font-mono text-[9px] font-bold tracking-[.2em] uppercase bg-ink text-white hover:bg-ink/80 transition-colors text-center block rounded-full">
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
      className="flex gap-4 sm:gap-5 py-6 border-b border-border">

      {/* Image */}
      <Link to={`/product/${item.product.slug}`} className="w-20 sm:w-24 h-28 sm:h-32 flex-shrink-0 overflow-hidden bg-bg3">
        <img src={item.product.images[0]} alt={item.product.name} loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-1">{item.product.category}</p>
              <h3 className="font-bold text-sm sm:text-base text-ink leading-snug">{item.product.name}</h3>
            </div>
            <button onClick={() => onRemove(item.key)}
              className="text-muted hover:text-red transition-colors text-xl leading-none flex-shrink-0 p-1 -mr-1 -mt-1">×</button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-[9px] tracking-[.1em] text-muted font-medium">SIZE: {item.size}</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[.1em] text-muted font-medium">
              <span className="w-2.5 h-2.5 inline-block border border-border"
                style={{ background: item.color.value }} />
              {item.color.name.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Stepper */}
          <div className="flex items-center border border-border h-8">
            <button onClick={() => onQty(item.key, item.qty - 1)}
              className="w-8 h-full flex items-center justify-center text-muted hover:text-ink transition-colors font-bold">−</button>
            <span className="w-8 text-center font-mono text-[12px] font-bold text-ink">{item.qty}</span>
            <button onClick={() => onQty(item.key, item.qty + 1)}
              className="w-8 h-full flex items-center justify-center text-muted hover:text-ink transition-colors font-bold">+</button>
          </div>
          <span className="font-mono text-[14px] font-black text-ink">{fmt(item.product.price * item.qty)}</span>
        </div>
      </div>
    </motion.div>
  )
}