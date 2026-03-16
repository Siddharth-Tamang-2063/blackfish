import { createContext, useContext, useState, useEffect } from 'react'

const AdminCtx = createContext(null)

// Hardcoded admin credentials
const ADMIN_ID = 'admin'
const ADMIN_PASS = 'admin123'

// Mock orders data based on the app's order structure
const MOCK_ORDERS = [
  {
    orderId: 'BF73829101',
    createdAt: '2025-03-15T08:30:00Z',
    status: 'pending',
    form: { name: 'Priya Rai', phone: '9801234567', address: 'Lazimpat, Ward 2', city: 'Kathmandu', province: 'Bagmati', notes: '' },
    items: [
      { key: '1-M-Obsidian', product: { name: 'Obsidian Oversized Hoodie', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=200&q=60'], price: 4800 }, size: 'M', qty: 1 },
    ],
    payMethod: 'esewa',
    total: 4800,
    screenshot: null,
  },
  {
    orderId: 'BF83920234',
    createdAt: '2025-03-14T14:15:00Z',
    status: 'confirmed',
    form: { name: 'Rohan Basnet', phone: '9812345678', address: 'Lakeside, Baidam', city: 'Pokhara', province: 'Gandaki', notes: 'Please pack carefully' },
    items: [
      { key: '3-32-Khaki', product: { name: 'Utility Cargo Trousers', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&q=60'], price: 5500 }, size: '32', qty: 1 },
      { key: '2-S-Black', product: { name: 'Minimal Boxy Tee', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=60'], price: 1800 }, size: 'S', qty: 2 },
    ],
    payMethod: 'cod',
    total: 9300,
    screenshot: null,
  },
  {
    orderId: 'BF94830345',
    createdAt: '2025-03-13T10:00:00Z',
    status: 'shipped',
    form: { name: 'Sita Tamang', phone: '9823456789', address: 'Hanuman Nagar', city: 'Biratnagar', province: 'Koshi', notes: '' },
    items: [
      { key: '5-M-Vintage', product: { name: 'Archive Denim Jacket', images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=60'], price: 3200 }, size: 'M', qty: 1 },
    ],
    payMethod: 'khalti',
    total: 3200,
    screenshot: null,
  },
  {
    orderId: 'BF05741456',
    createdAt: '2025-03-12T09:45:00Z',
    status: 'delivered',
    form: { name: 'Anil Thapa', phone: '9834567890', address: 'Kupondole', city: 'Lalitpur', province: 'Bagmati', notes: '' },
    items: [
      { key: '8-L-Camel', product: { name: 'Wool-Blend Overcoat', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&q=60'], price: 14500 }, size: 'L', qty: 1 },
    ],
    payMethod: 'esewa',
    total: 14500,
    screenshot: null,
  },
  {
    orderId: 'BF16852567',
    createdAt: '2025-03-11T16:20:00Z',
    status: 'cancelled',
    form: { name: 'Nisha Gurung', phone: '9845678901', address: 'Bharatpur-10', city: 'Chitwan', province: 'Bagmati', notes: '' },
    items: [
      { key: '9-XL-Faded', product: { name: 'Pigment-Dyed Hoodie', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=200&q=60'], price: 3900 }, size: 'XL', qty: 1 },
    ],
    payMethod: 'cod',
    total: 3900,
    screenshot: null,
  },
  {
    orderId: 'BF27963678',
    createdAt: '2025-03-10T11:30:00Z',
    status: 'confirmed',
    form: { name: 'Bikram Lama', phone: '9856789012', address: 'Suryabinayak', city: 'Bhaktapur', province: 'Bagmati', notes: 'Call before delivery' },
    items: [
      { key: '4-M-Tan', product: { name: 'Structured Overshirt', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=60'], price: 7800 }, size: 'M', qty: 1 },
      { key: '10-L-Navy', product: { name: 'Relaxed Polo Tee', images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&q=60'], price: 2200 }, size: 'L', qty: 1 },
    ],
    payMethod: 'esewa',
    total: 10000,
    screenshot: null,
  },
]

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bf_admin_auth') === 'true'
  })
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bf_admin_orders')
    return saved ? JSON.parse(saved) : MOCK_ORDERS
  })

  useEffect(() => {
    localStorage.setItem('bf_admin_orders', JSON.stringify(orders))
  }, [orders])

  const login = (id, pass) => {
    if (id === ADMIN_ID && pass === ADMIN_PASS) {
      setIsLoggedIn(true)
      localStorage.setItem('bf_admin_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('bf_admin_auth')
  }

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o))
  }

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev])
  }

  return (
    <AdminCtx.Provider value={{ isLoggedIn, login, logout, orders, updateOrderStatus, addOrder }}>
      {children}
    </AdminCtx.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminCtx)
}
