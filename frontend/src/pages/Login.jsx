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

  const roles = [
    { id: 'admin', label: 'Administrator', icon: 'fa-crown', desc: 'Full system access', gradient: 'from-violet-500 to-purple-600' },
    { id: 'fleet-manager', label: 'Fleet Manager', icon: 'fa-truck-front', desc: 'Vehicles & maintenance', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'driver', label: 'Driver', icon: 'fa-route', desc: 'Trips & navigation', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'safety-officer', label: 'Safety Officer', icon: 'fa-shield-halved', desc: 'Compliance & safety', gradient: 'from-amber-500 to-orange-500' },
    { id: 'financial-analyst', label: 'Financial Analyst', icon: 'fa-chart-column', desc: 'Expenses & reports', gradient: 'from-pink-500 to-rose-500' },
  ]

  const stats = [
    { value: '28+', label: 'Active Vehicles', icon: 'fa-truck' },
    { value: '99.2%', label: 'Fleet Uptime', icon: 'fa-arrow-trend-up' },
    { value: '₹2.4Cr', label: 'Revenue Tracked', icon: 'fa-indian-rupee-sign' },
  ]

  // Mini sparkline SVG
  const Sparkline = ({ color }) => (
    <svg viewBox="0 0 80 24" className="w-16 h-5 opacity-40" fill="none">
      <path d={`M0,18 L10,14 L20,16 L30,8 L40,12 L50,6 L60,10 L70,4 L80,8`} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )

  return (
    <div className="fixed inset-0 flex font-sans overflow-hidden">

      {/* ═══════════════ LEFT — Brand Panel ═══════════════ */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between relative overflow-hidden"
        style={{ background: theme === 'dark'
          ? 'linear-gradient(145deg, #0a0a1a 0%, #111138 35%, #0d0d2b 65%, #151540 100%)'
          : 'linear-gradient(145deg, #eef2ff 0%, #dbeafe 35%, #e0e7ff 65%, #c7d2fe 100%)' }}>

        {/* Parallax orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 transition-transform duration-[2500ms]"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: '-15%', left: '-12%', transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.2}px)` }} />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[110px] opacity-20 transition-transform duration-[2500ms]"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', bottom: '-10%', right: '-8%', transform: `translate(-${mousePos.x * 0.2}px, -${mousePos.y * 0.15}px)` }} />
          <div className="absolute w-[250px] h-[250px] rounded-full blur-[80px] opacity-15 transition-transform duration-[2500ms]"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', top: '45%', left: '55%', transform: `translate(-${mousePos.x * 0.1}px, ${mousePos.y * 0.08}px)` }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-8 xl:p-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <i className="fa-solid fa-bus text-white text-base"></i>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">TransitOps</h1>
              <p className="text-[8px] text-muted-foreground font-semibold uppercase tracking-[0.22em]">Fleet Management Platform</p>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-5 my-auto -mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-semibold text-foreground/80">System Online — All Services Running</span>
            </div>

            <h2 className="text-[2.2rem] xl:text-[2.6rem] font-black text-foreground tracking-tight leading-[1.1]">
              Manage Your<br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-400 bg-clip-text text-transparent">Entire Fleet</span><br />
              From One Place
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Real-time tracking, intelligent dispatching, and comprehensive analytics — unified in one premium dashboard.
            </p>

            {/* Stats with sparklines */}
            <div className="flex gap-3 pt-1">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06]">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${s.icon} text-primary text-xs`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-extrabold text-foreground leading-none">{s.value}</p>
                      <Sparkline color={i === 0 ? '#6366f1' : i === 1 ? '#22c55e' : '#f59e0b'} />
                    </div>
                    <p className="text-[9px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RBAC Cards */}
          <div>
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.2em] mb-2.5">Role-Based Access Control</p>
            <div className="grid grid-cols-5 gap-2">
              {roles.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] hover:border-primary/25 transition-all cursor-default group text-center">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${r.gradient} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-md`}>
                    <i className={`fa-solid ${r.icon} text-white text-xs`}></i>
                  </div>
                  <p className="text-[10px] font-bold text-foreground leading-tight">{r.label}</p>
                  <p className="text-[8px] text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ RIGHT — Login Form ═══════════════ */}
      <div className="flex-1 flex flex-col bg-background relative">
        {/* Theme toggle */}
        <div className="flex items-center justify-end p-5">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`}></i>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 pb-8">
          <div className="w-full max-w-[400px] space-y-6">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-bus text-white text-sm"></i>
              </div>
              <span className="text-lg font-extrabold text-foreground">TransitOps</span>
            </div>

            {/* Header */}
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to access your fleet dashboard</p>
            </div>

            {/* Quick Demo */}
            <div>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.15em] mb-2">Quick Demo Access</p>
              <button onClick={handleDemoLogin} disabled={!!activeDemo}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group disabled:opacity-50">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                  <i className="fa-solid fa-crown text-white text-sm"></i>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-foreground">Login as Admin</p>
                  <p className="text-[10px] text-muted-foreground">admin@transitops.com · Full system access</p>
                </div>
                {activeDemo
                  ? <i className="fa-solid fa-spinner fa-spin text-primary"></i>
                  : <i className="fa-solid fa-arrow-right text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all text-sm"></i>}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.15em]">or sign in manually</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>{error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-1.5 block">Email</label>
                <div className="relative group">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs group-focus-within:text-primary transition-colors"></i>
                  <Input type="email" placeholder="you@transitops.in" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-secondary/40 border-border text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-1.5 block">Password</label>
                <div className="relative group">
                  <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs group-focus-within:text-primary transition-colors"></i>
                  <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-11 h-12 rounded-xl bg-secondary/40 border-border text-sm focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors">
                    <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white text-sm font-semibold cursor-pointer disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all">
                {loading
                  ? <span className="flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Authenticating...</span>
                  : <span className="flex items-center gap-2"><i className="fa-solid fa-right-to-bracket"></i> Sign In</span>}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-1.5">
              <p className="text-xs text-muted-foreground">
                <i className="fa-solid fa-shield-halved mr-1.5 text-emerald-500"></i>
                Protected by end-to-end encryption
              </p>
              <p className="text-[9px] text-muted-foreground/40">TransitOps © 2026 · Odoo x CHARUSAT Hackathon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
