import React, { useState } from 'react'
import { useTheme } from './theme-provider'
import { Input } from './ui/input'
import api from '../api/axios'

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

    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hi! I am TransitBot, your TransitOps virtual assistant. Ask me anything about managing vehicles, drivers, trips, or reports!', timestamp: new Date() }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const handleSendMessage = async (textToSend = inputText) => {
        const text = textToSend.trim()
        if (!text) return

        const userMsg = { id: Date.now(), sender: 'user', text, timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        try {
            const chatHistory = messages.map(m => ({ sender: m.sender, text: m.text }))
            const response = await api.post('/chat', {
                message: text,
                history: chatHistory
            })
            const reply = response.data?.reply || "I'm sorry, I didn't receive a response."
            const botReply = { id: Date.now() + 1, sender: 'bot', text: reply, timestamp: new Date() }
            setMessages(prev => [...prev, botReply])
        } catch (error) {
            console.error("Chat error:", error)
            const errMsg = error.response?.data?.error || "I'm sorry, I couldn't connect to my AI server. Please make sure the backend is running."
            const botReply = { id: Date.now() + 1, sender: 'bot', text: errMsg, timestamp: new Date() }
            setMessages(prev => [...prev, botReply])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background font-sans relative">
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
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                        >
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`}></i>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {user?.role ? user.role.charAt(0).toUpperCase() : 'U'}
                            </button>
                            {userMenuOpen && (
                                <>
                                    {/* Click outside overlay */}
                                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-3 py-2 border-b border-border">
                                            <p className="text-xs font-semibold text-foreground capitalize truncate">
                                                {user?.role?.replace('-', ' ') || 'User'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
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

            {/* ═══ Floating Chatbot Button & Widget ═══ */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Chatbot Window */}
                {isChatOpen && (
                    <div className="w-[360px] sm:w-[400px] h-[520px] bg-card/90 border border-border rounded-2xl shadow-2xl flex flex-col backdrop-blur-md overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-200">
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8.5 h-8.5 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/10">
                                    <i className="fa-solid fa-robot text-sm"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground leading-tight">TransitBot</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground self-end rounded-tr-none'
                                            : 'bg-secondary text-foreground self-start rounded-tl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="bg-secondary text-foreground self-start rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex gap-1 items-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            )}
                        </div>

                        {/* Quick Suggestion Chips */}
                        <div className="px-4 py-2 border-t border-border flex flex-wrap gap-1.5 bg-secondary/10 shrink-0">
                            {[
                                "Dispatch a trip?",
                                "Maintenance rules?",
                                "Reports summary?"
                            ].map((chipText, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(chipText)}
                                    className="text-[10px] font-medium bg-background border border-border hover:bg-secondary hover:text-foreground text-muted-foreground px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                                >
                                    {chipText}
                                </button>
                            ))}
                        </div>

                        {/* Footer Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="p-3 border-t border-border flex gap-2 bg-secondary/20 shrink-0"
                        >
                            <Input
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="h-10 rounded-xl bg-background border-border text-xs flex-1"
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                            >
                                <i className="fa-solid fa-paper-plane text-xs"></i>
                            </button>
                        </form>
                    </div>
                )}

                {/* FAB Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/30 transition-all duration-250 flex items-center justify-center cursor-pointer relative"
                    title="TransitOps Assistant"
                >
                    {isChatOpen ? (
                        <i className="fa-solid fa-chevron-down text-lg"></i>
                    ) : (
                        <>
                            <i className="fa-solid fa-robot text-lg"></i>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-primary-foreground animate-pulse"></span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}