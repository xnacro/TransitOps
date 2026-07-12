import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ShieldAlert, KeyRound, Mail, UserCheck } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password || !role) {
      setError("Please fill in all fields and select a role.")
      return
    }

    // Simulating invalid credential check for demo
    if (password === 'wrong') {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 5) {
        setError("Account locked after 5 failed attempts.")
      } else {
        setError("Invalid credentials. Please try again.")
      }
      return
    }

    setError(null)
    onLogin({ email, role })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      {/* Left Pane - Brand Showcase */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-16 bg-slate-200 text-slate-800 border-r border-slate-300">
        <div className="space-y-8">
          {/* Logo & Header */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">TransitOps</h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">Smart Transport Operations Platform</p>
            </div>
          </div>

          {/* Core message */}
          <div className="space-y-6 pt-10">
            <h2 className="text-xl font-bold text-slate-900">One login, four roles:</h2>
            <ul className="space-y-4">
              {[
                { name: "Fleet Manager", desc: "Manage vehicles and shop maintenance scheduling." },
                { name: "Dispatcher", desc: "Access the dashboard and dispatch trips in real-time." },
                { name: "Safety Officer", desc: "Oversee driver registries and compliance audits." },
                { name: "Financial Analyst", desc: "Monitor fuel expenses and build financial reports." }
              ].map((r, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">{r.name}</span>
                    <p className="text-sm text-slate-600 mt-0.5">{r.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
          TransitOps © 2026 - RBAC v1.0
        </div>
      </div>

      {/* Right Pane - Authentication Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-zinc-950 p-8 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Sign in to your account</h2>
            <p className="text-sm text-zinc-400">Enter your credentials to continue</p>
          </div>

          {/* Error State Banner */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start space-x-3 animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Error state</span>
                <p className="text-xs mt-1 text-destructive/90">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <Input
                type="email"
                placeholder="Manager@Transitops.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Role Profile
              </label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                  <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="safety-officer">Safety Officer</SelectItem>
                  <SelectItem value="financial-analyst">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox and Forgot Password link */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-zinc-800 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                <label htmlFor="remember" className="text-zinc-400 select-none text-xs font-medium cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#forgot" className="text-xs text-amber-500 hover:text-amber-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 rounded-lg transition-colors">
              Sign In
            </Button>
          </form>

          {/* Access Control Helper Box */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Access is scoped by role after login</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-zinc-500">
              <div>
                <span className="font-semibold text-zinc-400">Fleet Manager</span>
                <p className="mt-0.5">• Fleet, Maintenance</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-400">Dispatcher</span>
                <p className="mt-0.5">• Dashboard, Trips</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-400">Safety Officer</span>
                <p className="mt-0.5">• Drivers, Compliance</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-400">Financial Analyst</span>
                <p className="mt-0.5">• Fuel Expenses, Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
