import React, { useState } from 'react'
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

function App() {
  const [user, setUser] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    // Bypass login if URL is /dashboard or contains ?bypass=true
    if (window.location.pathname === '/dashboard' || searchParams.get('bypass') === 'true') {
      return { email: 'admin@transitops.com', role: 'admin' }
    }
    return null
  })
  const [activePage, setActivePage] = useState('dashboard')

  const roleDefaults = {
    'fleet-manager': 'vehicles',
    'dispatcher': 'dashboard',
    'safety-officer': 'drivers',
    'financial-analyst': 'fuel'
  }

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    const defaultPage = roleDefaults[loggedInUser.role] || 'dashboard'
    setActivePage(defaultPage)
  }

  const handleLogout = () => {
    window.history.pushState({}, '', '/')
    setUser(null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'vehicles': return <Vehicles />
      case 'drivers': return <Drivers />
      case 'trips': return <Trips />
      case 'maintenance': return <Maintenance />
      case 'fuel': return <Fuel />
      case 'reports': return <Reports />
      default:
        return (
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center h-full text-muted-foreground">
            {activePage.replace('-', ' ')} view is under development.
          </div>
        )
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="transitops-ui-theme">
      <MainLayout activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout}>
        {renderPage()}
      </MainLayout>
    </ThemeProvider>
  )
}

export default App