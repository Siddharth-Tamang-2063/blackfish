import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { fmt, getDiscount } from '../../data/products'

const badgeStyles = {
  sale: 'bg-red text-white',
  new: 'bg-lime text-black',
  rare: 'border border-lime text-lime',
  'one left': 'border border-red text-red',
}

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded]     = useState(false)
  const { addItem }           = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const d  = getDiscount(product)
  const isW = isWishlisted(product.id)

  const handleAdd = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    addItem(product, product.sizes[0], product.colors[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }, [addItem, product])

  const handleWish = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    toggle(product.id)
  }, [toggle, product.id])

  const badgeKey = product.badge?.toLowerCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="block group"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} data-cursor>

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-bg3">
          <img src={product.images[0]} alt={product.name} loading="lazy" decoding="async"
            className="w-full h-full object-cover [filter:saturate(.7)_brightness(.9)] transition-all duration-700 ease-luxury group-hover:scale-[1.06] group-hover:[filter:saturate(.5)_brightness(.7)]" />

          {/* Index */}
          <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[.2em] text-muted z-10">
            / {String(index + 1).padStart(2, '0')}
          </span>

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 right-3 font-mono text-[8px] tracking-[.15em] uppercase px-2 py-1 font-medium z-10 ${badgeStyles[badgeKey] || badgeStyles.new}`}>
              {product.badge}
            </span>
          )}

          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-bg/80 flex flex-col justify-end p-6 transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'} z-20`}>
            <p className="font-disp text-lime leading-[.9] uppercase tracking-[.02em] mb-4 text-[clamp(2rem,4vw,3.5rem)]">
              {product.name}
            </p>
            <div className="flex items-center justify-between border-t border-lime/30 pt-3">
              <button onClick={handleAdd}
                className={`font-mono text-[8px] tracking-[.2em] uppercase transition-all hover:tracking-[.35em] ${added ? 'text-green-400' : 'text-lime'}`}>
                {added ? '✓ ADDED' : 'ADD TO CART +'}
              </button>
              <button onClick={handleWish} className={`transition-colors ${isW ? 'text-red' : 'text-muted hover:text-red'}`}>
                <svg width="16" height="16" fill={isW ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-bg3 border-t border-border p-4">
          <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-1">/ {product.category}</p>
          <p className="font-edit italic text-base text-ink mb-2 leading-snug">{product.name}</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] font-medium text-ink">{fmt(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="font-mono text-[10px] text-muted line-through">{fmt(product.originalPrice)}</span>
                <span className="font-mono text-[8px] tracking-[.1em] text-red">-{d}%</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}