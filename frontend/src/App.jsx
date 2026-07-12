import React, { useState } from 'react'
import { ThemeProvider } from './components/theme-provider'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    window.history.pushState({}, '', '/')
    setUser(null)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="transitops-ui-theme">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainLayout activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout}>
          <Dashboard />
        </MainLayout>
      )}
    </ThemeProvider>
  )
}

export default App