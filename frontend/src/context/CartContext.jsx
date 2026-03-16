import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react'

const CartCtx = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.product.id}-${action.size}-${action.color.name}`
      const ex  = state.items.find(i => i.key === key)
      if (ex) return { ...state, items: state.items.map(i => i.key === key ? { ...i, qty: i.qty + (action.qty || 1) } : i) }
      return { ...state, items: [...state.items, { key, product: action.product, size: action.size, color: action.color, qty: action.qty || 1 }] }
    }
    case 'REMOVE':  return { ...state, items: state.items.filter(i => i.key !== action.key) }
    case 'QTY':     return action.qty <= 0
      ? { ...state, items: state.items.filter(i => i.key !== action.key) }
      : { ...state, items: state.items.map(i => i.key === action.key ? { ...i, qty: action.qty } : i) }
    case 'DISCOUNT': return { ...state, discount: action.discount }
    case 'HYDRATE':  return action.state
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], discount: null })

  useEffect(() => {
    try { const s = localStorage.getItem('ys-cart'); if (s) dispatch({ type: 'HYDRATE', state: JSON.parse(s) }) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('ys-cart', JSON.stringify(state)) }, [state])

  const addItem     = useCallback((product, size, color, qty = 1) => dispatch({ type: 'ADD', product, size, color, qty }), [])
  const removeItem  = useCallback((key) => dispatch({ type: 'REMOVE', key }), [])
  const updateQty   = useCallback((key, qty) => dispatch({ type: 'QTY', key, qty }), [])
  const setDiscount = useCallback((discount) => dispatch({ type: 'DISCOUNT', discount }), [])

  const subtotal    = useMemo(() => state.items.reduce((s, i) => s + i.product.price * i.qty, 0), [state.items])
  const itemCount   = useMemo(() => state.items.reduce((s, i) => s + i.qty, 0), [state.items])
  const shipping    = useMemo(() => subtotal >= 5000 || subtotal === 0 ? 0 : 200, [subtotal])
  const discountAmt = useMemo(() => state.discount ? Math.round(subtotal * state.discount.pct / 100) : 0, [subtotal, state.discount])
  const total       = useMemo(() => subtotal + shipping - discountAmt, [subtotal, shipping, discountAmt])

  const value = useMemo(() => ({
    items: state.items, discount: state.discount, subtotal, shipping, discountAmt, total, itemCount,
    addItem, removeItem, updateQty, setDiscount,
  }), [state.items, state.discount, subtotal, shipping, discountAmt, total, itemCount, addItem, removeItem, updateQty, setDiscount])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
