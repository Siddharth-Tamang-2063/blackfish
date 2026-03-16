import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

export default function AdminLogin() {
  const [id, setId]       = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAdmin()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const ok = login(id.trim(), pass)
    if (ok) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin ID or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-disp text-[2.5rem] text-ink tracking-[.1em]">
            BLACK<span className="text-lime"> FISH</span>
          </p>
          <p className="font-mono text-[9px] tracking-[.3em] uppercase text-muted mt-1">/ ADMIN PANEL</p>
        </div>

        {/* Card */}
        <div className="bg-bg2 border border-border p-8">
          <h1 className="font-disp text-[1.8rem] text-ink uppercase tracking-[.04em] mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-2">/ Admin ID</label>
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="Enter admin ID"
                required
                autoFocus
                className="w-full bg-bg3 border-b border-border2 focus:border-lime font-mono text-[12px] text-ink py-2.5 focus:outline-none transition-colors placeholder:text-muted"
              />
            </div>

            <div>
              <label className="block font-mono text-[8px] tracking-[.2em] uppercase text-muted mb-2">/ Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-bg3 border-b border-border2 focus:border-lime font-mono text-[12px] text-ink py-2.5 focus:outline-none transition-colors placeholder:text-muted pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-2.5 text-muted hover:text-lime transition-colors"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {showPass
                      ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></>
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="font-mono text-[9px] text-red tracking-[.08em]"
              >
                ✕ {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-lime text-white font-mono text-[9px] font-bold tracking-[.2em] uppercase hover:bg-[#d4ff5c] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>SIGNING IN...</>
              ) : 'SIGN IN →'}
            </button>
          </form>

          <p className="font-mono text-[8px] text-muted text-center mt-6 tracking-[.1em]">
            RESTRICTED ACCESS — BLACK FISH ADMIN ONLY
          </p>
        </div>

        <p className="font-mono text-[8px] text-center text-muted mt-6 tracking-[.08em]">
          <a href="/" className="hover:text-lime transition-colors">← BACK TO STORE</a>
        </p>
      </motion.div>
    </div>
  )
}
