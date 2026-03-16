import { useState, useEffect, useRef, useCallback } from 'react'

export function useScrollLock() {
  const lock   = useCallback(() => { document.body.style.overflow = 'hidden' }, [])
  const unlock = useCallback(() => { document.body.style.overflow = '' }, [])
  useEffect(() => unlock, [unlock])
  return { lock, unlock }
}

export function useIntersect(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); if (options.once !== false) obs.unobserve(el) }
    }, { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [options.threshold, options.rootMargin, options.once])
  return [ref, visible]
}

export function useCursor() {
  useEffect(() => {
    const el = document.createElement('div')
    el.id = 'ys-cursor'
    el.style.cssText = `
      position:fixed;width:8px;height:8px;background:#BAFF29;border-radius:50%;
      pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
      transition:width .2s,height .2s,background .2s;will-change:left,top;
    `
    document.body.appendChild(el)

    const move = (e) => { el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px' }
    const over  = (e) => {
      const hit = e.target.closest('a,button,input,select,textarea,[data-cursor]')
      el.style.width    = hit ? '40px' : '8px'
      el.style.height   = hit ? '40px' : '8px'
      el.style.background   = hit ? 'transparent' : '#BAFF29'
      el.style.border   = hit ? '1px solid #BAFF29' : 'none'
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      el.remove()
    }
  }, [])
}
