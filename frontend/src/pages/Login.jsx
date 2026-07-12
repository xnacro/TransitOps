import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from '../components/theme-provider'
import { loginUser } from '../api/auth.service'

export default function Login({ onLogin }) {
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeDemo, setActiveDemo] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handler = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const mapRole = (roleId) => ({ 1: 'fleet-manager', 2: 'driver', 3: 'safety-officer', 4: 'financial-analyst', 5: 'admin' })[roleId] || 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError("Please fill in all fields."); return }
    setLoading(true); setError(null)
    try {
      const response = await loginUser({ email, password })
      if (response?.data) {
        const { user, token } = response.data
        const loggedInUser = { ...user, role: mapRole(user.role_id) }
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(loggedInUser))
        onLogin(loggedInUser)
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Invalid credentials or server unavailable.")
    } finally { setLoading(false) }
  }

  const handleDemoLogin = async () => {
    setActiveDemo('Admin'); setError(null)
    try {
      const response = await loginUser({ email: 'admin@transitops.com', password: 'admin123' })
      if (response?.data) {
        const { user, token } = response.data
        const loggedInUser = { ...user, role: mapRole(user.role_id) }
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(loggedInUser))
        onLogin(loggedInUser)
        return
      }
    } catch {}
    setActiveDemo(null)
    setError('Demo login failed. Try manual login.')
  }

  return (
    <div className="fixed inset-0 font-sans overflow-hidden"
      style={{ background: theme === 'dark'
        ? 'linear-gradient(135deg, #0a0a1a 0%, #111133 30%, #0d0d28 60%, #151538 100%)'
        : 'linear-gradient(135deg, #eef2ff 0%, #dbeafe 30%, #e0e7ff 60%, #c7d2fe 100%)' }}>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: '-12%', left: '-8%', transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.2}px)` }} />
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[120px] opacity-15 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', bottom: '-8%', right: '-5%', transform: `translate(-${mousePos.x * 0.2}px, -${mousePos.y * 0.15}px)` }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[90px] opacity-10 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', top: '40%', right: '15%', transform: `translate(-${mousePos.x * 0.12}px, ${mousePos.y * 0.1}px)` }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '70px 70px' }} />
      </div>

      {/* Top bar — logo + theme toggle */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <i className="fa-solid fa-bus text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-foreground tracking-tight leading-none">TransitOps</h1>
            <p className="text-[8px] text-muted-foreground font-semibold uppercase tracking-[0.2em] mt-0.5">Fleet Management Platform</p>
          </div>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all cursor-pointer">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`}></i>
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">

        {/* Hero text */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-semibold text-foreground/80">All Systems Operational</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight mb-2">
            Manage Your{' '}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-400 bg-clip-text text-transparent">Entire Fleet</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Real-time tracking, dispatching, and analytics in one dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {[
            { v: '28+', l: 'Vehicles', i: 'fa-truck' },
            { v: '99.2%', l: 'Uptime', i: 'fa-arrow-trend-up' },
            { v: '₹2.4Cr', l: 'Revenue', i: 'fa-indian-rupee-sign' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
              <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
                <i className={`fa-solid ${s.i} text-primary text-[10px]`}></i>
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground leading-none">{s.v}</p>
                <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider">{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[400px] rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/20 p-6 space-y-5">

          {/* Demo Login */}
          <button onClick={handleDemoLogin} disabled={!!activeDemo}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/12 to-violet-500/12 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group disabled:opacity-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-primary/25">
              <i className="fa-solid fa-crown text-white text-sm"></i>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Login as Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@transitops.com · Full access</p>
            </div>
            {activeDemo ? <i className="fa-solid fa-spinner fa-spin text-primary"></i>
              : <i className="fa-solid fa-arrow-right text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all text-xs"></i>}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]"></div>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.15em]">or sign in</span>
            <div className="flex-1 h-px bg-white/[0.08]"></div>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <i className="fa-solid fa-circle-exclamation text-xs"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-1 block">Email</label>
              <div className="relative group">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs group-focus-within:text-primary transition-colors"></i>
                <Input type="email" placeholder="you@transitops.in" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 rounded-xl bg-white/[0.05] border-white/[0.1] text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-1 block">Password</label>
              <div className="relative group">
                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs group-focus-within:text-primary transition-colors"></i>
                <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11 rounded-xl bg-white/[0.05] border-white/[0.1] text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors">
                  <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white text-sm font-semibold cursor-pointer disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all">
              {loading
                ? <span className="flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Authenticating...</span>
                : <span className="flex items-center gap-2"><i className="fa-solid fa-right-to-bracket"></i> Sign In</span>}
            </Button>
          </form>

          <p className="text-center text-[9px] text-muted-foreground/40">
            <i className="fa-solid fa-shield-halved mr-1 text-emerald-500/50"></i>
            Protected by end-to-end encryption
          </p>
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-5">
          {['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Analyst'].map((r) => (
            <span key={r} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] text-muted-foreground/60 font-medium">{r}</span>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground/25 mt-3">TransitOps © 2026 · Odoo x CHARUSAT Hackathon</p>
      </div>
    </div>
  )
}
