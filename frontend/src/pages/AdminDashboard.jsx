import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import { fmt } from '../data/products'

const STATUS_COLORS = {
  pending:   { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  confirmed: { bg: 'bg-blue-400/10',   text: 'text-blue-400',   border: 'border-blue-400/30',   dot: 'bg-blue-400' },
  shipped:   { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/30', dot: 'bg-purple-400' },
  delivered: { bg: 'bg-lime/10',       text: 'text-lime',       border: 'border-lime/30',       dot: 'bg-lime' },
  cancelled: { bg: 'bg-red/10',        text: 'text-red',        border: 'border-red/30',        dot: 'bg-red' },
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const PAY_LABEL = { esewa: 'eSewa', khalti: 'Khalti', cod: 'COD' }

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[.12em] uppercase px-2.5 py-1 border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

function StatCard({ label, value, sub, color = 'text-lime' }) {
  return (
    <div className="bg-bg2 border border-border p-5">
      <p className="font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-3">/ {label}</p>
      <p className={`font-disp text-[2.2rem] leading-none ${color} mb-1`}>{value}</p>
      {sub && <p className="font-mono text-[9px] text-muted">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { orders, updateOrderStatus, logout } = useAdmin()
  const navigate = useNavigate()

  const [search, setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  // Stats
  const stats = useMemo(() => {
    const total     = orders.reduce((s, o) => s + o.total, 0)
    const pending   = orders.filter(o => o.status === 'pending').length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const today     = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length
    return { total, pending, delivered, today, count: orders.length }
  }, [orders])

  // Filtered orders
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = filterStatus === 'all' || o.status === filterStatus
      const q = search.toLowerCase()
      const matchSearch = !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.form.name.toLowerCase().includes(q) ||
        o.form.phone.includes(q) ||
        o.form.city.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, search, filterStatus])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    await new Promise(r => setTimeout(r, 400))
    updateOrderStatus(orderId, newStatus)
    setUpdatingId(null)
    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }))
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-bg">

      {/* Top navbar */}
      <header className="sticky top-0 z-50 h-14 bg-bg border-b border-border flex items-center px-5 sm:px-8 justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-disp text-[1.4rem] tracking-[.1em] text-ink">
            BLACK<span className="text-lime"> FISH</span>
          </Link>
          <span className="font-mono text-[8px] tracking-[.2em] uppercase text-muted border border-border px-2 py-0.5">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono text-[9px] tracking-[.15em] uppercase text-muted hover:text-lime transition-colors hidden sm:block">
            VIEW STORE
          </Link>
          <button onClick={handleLogout}
            className="font-mono text-[9px] tracking-[.15em] uppercase text-muted hover:text-red transition-colors flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
            </svg>
            <span className="hidden sm:block">LOGOUT</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8">

        {/* Page title */}
        <div className="mb-8">
          <p className="font-mono text-[9px] tracking-[.25em] uppercase text-lime mb-1">/ DASHBOARD</p>
          <h1 className="font-disp text-[2.2rem] text-ink uppercase tracking-[.04em]">Order Management</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Orders"    value={stats.count}          sub="All time" />
          <StatCard label="Total Revenue"   value={`Rs.${(stats.total/1000).toFixed(0)}k`} sub="All orders" />
          <StatCard label="Pending"         value={stats.pending}        sub="Need action" color="text-yellow-400" />
          <StatCard label="Delivered"       value={stats.delivered}      sub="Completed" color="text-lime" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID, name, phone, city..."
              className="w-full bg-bg2 border border-border font-mono text-[11px] text-ink placeholder:text-muted pl-9 pr-4 py-2.5 focus:outline-none focus:border-lime transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`font-mono text-[8px] tracking-[.12em] uppercase px-3 py-2.5 border transition-all
                  ${filterStatus === s ? 'bg-lime text-black border-lime' : 'border-border text-muted hover:border-lime hover:text-lime'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="font-mono text-[9px] text-muted mb-4 tracking-[.08em]">{filtered.length} ORDERS FOUND</p>

        {/* Orders table */}
        <div className="bg-bg2 border border-border overflow-hidden">
          {/* Table header — desktop */}
          <div className="hidden lg:grid grid-cols-[1fr_1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-5 py-3 border-b border-border">
            {['ORDER ID', 'CUSTOMER', 'ITEMS', 'TOTAL', 'PAYMENT', 'STATUS'].map(h => (
              <p key={h} className="font-mono text-[8px] tracking-[.2em] uppercase text-muted">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-disp text-[4rem] text-[rgba(236,236,236,.05)] leading-none mb-3">NO ORDERS</p>
              <p className="font-mono text-[10px] text-muted">No orders match your search.</p>
            </div>
          ) : (
            filtered.map((order, i) => (
              <div key={order.orderId}
                className={`border-b border-border last:border-0 hover:bg-bg3 transition-colors ${i % 2 === 0 ? '' : 'bg-bg3/30'}`}>

                {/* Desktop row */}
                <div className="hidden lg:grid grid-cols-[1fr_1.2fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-5 py-4 items-center">
                  <div>
                    <p className="font-mono text-[10px] text-lime font-bold">{order.orderId}</p>
                    <p className="font-mono text-[8px] text-muted mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-ink">{order.form.name}</p>
                    <p className="font-mono text-[9px] text-muted">{order.form.phone}</p>
                    <p className="font-mono text-[8px] text-muted">{order.form.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.items.slice(0,3).map((item, j) => (
                        <img key={j} src={item.product.images[0]} alt="" className="w-8 h-10 object-cover border border-border [filter:saturate(.6)]" />
                      ))}
                    </div>
                    <p className="font-mono text-[9px] text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-mono text-[11px] font-bold text-ink">{fmt(order.total)}</p>
                  <span className="font-mono text-[9px] text-muted uppercase">{PAY_LABEL[order.payMethod]}</span>
                  <div className="flex items-center gap-2">
                    {updatingId === order.orderId ? (
                      <svg className="w-4 h-4 animate-spin text-lime" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    ) : (
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.orderId, e.target.value)}
                        className={`font-mono text-[8px] tracking-[.1em] uppercase bg-bg3 border py-1 px-2 focus:outline-none focus:border-lime transition-colors cursor-pointer
                          ${STATUS_COLORS[order.status]?.border} ${STATUS_COLORS[order.status]?.text}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                    <button onClick={() => setSelectedOrder(order)}
                      className="font-mono text-[8px] tracking-[.1em] uppercase text-muted hover:text-lime transition-colors border border-border hover:border-lime px-2 py-1">
                      VIEW
                    </button>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="lg:hidden p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-[10px] text-lime font-bold">{order.orderId}</p>
                      <p className="font-mono text-[9px] text-ink mt-0.5">{order.form.name} · {order.form.city}</p>
                      <p className="font-mono text-[8px] text-muted">{formatDate(order.createdAt)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] font-bold text-lime">{fmt(order.total)}</p>
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.orderId, e.target.value)}
                        className="font-mono text-[8px] uppercase bg-bg3 border border-border py-1 px-2 focus:outline-none text-muted"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setSelectedOrder(order)}
                        className="font-mono text-[8px] uppercase text-muted hover:text-lime border border-border hover:border-lime px-2 py-1 transition-all">
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16,1,0.3,1] }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-bg2 border-l border-border z-50 overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-bg2 border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime">/ ORDER DETAIL</p>
                  <p className="font-disp text-[1.4rem] text-ink">{selectedOrder.orderId}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-lime transition-colors">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Status + date */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedOrder.status} />
                  <p className="font-mono text-[9px] text-muted">{formatDate(selectedOrder.createdAt)}</p>
                </div>

                {/* Update status */}
                <div className="bg-bg3 border border-border p-4">
                  <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-3">/ UPDATE STATUS</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => handleStatusChange(selectedOrder.orderId, s)}
                        disabled={selectedOrder.status === s || updatingId === selectedOrder.orderId}
                        className={`font-mono text-[8px] tracking-[.1em] uppercase px-3 py-2 border transition-all disabled:opacity-40
                          ${selectedOrder.status === s
                            ? `${STATUS_COLORS[s]?.bg} ${STATUS_COLORS[s]?.text} ${STATUS_COLORS[s]?.border}`
                            : 'border-border text-muted hover:border-lime hover:text-lime'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div className="border border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime">/ Items ({selectedOrder.items.length})</p>
                  </div>
                  {selectedOrder.items.map(item => (
                    <div key={item.key} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                      <img src={item.product.images[0]} alt="" className="w-12 h-16 object-cover flex-shrink-0 [filter:saturate(.6)]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] text-ink truncate">{item.product.name}</p>
                        <p className="font-mono text-[9px] text-muted">Size: {item.size} · Qty: {item.qty}</p>
                      </div>
                      <p className="font-mono text-[11px] font-bold flex-shrink-0">{fmt(item.product.price * item.qty)}</p>
                    </div>
                  ))}
                </div>

                {/* Customer */}
                <div className="border border-border p-4">
                  <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-3">/ Customer</p>
                  <div className="space-y-1">
                    <p className="font-mono text-[11px] text-ink font-bold">{selectedOrder.form.name}</p>
                    <p className="font-mono text-[10px] text-muted">{selectedOrder.form.phone}</p>
                    <p className="font-mono text-[10px] text-muted">{selectedOrder.form.address}</p>
                    <p className="font-mono text-[10px] text-muted">{selectedOrder.form.city}{selectedOrder.form.province ? `, ${selectedOrder.form.province}` : ''}</p>
                    {selectedOrder.form.notes && <p className="font-mono text-[9px] text-muted italic mt-1">Note: {selectedOrder.form.notes}</p>}
                  </div>
                </div>

                {/* Payment */}
                <div className="border border-border p-4">
                  <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-3">/ Payment</p>
                  <p className="font-mono text-[11px] text-ink">{PAY_LABEL[selectedOrder.payMethod]}</p>
                  {selectedOrder.screenshot && (
                    <img src={selectedOrder.screenshot} alt="Payment proof" className="h-32 mt-3 object-contain border border-border" />
                  )}
                </div>

                {/* Total */}
                <div className="border border-border p-4">
                  <p className="font-mono text-[8px] tracking-[.2em] uppercase text-lime mb-3">/ Total</p>
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[9px] text-muted uppercase tracking-[.15em]">ORDER TOTAL</span>
                    <span className="font-disp text-lime text-[1.8rem]">{fmt(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
