import { useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products, fmt, getDiscount, getRelated } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ui/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product  = products.find(p => p.slug === slug)

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="font-disp text-[5rem] text-ink/5">NOT FOUND</p>
      <button onClick={() => navigate('/shop')} className="font-mono text-[9px] tracking-[.2em] uppercase text-muted underline mt-4 hover:text-ink transition-colors">
        BACK TO SHOP
      </button>
    </div>
  )

  const related = getRelated(product)
  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-4 border-b border-border flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-[.15em] uppercase text-muted">
        <Link to="/" className="hover:text-ink transition-colors">HOME</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-ink font-bold truncate">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2">
        <Gallery product={product} />
        <Panel product={product} />
      </div>

      {related.length > 0 && (
        <div className="border-t border-border max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="font-mono text-[10px] tracking-[.2em] text-muted font-bold mb-2">/ YOU MAY ALSO LIKE</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 mt-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </>
  )
}

function Gallery({ product }) {
  const [idx, setIdx] = useState(0)
  return (
    <div className="sticky top-[84px] h-[50vw] sm:h-[60vh] lg:h-[calc(100vh-84px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={product.images[idx]} alt={product.name}
          loading={idx === 0 ? 'eager' : 'lazy'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover" />
      </AnimatePresence>
      {/* Thumbnails */}
      <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
        {product.images.map((img, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`w-12 h-16 overflow-hidden border-2 transition-all ${i === idx ? 'border-ink opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}>
            <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

function Panel({ product }) {
  const [size, setSize]         = useState('')
  const [color, setColor]       = useState(product.colors[0])
  const [qty, setQty]           = useState(1)
  const [added, setAdded]       = useState(false)
  const [sizeWarn, setSizeWarn] = useState(false)
  const { addItem }             = useCart()
  const { toggle, isWishlisted} = useWishlist()
  const isW = isWishlisted(product.id)
  const d   = getDiscount(product)

  const handleAdd = useCallback(() => {
    if (!size) { setSizeWarn(true); return }
    setSizeWarn(false)
    addItem(product, size, color, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }, [size, color, qty, product, addItem])

  return (
    <div className="border-t lg:border-t-0 lg:border-l border-border px-5 sm:px-8 lg:px-12 py-8 lg:py-12 lg:overflow-y-auto lg:max-h-[calc(100vh-84px)] scrollbar-none">

      <p className="font-mono text-[9px] tracking-[.25em] uppercase text-muted font-bold mb-2">/ {product.category}</p>
      <h1 className="font-disp text-ink uppercase leading-[.9] mb-5"
        style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>{product.name}</h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-8">
        <span className="font-disp text-[2.2rem] text-ink">{fmt(product.price)}</span>
        {product.originalPrice && <>
          <span className="font-mono text-sm text-muted line-through">{fmt(product.originalPrice)}</span>
          <span className="font-mono text-[9px] bg-red text-white px-2 py-0.5">-{d}%</span>
        </>}
      </div>

      <div className="h-px bg-border mb-7" />

      {/* Colour */}
      <div className="mb-6">
        <p className="font-mono text-[8px] tracking-[.22em] uppercase text-muted mb-3">
          COLOUR — <span className="text-ink font-bold">{color.name}</span>
        </p>
        <div className="flex gap-2">
          {product.colors.map(c => (
            <button key={c.name} onClick={() => setColor(c)} title={c.name}
              className="relative w-6 h-6 transition-transform hover:scale-110"
              style={{ background: c.value, border: '1px solid rgba(29,29,31,0.15)' }}>
              {color.name === c.name && <span className="absolute inset-[-4px] border-2 border-ink" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <p className="font-mono text-[8px] tracking-[.22em] uppercase text-muted mb-3">
          SIZE{size && <span className="text-ink font-bold"> — {size}</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map(s => (
            <button key={s} onClick={() => { setSize(s); setSizeWarn(false) }}
              className={`font-mono text-[10px] px-4 py-2 border transition-all
                ${size === s ? 'bg-ink text-white border-ink' : 'border-border text-muted hover:border-ink hover:text-ink'}`}>
              {s}
            </button>
          ))}
        </div>
        {sizeWarn && <p className="font-mono text-[9px] text-red mt-2">Please select a size</p>}
      </div>

      {/* Qty */}
      <div className="flex items-center gap-4 mb-7">
        <p className="font-mono text-[8px] tracking-[.22em] uppercase text-muted">QTY</p>
        <div className="flex items-center border border-border">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink transition-colors font-bold">−</button>
          <span className="w-9 text-center font-mono text-[12px] font-bold text-ink">{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink transition-colors font-bold">+</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-5">
        <motion.button whileTap={{ scale: 0.98 }} onClick={handleAdd}
          className={`flex-1 py-3.5 font-mono text-[9px] font-bold tracking-[.2em] uppercase transition-colors rounded-full
            ${added ? 'bg-green-600 text-white' : 'bg-ink text-white hover:bg-ink/80'}`}>
          {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
        </motion.button>
        <button onClick={() => toggle(product.id)}
          className={`w-12 border-2 flex items-center justify-center transition-all rounded-full
            ${isW ? 'bg-red/10 border-red text-red' : 'border-border text-muted hover:border-red hover:text-red'}`}>
          <svg width="18" height="18" fill={isW ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
        </button>
      </div>

      <p className="font-mono text-[9px] text-muted leading-[1.7]">
        Free delivery all over Nepal · Cash on Delivery available · Easy 7-day returns
      </p>
    </div>
  )
}