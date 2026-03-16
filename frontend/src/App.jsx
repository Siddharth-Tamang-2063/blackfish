import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AdminProvider } from './context/AdminContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Code-split pages
const Home             = lazy(() => import('./pages/Home'))
const Shop             = lazy(() => import('./pages/Shop'))
const ProductDetail    = lazy(() => import('./pages/ProductDetail'))
const Cart             = lazy(() => import('./pages/Cart'))
const Checkout         = lazy(() => import('./components/sections/Checkout'))
const OrderConfirmation= lazy(() => import('./components/sections/Orderconfirmation'))
const About            = lazy(() => import('./pages/About'))
const Contact          = lazy(() => import('./pages/Contact'))
const AdminLogin       = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'))
const AdminGuard       = lazy(() => import('./pages/AdminGuard'))

// Page transition wrapper
const pageVariants = { 
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.16,1,0.3,1] } },
}

function PageTransition({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-px h-6 bg-ink animate-pulse"
            style={{ animationDelay: `${i * 100}ms`, opacity: 0.3 + i * 0.2 }} />
        ))}
      </div>
    </div>
  )
}

// 404
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-disp text-[10rem] leading-none text-ink/5 mb-4">404</p>
      <h1 className="font-disp text-3xl text-ink uppercase tracking-[.04em] mb-3">Page Not Found.</h1>
      <a href="/" className="font-mono text-[9px] tracking-[.2em] uppercase text-ink underline underline-offset-4 mt-2">
        RETURN HOME
      </a>
    </div>
  )
}

// Animated routes
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><Suspense fallback={<PageLoader />}><Home /></Suspense></PageTransition>
        } />
        <Route path="/shop" element={
          <PageTransition><Suspense fallback={<PageLoader />}><Shop /></Suspense></PageTransition>
        } />
        <Route path="/product/:slug" element={
          <PageTransition><Suspense fallback={<PageLoader />}><ProductDetail /></Suspense></PageTransition>
        } />
        <Route path="/cart" element={
          <PageTransition><Suspense fallback={<PageLoader />}><Cart /></Suspense></PageTransition>
        } />
        <Route path="/checkout" element={
          <PageTransition><Suspense fallback={<PageLoader />}><Checkout /></Suspense></PageTransition>
        } />
        <Route path="/order-confirmation" element={
          <PageTransition><Suspense fallback={<PageLoader />}><OrderConfirmation /></Suspense></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition><Suspense fallback={<PageLoader />}><About /></Suspense></PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition><Suspense fallback={<PageLoader />}><Contact /></Suspense></PageTransition>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>
        } />
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<PageLoader />}>
            <AdminGuard><AdminDashboard /></AdminGuard>
          </Suspense>
        } />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function AppLayout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <AppLayout />
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  )
}