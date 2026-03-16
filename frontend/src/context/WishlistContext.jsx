import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react'

const WishCtx = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useReducer((state, action) => {
    if (action.type === 'TOGGLE') return state.includes(action.id) ? state.filter(x => x !== action.id) : [...state, action.id]
    if (action.type === 'HYDRATE') return action.ids
    return state
  }, [])

  useEffect(() => {
    try { const s = localStorage.getItem('ys-wish'); if (s) setIds({ type: 'HYDRATE', ids: JSON.parse(s) }) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('ys-wish', JSON.stringify(ids)) }, [ids])

  const toggle      = useCallback((id) => setIds({ type: 'TOGGLE', id }), [])
  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const value = useMemo(() => ({ ids, count: ids.length, toggle, isWishlisted }), [ids, toggle, isWishlisted])
  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishCtx)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}
