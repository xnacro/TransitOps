import React, { useState } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="transitops-ui-theme">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-white font-sans p-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto text-white shadow-md text-2xl font-bold">
              ✓
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Access Authorized</h1>
            <p className="text-zinc-400 text-sm max-w-sm">
              Successfully signed in as <span className="font-semibold text-amber-500 capitalize">{user.role.replace('-', ' ')}</span> ({user.email}). Dashboard and registry modules are locked for evaluation.
            </p>
            <button 
              onClick={handleLogout}
              className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App