import React from 'react'
import { useTheme } from './theme-provider'
import {
    LayoutDashboard,
    Truck,
    Users,
    Route,
    Wrench,
    Fuel,
    DollarSign,
    Sun,
    Moon
} from 'lucide-react'

export default function MainLayout({ children, activePage, setActivePage, user, onLogout }) {
    const { theme, setTheme } = useTheme()

    const roleNavs = {
        'admin': ['dashboard', 'vehicles', 'drivers', 'trips', 'maintenance', 'fuel', 'reports'],
        'fleet-manager': ['vehicles', 'maintenance'],
        'dispatcher': ['dashboard', 'trips'],
        'safety-officer': ['drivers'],
        'financial-analyst': ['fuel', 'reports']
    }

    const allNavItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'vehicles', name: 'Vehicles', icon: Truck },
        { id: 'drivers', name: 'Drivers', icon: Users },
        { id: 'trips', name: 'Trips/Dispatch', icon: Route },
        { id: 'maintenance', name: 'Maintenance', icon: Wrench },
        { id: 'fuel', name: 'Fuel & Expenses', icon: Fuel },
        { id: 'reports', name: 'Reports', icon: DollarSign },
    ]

    // Filter nav items based on user role
    const allowedIds = roleNavs[user?.role] || []
    const navItems = allNavItems.filter(item => allowedIds.includes(item.id))

    return (
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
            <aside className="w-64 border-r border-border bg-card flex flex-col justify-between">
                <div>
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <span className="text-xl font-bold text-primary tracking-tight">TransitOps</span>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activePage === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActivePage(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </button>
                            )
                        })}
                        {navItems.length === 0 && (
                            <p className="text-xs text-muted-foreground p-4 text-center">No assigned modules.</p>
                        )}
                    </nav>
                </div>
                <div className="p-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm uppercase">
                            {user?.role ? user.role.split('-').map(w => w[0]).join('') : 'U'}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold capitalize">{user?.role?.replace('-', ' ') || 'User'}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email || 'user@transitops.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-xs text-muted-foreground hover:text-destructive font-semibold transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b border-border bg-card flex items-center justify-between px-8">
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">
                        {(() => {
                            const pageTitles = {
                                'dashboard': 'Dashboard',
                                'vehicles': 'Vehicle Registry',
                                'drivers': 'Drivers',
                                'trips': 'Trips/Dispatch',
                                'maintenance': 'Maintenance',
                                'fuel': 'Fuel & Expenses',
                                'reports': 'Reports'
                            };
                            return pageTitles[activePage] || activePage;
                        })()}
                    </h1>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-md border border-border hover:bg-accent transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
                    {children}
                </main>
            </div>
        </div>
    )
}