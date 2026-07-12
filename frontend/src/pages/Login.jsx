import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ShieldAlert, KeyRound, Mail, UserCheck, Truck, Route, Users, DollarSign, Sun, Moon } from 'lucide-react'
import { useTheme } from '../components/theme-provider'

import { loginUser } from '../api/auth.service'

export default function Login({ onLogin }) {
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in email and password fields.")
      return
    }

    try {
      setError(null)
      // Attempt backend authentication
      const response = await loginUser({ email, password })
      if (response && response.data) {
        const { user, token } = response.data
        
        // Map backend roles to frontend role names
        const roleMapping = {
          1: 'fleet-manager',
          2: 'driver',
          3: 'safety-officer',
          4: 'financial-analyst'
        }
        
        const mappedRole = roleMapping[user.role_id] || 'fleet-manager'
        const loggedInUser = { ...user, role: mappedRole }

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(loggedInUser))
        onLogin(loggedInUser)
        return
      }
    } catch (apiError) {
      console.warn("Backend auth failed or unavailable, checking mock bypass", apiError)
      
      // Fallback: If mock login details are provided, log in without token (uses mock data fallback in pages)
      if (role) {
        setError(null)
        const mockUser = { email, role }
        localStorage.setItem("user", JSON.stringify(mockUser))
        onLogin(mockUser)
        return
      } else {
        setError(apiError.response?.data?.message || "Invalid credentials or backend unavailable.")
        return
      }
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-white dark:bg-zinc-950">
      {/* Left Pane - Brand Showcase */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-slate-100 via-zinc-200 to-slate-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-slate-950 text-zinc-800 dark:text-zinc-100 border-r border-slate-200 dark:border-zinc-800/80 overflow-y-auto">
        <div className="space-y-6 lg:space-y-8">
          {/* Logo & Header */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-600/20 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">TransitOps</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold mt-1 uppercase tracking-wider">Smart Transport Operations Platform</p>
            </div>
          </div>

          {/* Core message */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-850 dark:text-zinc-100">Role-Based Fleet Control</h2>
              <p className="text-xs text-zinc-655 dark:text-zinc-400 max-w-md leading-relaxed">
                Log in to automatically load the specialized workspace custom-tailored to your division's daily workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  name: "Fleet Manager",
                  desc: "Vehicle profiles, diagnostics, and shop schedules.",
                  icon: Truck,
                  color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                },
                {
                  name: "Driver",
                  desc: "Assigned trips, route navigation, and trip status updates.",
                  icon: Route,
                  color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                },
                {
                  name: "Safety Officer",
                  desc: "Driver licenses, safety metrics, and compliance checks.",
                  icon: Users,
                  color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                },
                {
                  name: "Financial Analyst",
                  desc: "Fuel expenses, toll logs, and monthly cost reporting.",
                  icon: DollarSign,
                  color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                }
              ].map((r, idx) => {
                const Icon = r.icon
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-3.5 p-3 rounded-xl bg-white/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 dark:bg-zinc-900/40 dark:border-zinc-800/60 dark:hover:bg-zinc-900/60 dark:hover:border-zinc-700/60 transition-all duration-300"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${r.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{r.name}</span>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-widest uppercase mt-6">
          TransitOps © 2026 - RBAC v1.0
        </div>
      </div>

      {/* Right Pane - Authentication Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-zinc-950 p-6 sm:p-10 md:p-12 overflow-y-auto relative">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-4 right-4 p-2 rounded-md border border-slate-200 hover:bg-slate-100 text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="w-full max-w-md space-y-6 py-6">
          {/* Header */}
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Sign in to your account</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your credentials to continue</p>
          </div>

          {/* Error State Banner */}
          {error && (
            <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start space-x-2.5 animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Error state</span>
                <p className="text-[11px] mt-0.5 text-destructive/90">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email
              </label>
              <Input
                type="email"
                placeholder="Manager@Transitops.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-200 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-650 h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3 w-3" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-200 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-650 h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3 w-3" /> Role Profile
              </label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-zinc-900 focus:border-amber-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 h-9 text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                  <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="safety-officer">Safety Officer</SelectItem>
                  <SelectItem value="financial-analyst">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox and Forgot Password link */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 dark:border-zinc-800 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 h-4 w-4" />
                <label htmlFor="remember" className="text-zinc-550 dark:text-zinc-400 select-none text-[11px] font-medium cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#forgot" className="text-[11px] text-amber-600 hover:text-amber-500 dark:text-amber-500 dark:hover:text-amber-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs mt-2 cursor-pointer">
              Sign In
            </Button>
          </form>

          {/* Access Control Helper Box */}
          <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-200/80 dark:bg-zinc-900/50 dark:border-zinc-900 space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
              <span>Access is scoped by role after login</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-zinc-500">
              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-400">Fleet Manager</span>
                <p className="mt-0.5 text-[9px]">• Fleet, Maintenance</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-400">Driver</span>
                <p className="mt-0.5 text-[9px]">• Dashboard, Trips</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-400">Safety Officer</span>
                <p className="mt-0.5 text-[9px]">• Drivers, Compliance</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-700 dark:text-zinc-400">Financial Analyst</span>
                <p className="mt-0.5 text-[9px]">• Fuel Expenses, Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
