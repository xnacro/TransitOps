import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from '../components/theme-provider'
import { loginUser } from '../api/auth.service'

export default function Login({ onLogin }) {
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handler = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const mapRole = (roleId) => ({ 1: 'fleet-manager', 2: 'driver', 3: 'safety-officer', 4: 'financial-analyst', 5: 'admin' })[roleId] || 'admin'

  const demoAccounts = {
    'admin':              { email: 'admin@transitops.com',  password: 'admin123', label: 'Administrator' },
    'fleet-manager':      { email: 'prince@transitops.io',  password: 'admin123', label: 'Fleet Manager' },
    'driver':             { email: 'driver@transitops.in',  password: 'admin123', label: 'Driver' },
    'safety-officer':     { email: 'safety@transitops.in',  password: 'admin123', label: 'Safety Officer' },
    'financial-analyst':  { email: 'analyst@transitops.in', password: 'admin123', label: 'Financial Analyst' },
  }

  // When role selected from dropdown, auto-fill credentials
  const handleRoleChange = (role) => {
    setSelectedRole(role)
    const account = demoAccounts[role]
    if (account) {
      setEmail(account.email)
      setPassword(account.password)
      setError(null)
    }
  }

  const doLogin = async (loginEmail, loginPassword) => {
    setLoading(true); setError(null)
    try {
      const response = await loginUser({ email: loginEmail, password: loginPassword })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError("Please fill in all fields."); return }
    await doLogin(email, password)
  }

  const stats = [
    { value: '28+', label: 'Vehicles', icon: 'fa-truck' },
    { value: '99.2%', label: 'Uptime', icon: 'fa-arrow-trend-up' },
    { value: '₹2.4Cr', label: 'Revenue', icon: 'fa-indian-rupee-sign' },
  ]

  const Sparkline = ({ color }) => (
    <svg viewBox="0 0 60 20" className="w-14 h-5 opacity-40" fill="none">
      <path d="M0,16 L8,12 L16,14 L24,6 L32,10 L40,4 L48,8 L60,5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  const roleOptions = [
    { value: 'admin', label: 'Administrator', icon: 'fa-crown', desc: 'Full system access' },
    { value: 'fleet-manager', label: 'Fleet Manager', icon: 'fa-truck-front', desc: 'Vehicles & operations' },
    { value: 'driver', label: 'Driver', icon: 'fa-route', desc: 'Trips & navigation' },
    { value: 'safety-officer', label: 'Safety Officer', icon: 'fa-shield-halved', desc: 'Compliance & safety' },
    { value: 'financial-analyst', label: 'Financial Analyst', icon: 'fa-chart-column', desc: 'Expenses & reports' },
  ]

  return (
    <div className="fixed inset-0 font-sans overflow-hidden"
      style={{ background: theme === 'dark'
        ? 'linear-gradient(145deg, #08081a 0%, #0e0e30 30%, #0a0a25 60%, #121240 100%)'
        : 'linear-gradient(145deg, #f0f4ff 0%, #e0e7ff 30%, #dbeafe 60%, #ede9fe 100%)' }}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[550px] h-[550px] rounded-full blur-[140px] opacity-20 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: '-12%', left: '-8%', transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.2}px)` }} />
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[120px] opacity-15 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', bottom: '-8%', right: '-5%', transform: `translate(-${mousePos.x * 0.2}px, -${mousePos.y * 0.15}px)` }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[90px] opacity-12 transition-transform duration-[2500ms]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', top: '50%', left: '50%', transform: `translate(-${mousePos.x * 0.12}px, ${mousePos.y * 0.1}px)` }} />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '70px 70px' }} />
      </div>

      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <i className="fa-solid fa-bus text-white text-base"></i>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight leading-none">TransitOps</h1>
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.2em] mt-0.5">Fleet Management Platform</p>
          </div>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 rounded-xl border border-foreground/10 bg-foreground/[0.03] backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all cursor-pointer">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`}></i>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Hero */}
          <div className="flex-1 max-w-[500px] lg:max-w-none space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-foreground/[0.04] border border-foreground/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-foreground/70">All Systems Operational</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Manage Your<br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-400 bg-clip-text text-transparent">Entire Fleet</span><br />
              From One Place
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              Real-time tracking, intelligent dispatching, and comprehensive analytics — unified in one premium dashboard.
            </p>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-4 pt-2">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${s.icon} text-primary text-sm`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-extrabold text-foreground leading-none">{s.value}</p>
                      <Sparkline color={i === 0 ? '#6366f1' : i === 1 ? '#22c55e' : '#f59e0b'} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="w-full max-w-[440px] shrink-0">
            <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/15 p-7 lg:p-8 space-y-5">

              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-foreground tracking-tight">Welcome back</h2>
                <p className="text-sm text-muted-foreground mt-1">Sign in to access your fleet dashboard</p>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  <i className="fa-solid fa-user-shield mr-1.5 text-primary/60"></i>Select Role
                </label>
                <Select onValueChange={handleRoleChange} value={selectedRole}>
                  <SelectTrigger className="h-12 rounded-xl bg-foreground/[0.03] border-foreground/[0.08] text-sm">
                    <SelectValue placeholder="Choose a role to auto-fill credentials..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        <span className="flex items-center gap-2.5">
                          <i className={`fa-solid ${r.icon} text-primary text-xs`}></i>
                          <span className="font-semibold">{r.label}</span>
                          <span className="text-muted-foreground text-xs">— {r.desc}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-foreground/[0.06]"></div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Credentials</span>
                <div className="flex-1 h-px bg-foreground/[0.06]"></div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <i className="fa-solid fa-circle-exclamation text-xs shrink-0"></i><span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative group">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm group-focus-within:text-primary transition-colors"></i>
                    <Input type="email" placeholder="you@transitops.in" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-foreground/[0.03] border-foreground/[0.08] text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative group">
                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-sm group-focus-within:text-primary transition-colors"></i>
                    <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 h-12 rounded-xl bg-foreground/[0.03] border-foreground/[0.08] text-sm placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground cursor-pointer transition-colors">
                      <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white text-base font-semibold cursor-pointer disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all">
                  {loading
                    ? <span className="flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Authenticating...</span>
                    : <span className="flex items-center gap-2"><i className="fa-solid fa-right-to-bracket"></i> Sign In</span>}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-muted-foreground/40 pt-1">
                <i className="fa-solid fa-shield-halved mr-1.5 text-emerald-500/50"></i>
                Protected by end-to-end encryption
              </p>
            </div>

            <p className="text-center text-[10px] text-muted-foreground/25 mt-4">TransitOps © 2026 · Odoo x CHARUSAT Hackathon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
