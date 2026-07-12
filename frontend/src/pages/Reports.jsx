import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getFuelEfficiency, getFleetUtilization, getRevenue, getOperationalCost, exportCsv } from '@/api/report.service'

const formatINR = (a) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a)
function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Reports() {
    const [loading, setLoading] = useState(true); const [exporting, setExporting] = useState(false)
    const [fuelEff, setFuelEff] = useState(null); const [utilization, setUtilization] = useState(null)
    const [revenue, setRevenue] = useState(null); const [opCost, setOpCost] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const [f, u, r, o] = await Promise.allSettled([getFuelEfficiency(), getFleetUtilization(), getRevenue(), getOperationalCost()])
                if (f.status === 'fulfilled') setFuelEff(f.value)
                if (u.status === 'fulfilled') setUtilization(u.value)
                if (r.status === 'fulfilled') setRevenue(r.value)
                if (o.status === 'fulfilled') setOpCost(o.value)
            } catch {} finally { setLoading(false) }
        })()
    }, [])

    const handleExport = async () => {
        setExporting(true)
        try { await exportCsv('operational-cost') } catch { alert('Export not available.') }
        finally { setExporting(false) }
    }

    const kpis = [
        { label: 'Fuel Efficiency', value: fuelEff?.efficiency ? `${fuelEff.efficiency} km/L` : '—', icon: 'fa-gas-pump', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'Fleet Utilization', value: utilization?.utilization ? `${utilization.utilization}%` : '—', icon: 'fa-gauge-high', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Avg Cost / Trip', value: opCost?.avgCostPerTrip ? formatINR(opCost.avgCostPerTrip) : '—', icon: 'fa-indian-rupee-sign', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        { label: 'Total Revenue', value: revenue?.total ? formatINR(revenue.total) : '—', icon: 'fa-chart-line', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    ]

    // Mock data for charts
    const costData = [
        { month: 'Jan', fuel: 32000, maint: 12000, other: 5000 }, { month: 'Feb', fuel: 28000, maint: 8000, other: 6000 },
        { month: 'Mar', fuel: 35000, maint: 15000, other: 4000 }, { month: 'Apr', fuel: 42000, maint: 10000, other: 7000 },
        { month: 'May', fuel: 38000, maint: 18000, other: 5000 }, { month: 'Jun', fuel: 30000, maint: 9000, other: 6000 },
    ]
    const effData = [
        { month: 'Jan', efficiency: 6.2 }, { month: 'Feb', efficiency: 6.5 }, { month: 'Mar', efficiency: 6.1 },
        { month: 'Apr', efficiency: 6.8 }, { month: 'May', efficiency: 6.4 }, { month: 'Jun', efficiency: 7.0 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <Select defaultValue="this-month"><SelectTrigger className="h-10 w-[170px] text-sm rounded-xl border-border"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="this-month">This Month</SelectItem><SelectItem value="last-30">Last 30 Days</SelectItem><SelectItem value="ytd">Year to Date</SelectItem></SelectContent></Select>
                </div>
                <Button onClick={handleExport} disabled={exporting} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5 disabled:opacity-50">
                    {exporting ? <><i className="fa-solid fa-spinner fa-spin"></i> Exporting...</> : <><i className="fa-solid fa-download"></i> Export CSV</>}
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className={`glass-card rounded-xl p-5 hover-lift cursor-default border ${kpi.border}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                <i className={`fa-solid ${kpi.icon} ${kpi.color} text-base`}></i>
                            </div>
                        </div>
                        {loading ? <Skeleton className="h-9 w-20" /> : <p className="text-3xl font-extrabold text-foreground tracking-tight">{kpi.value}</p>}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-chart-column text-primary"></i></div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Cost Breakdown</h3>
                            <p className="text-xs text-muted-foreground">Fuel vs maintenance vs other</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px' }} />
                                <Bar dataKey="fuel" fill="#6366f1" radius={[4, 4, 0, 0]} name="Fuel" stackId="a" />
                                <Bar dataKey="maint" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Maintenance" stackId="a" />
                                <Bar dataKey="other" fill="#22c55e" radius={[4, 4, 0, 0]} name="Other" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-5 mt-3">
                        <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-muted-foreground">Fuel</span></div>
                        <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-muted-foreground">Maintenance</span></div>
                        <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-muted-foreground">Other</span></div>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-chart-line text-primary"></i></div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Fuel Efficiency Trend</h3>
                            <p className="text-xs text-muted-foreground">Average km/L by month</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={effData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[5, 8]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px' }} />
                                <Line type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 5 }} activeDot={{ r: 7 }} name="km/L" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}