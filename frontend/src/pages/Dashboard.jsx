import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getDashboardStats } from '@/api/dashboard.service'

function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }
const PIE_COLORS = ['#22c55e', '#6366f1', '#f59e0b']

export default function Dashboard({ user }) {
    const [stats, setStats] = useState({
        activeVehicles: 0, availableVehicles: 0, inMaintenance: 0,
        activeTrips: 0, problemTrips: 0, driversOnDuty: 0, fleetUtilization: 0,
        vehicleStatus: [], recentTrips: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const data = await getDashboardStats()
                if (data && typeof data === 'object') {
                    setStats(prev => ({
                        ...prev,
                        ...data,
                        vehicleStatus: Array.isArray(data.vehicleStatus) ? data.vehicleStatus : [],
                        recentTrips: Array.isArray(data.recentTrips) ? data.recentTrips : [],
                    }))
                }
            } catch (err) {
                console.warn("Dashboard API error (token may be missing):", err?.response?.status || err.message)
            }
            finally { setLoading(false) }
        })()
    }, [])

    const totalVehicles = (stats.activeVehicles ?? 0) + (stats.availableVehicles ?? 0) + (stats.inMaintenance ?? 0)

    // 8 KPIs — always visible, 2 rows × 4
    const kpis = [
        { label: 'Total Vehicles', value: totalVehicles, icon: 'fa-truck-front', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Available', value: stats.availableVehicles ?? 0, icon: 'fa-circle-check', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'On Trip', value: stats.activeVehicles ?? 0, icon: 'fa-road', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { label: 'In Maintenance', value: stats.inMaintenance ?? 0, icon: 'fa-wrench', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { label: 'Active Trips', value: stats.activeTrips ?? 0, icon: 'fa-route', color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
        { label: 'Problem Trips', value: stats.problemTrips ?? 0, icon: 'fa-triangle-exclamation', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { label: 'Drivers On Duty', value: stats.driversOnDuty ?? 0, icon: 'fa-id-card', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Fleet Utilization', value: `${stats.fleetUtilization ?? 0}%`, icon: 'fa-gauge-high', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    ]

    const monthlyData = [
        { month: 'Jan', trips: 42, fuel: 28 }, { month: 'Feb', trips: 55, fuel: 35 },
        { month: 'Mar', trips: 38, fuel: 22 }, { month: 'Apr', trips: 72, fuel: 48 },
        { month: 'May', trips: 60, fuel: 38 }, { month: 'Jun', trips: 48, fuel: 30 },
        { month: 'Jul', trips: 68, fuel: 42 }, { month: 'Aug', trips: 85, fuel: 55 },
        { month: 'Sep', trips: 62, fuel: 40 }, { month: 'Oct', trips: 50, fuel: 32 },
        { month: 'Nov', trips: 45, fuel: 28 }, { month: 'Dec', trips: 70, fuel: 45 },
    ]

    const getStatusBadge = (s) => ({ 'In Transit': 'bg-blue-500/15 text-blue-500', 'Completed': 'bg-emerald-500/15 text-emerald-500', 'Cancelled': 'bg-red-500/15 text-red-500' })[s] || 'bg-muted text-muted-foreground'

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
    const roleName = user?.role?.replace(/-/g, ' ') || 'User'
    const userName = user?.name || user?.email?.split('@')[0] || roleName

    // Pie data — use from API or default
    const pieData = stats.vehicleStatus.length > 0 ? stats.vehicleStatus : [
        { name: 'Available', value: stats.availableVehicles || 0 },
        { name: 'On Trip', value: stats.activeVehicles || 0 },
        { name: 'Maintenance', value: stats.inMaintenance || 0 },
    ]
    const hasPieValues = pieData.some(d => d.value > 0)

    return (
        <div className="space-y-6">
            {/* ═══ Welcome Banner ═══ */}
            <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-primary/8 blur-[80px]"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/8 blur-[80px]"></div>
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-muted-foreground font-medium">{greeting} 👋</p>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 capitalize">{userName}</h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">
                                <i className="fa-solid fa-shield-halved text-xs"></i> {roleName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                <i className="fa-regular fa-calendar mr-1.5"></i>
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Fleet Status</p>
                            <p className="text-xl font-bold text-emerald-500">
                                <i className="fa-solid fa-circle text-[8px] mr-2 animate-pulse"></i>Operational
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ KPI Grid — 2 rows × 4 cards (ALWAYS VISIBLE) ═══ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="glass-card rounded-xl p-5 space-y-3">
                        <Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-16" />
                    </div>
                )) : kpis.map((kpi, i) => (
                    <div key={i} className={`glass-card rounded-xl p-5 hover-lift cursor-default border ${kpi.border}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                <i className={`fa-solid ${kpi.icon} ${kpi.color} text-base`}></i>
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-foreground tracking-tight leading-none">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* ═══ Charts ═══ */}
            <div className="grid lg:grid-cols-5 gap-4">
                {/* Area Chart */}
                <div className="lg:col-span-3 glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-chart-area text-primary"></i></div>
                        <div><h3 className="text-lg font-bold text-foreground">Monthly Overview</h3><p className="text-xs text-muted-foreground">Trips vs fuel logs by month</p></div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gTrips" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                                    <linearGradient id="gFuel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                                <Area type="monotone" dataKey="trips" stroke="#6366f1" strokeWidth={2.5} fill="url(#gTrips)" name="Trips" />
                                <Area type="monotone" dataKey="fuel" stroke="#22c55e" strokeWidth={2.5} fill="url(#gFuel)" name="Fuel Logs" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-5 mt-3 px-1">
                        <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-muted-foreground">Trips</span></div>
                        <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-muted-foreground">Fuel Logs</span></div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-2 glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-chart-pie text-primary"></i></div>
                        <div><h3 className="text-lg font-bold text-foreground">Vehicle Status</h3><p className="text-xs text-muted-foreground">Fleet distribution</p></div>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-[200px]"><Skeleton className="w-36 h-36 rounded-full" /></div>
                    ) : hasPieValues ? (
                        <>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" strokeWidth={3} stroke="var(--background)">
                                            {pieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2.5 mt-2">
                                {pieData.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2.5"><div className="w-3.5 h-3.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div><span className="text-muted-foreground">{s.name}</span></div>
                                        <span className="font-bold text-foreground text-base">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                            <i className="fa-solid fa-truck-front text-4xl opacity-15 mb-3"></i>
                            <p className="font-medium">No vehicles added yet</p>
                            <p className="text-xs mt-1 text-muted-foreground/60">Add vehicles to see fleet distribution</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Recent Trips ═══ */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-clock-rotate-left text-primary"></i></div>
                        <div><h3 className="text-lg font-bold text-foreground">Recent Trips</h3><p className="text-xs text-muted-foreground">Last 5 dispatches</p></div>
                    </div>
                    <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1 border-border text-muted-foreground gap-1.5">
                        <i className="fa-solid fa-circle text-emerald-500 text-[6px]"></i> Live
                    </Badge>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            {['Trip', 'Vehicle', 'Driver', 'Status', 'Route'].map((h, i) => (
                                <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i === 0 ? 'pl-5' : ''} ${i === 4 ? 'text-right pr-5' : ''}`}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i} className="border-border">
                                <TableCell className="pl-5"><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                                <TableCell className="pr-5"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                            </TableRow>
                        )) : stats.recentTrips.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-14 text-muted-foreground">
                                <i className="fa-solid fa-inbox text-4xl opacity-15 mb-3 block"></i>
                                <p className="font-medium">No recent trips</p>
                                <p className="text-xs mt-1 text-muted-foreground/60">Trips appear here once dispatched</p>
                            </TableCell></TableRow>
                        ) : stats.recentTrips.map((trip) => (
                            <TableRow key={trip.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold text-foreground font-mono pl-5">TRP-{String(trip.id).padStart(3, '0')}</TableCell>
                                <TableCell className="text-muted-foreground">{trip.vehicle}</TableCell>
                                <TableCell className="text-muted-foreground">{trip.driver}</TableCell>
                                <TableCell><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trip.status)}`}>{trip.status}</span></TableCell>
                                <TableCell className="text-muted-foreground text-right pr-5">{trip.route || '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}