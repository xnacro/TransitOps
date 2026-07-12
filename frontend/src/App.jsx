import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Maintenance from './pages/Maintenance'
import Fuel from './pages/Fuel'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { loginUser } from './api/auth.service'

function App() {
  const [user, setUser] = useState(() => {
    // If there's a token AND user in localStorage, restore session
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (token && savedUser) {
      try { return JSON.parse(savedUser) } catch { return null }
    }
    // No valid session — clear any stale data
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    return null
  })
  const [activePage, setActivePage] = useState('dashboard')
  const [booting, setBooting] = useState(false)

  // Auto-login for bypass mode (/dashboard or ?bypass=true)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const shouldBypass = window.location.pathname === '/dashboard' || searchParams.get('bypass') === 'true'

    if (shouldBypass && !user) {
      setBooting(true)
      loginUser({ email: 'admin@transitops.com', password: 'admin123' })
        .then(response => {
          if (response?.data) {
            const { user: apiUser, token } = response.data
            const loggedInUser = { ...apiUser, role: mapRole(apiUser.role_id) }
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(loggedInUser))
            setUser(loggedInUser)
          }
        })
        .catch(() => {
          const mockUser = { email: 'admin@transitops.com', role: 'admin', name: 'Admin' }
          setUser(mockUser)
        })
        .finally(() => setBooting(false))
    }
  }, [])

  const mapRole = (roleId) => {
    const mapping = { 1: 'fleet-manager', 2: 'driver', 3: 'safety-officer', 4: 'financial-analyst', 5: 'admin' }
    return mapping[roleId] || 'admin'
  }

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setActivePage('dashboard')
  }

  const handleLogout = () => {
    window.history.pushState({}, '', '/')
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard user={user} />
      case 'vehicles': return <Vehicles />
      case 'drivers': return <Drivers />
      case 'trips': return <Trips />
      case 'maintenance': return <Maintenance />
      case 'fuel': return <Fuel />
      case 'reports': return <Reports />
      case 'settings': return <Settings />
      default:
        return (
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center h-full text-muted-foreground">
            {activePage.replace('-', ' ')} view is under development.
          </div>
        )
    }
  }

  if (booting) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="transitops-ui-theme">
        <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-3">
            <i className="fa-solid fa-spinner fa-spin text-primary text-3xl"></i>
            <p className="text-sm text-muted-foreground font-medium">Signing in...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="transitops-ui-theme">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainLayout activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout}>
          <div key={activePage} className="page-enter">
            {renderPage()}
          </div>
        </MainLayout>
      )}
    </ThemeProvider>
  )
}

export default App