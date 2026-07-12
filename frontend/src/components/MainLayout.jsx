import React, { useState } from 'react'
import { useTheme } from './theme-provider'

export default function MainLayout({ children, activePage, setActivePage, user, onLogout }) {
    const { theme, setTheme } = useTheme()
    const [collapsed, setCollapsed] = useState(false)

    const roleNavs = {
        'admin': ['dashboard', 'vehicles', 'drivers', 'trips', 'maintenance', 'fuel', 'reports', 'settings'],
        'fleet-manager': ['vehicles', 'maintenance'],
        'dispatcher': ['dashboard', 'trips'],
        'safety-officer': ['drivers'],
        'financial-analyst': ['fuel', 'reports']
    }

    const allNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
        { id: 'vehicles', label: 'Vehicles', icon: 'fa-solid fa-truck-front' },
        { id: 'drivers', label: 'Drivers', icon: 'fa-solid fa-id-card' },
        { id: 'trips', label: 'Trips', icon: 'fa-solid fa-route' },
        { id: 'maintenance', label: 'Maintenance', icon: 'fa-solid fa-wrench' },
        { id: 'fuel', label: 'Fuel & Expenses', icon: 'fa-solid fa-gas-pump' },
        { id: 'reports', label: 'Reports', icon: 'fa-solid fa-chart-pie' },
        { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
    ]

    const allowedIds = roleNavs[user?.role] || []
    const navItems = allNavItems.filter(item => allowedIds.includes(item.id))

    const titles = {
        dashboard: 'Dashboard',
        vehicles: 'Vehicle Registry',
        drivers: 'Driver Management',
        trips: 'Trip Dispatch',
        maintenance: 'Maintenance Logs',
        fuel: 'Fuel & Expenses',
        reports: 'Reports & Analytics',
        settings: 'Settings'
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
            {/* ═══ Sidebar ═══ */}
            <aside
                className={`flex flex-col h-full border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
            >
                {/* Brand */}
                <div className={`h-16 flex items-center border-b border-border shrink-0 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-bus text-primary-foreground text-sm"></i>
                        </div>
                        {!collapsed && (
                            <span className="text-[15px] font-bold text-foreground tracking-tight truncate">
                                TransitOps
                            </span>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em] px-3 mb-2">
                            Menu
                        </p>
                    )}
                    {navItems.map((item) => {
                        const active = activePage === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                title={collapsed ? item.label : undefined}
                                className={`w-full flex items-center rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150
                                    ${collapsed ? 'justify-center h-10 px-0' : 'gap-3 h-10 px-3'}
                                    ${active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <i className={`${item.icon} w-4 text-center text-[13px] ${active ? 'text-primary' : ''}`}></i>
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t border-border p-2.5 space-y-1.5">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center h-8 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                    >
                        <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'} text-xs`}></i>
                    </button>

                    <div className={`flex items-center ${collapsed ? 'flex-col gap-1.5' : 'gap-3 px-2'}`}>
                        <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                            {user?.role ? user.role.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground capitalize truncate">
                                    {user?.role?.replace('-', ' ') || 'User'}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</p>
                            </div>
                        )}
                        <button
                            onClick={onLogout}
                            title="Sign Out"
                            className={`p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ${collapsed ? '' : 'ml-auto'}`}
                        >
                            <i className="fa-solid fa-right-from-bracket text-xs"></i>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ Main ═══ */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/80 glass shrink-0 z-20">
                    <div>
                        <h1 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                            {titles[activePage] || activePage}
                        </h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer relative">
                            <i className="fa-solid fa-bell text-sm"></i>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive"></span>
                        </button>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                        >
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`}></i>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ml-1 cursor-default">
                            {user?.role ? user.role.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="max-w-[1440px] mx-auto p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}