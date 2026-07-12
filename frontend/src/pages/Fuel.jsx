import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getFuelLogs, createFuelLog } from '@/api/fuellog.service'
import { getExpenses, createExpense } from '@/api/expense.service'
import { getVehicles } from '@/api/vehicle.service'

const formatINR = (a) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a)
function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Fuel() {
    const [fuelLogs, setFuelLogs] = useState([]); const [expenses, setExpenses] = useState([]); const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true); const [isFuelOpen, setIsFuelOpen] = useState(false); const [isExpOpen, setIsExpOpen] = useState(false)
    // Fuel form — vehicle_id as dropdown
    const [fuelVehicleId, setFuelVehicleId] = useState(""); const [fuelDate, setFuelDate] = useState(""); const [fuelLiters, setFuelLiters] = useState("")
    const [fuelCost, setFuelCost] = useState(""); const [fuelStation, setFuelStation] = useState("")
    const [fuelSaving, setFuelSaving] = useState(false); const [fuelError, setFuelError] = useState(null)
    // Expense form
    const [expVehicleId, setExpVehicleId] = useState(""); const [expCategory, setExpCategory] = useState("Toll")
    const [expDesc, setExpDesc] = useState(""); const [expAmount, setExpAmount] = useState(""); const [expDate, setExpDate] = useState("")
    const [expSaving, setExpSaving] = useState(false); const [expError, setExpError] = useState(null)

    const totalFuel = fuelLogs.reduce((s, i) => s + Number(i.fuel_cost || 0), 0)
    const totalExp = expenses.reduce((s, i) => s + Number(i.amount || 0), 0)

    const chartData = fuelLogs.slice(0, 12).map((log, i) => ({
        name: log.date ? log.date.substring(5) : `#${i + 1}`, fuel: Number(log.fuel_cost) || 0
    })).reverse()

    useEffect(() => {
        (async () => {
            try {
                const [f, e, v] = await Promise.allSettled([getFuelLogs(), getExpenses(), getVehicles()])
                if (f.status === 'fulfilled' && Array.isArray(f.value)) setFuelLogs(f.value)
                if (e.status === 'fulfilled' && Array.isArray(e.value)) setExpenses(e.value)
                if (v.status === 'fulfilled' && Array.isArray(v.value)) setVehicles(v.value)
            } catch {} finally { setLoading(false) }
        })()
    }, [])

    const handleFuelSave = async (e) => {
        e.preventDefault(); setFuelError(null)
        if (!fuelVehicleId || !fuelLiters || !fuelCost || !fuelStation) { setFuelError("Vehicle, litres, cost, and station are required."); return }
        setFuelSaving(true)
        try {
            const created = await createFuelLog({ vehicle_id: Number(fuelVehicleId), liters: Number(fuelLiters), fuel_cost: Number(fuelCost), fuel_station: fuelStation.trim(), date: fuelDate || undefined })
            setFuelLogs([created, ...fuelLogs]); setIsFuelOpen(false)
            setFuelVehicleId(""); setFuelDate(""); setFuelLiters(""); setFuelCost(""); setFuelStation(""); setFuelError(null)
        } catch (err) { setFuelError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to save fuel log.") }
        finally { setFuelSaving(false) }
    }

    const handleExpSave = async (e) => {
        e.preventDefault(); setExpError(null)
        if (!expVehicleId || !expCategory || !expAmount) { setExpError("Vehicle, category, and amount are required."); return }
        setExpSaving(true)
        try {
            const created = await createExpense({ vehicle_id: Number(expVehicleId), category: expCategory, description: expDesc.trim(), amount: Number(expAmount), date: expDate || undefined })
            setExpenses([created, ...expenses]); setIsExpOpen(false)
            setExpVehicleId(""); setExpCategory("Toll"); setExpDesc(""); setExpAmount(""); setExpDate(""); setExpError(null)
        } catch (err) { setExpError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to save expense.") }
        finally { setExpSaving(false) }
    }

    return (
        <div className="space-y-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Fuel Cost', value: formatINR(totalFuel), icon: 'fa-gas-pump', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Total Expenses', value: formatINR(totalExp), icon: 'fa-receipt', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { label: 'Grand Total', value: formatINR(totalFuel + totalExp), icon: 'fa-calculator', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                ].map((c, i) => (
                    <div key={i} className={`glass-card rounded-xl p-5 hover-lift cursor-default border ${c.border}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}><i className={`fa-solid ${c.icon} ${c.color} text-lg`}></i></div>
                            <div><p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{c.label}</p><p className="text-2xl font-extrabold text-foreground">{c.value}</p></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-chart-column text-primary"></i></div>
                        <div><h3 className="text-lg font-bold text-foreground">Fuel Cost Trend</h3><p className="text-xs text-muted-foreground">Recent fuel costs</p></div>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '13px' }} />
                                <Bar dataKey="fuel" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Cost (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Button onClick={() => { setFuelError(null); setIsFuelOpen(true) }} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5"><i className="fa-solid fa-plus"></i> Log Fuel</Button>
                <Button onClick={() => { setExpError(null); setIsExpOpen(true) }} variant="outline" className="h-10 rounded-xl text-sm cursor-pointer gap-2 px-5 border-border"><i className="fa-solid fa-plus"></i> Add Expense</Button>
            </div>

            {/* Fuel Logs Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-2"><i className="fa-solid fa-gas-pump text-primary"></i><span className="text-base font-bold text-foreground">Fuel Logs</span></div>
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['Vehicle', 'Date', 'Litres', 'Cost', 'Station'].map((h, i) => <TableHead key={i} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{h}</TableHead>)}
                    </TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <TableRow key={i} className="border-border">{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>)
                        : fuelLogs.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground"><i className="fa-solid fa-gas-pump text-3xl opacity-15 mb-2 block"></i>No fuel logs</TableCell></TableRow>
                        : fuelLogs.map(l => (
                            <TableRow key={l.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold font-mono">{l.vehicle_reg || `V-${l.vehicle_id}`}</TableCell>
                                <TableCell className="text-muted-foreground">{l.date || '—'}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{l.liters} L</TableCell>
                                <TableCell className="font-medium">{formatINR(l.fuel_cost)}</TableCell>
                                <TableCell className="text-muted-foreground">{l.fuel_station || '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Expenses Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-2"><i className="fa-solid fa-receipt text-accent"></i><span className="text-base font-bold text-foreground">Other Expenses</span></div>
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['Vehicle', 'Category', 'Description', 'Amount', 'Date'].map((h, i) => <TableHead key={i} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{h}</TableHead>)}
                    </TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <TableRow key={i} className="border-border">{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>)
                        : expenses.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground"><i className="fa-solid fa-receipt text-3xl opacity-15 mb-2 block"></i>No expenses</TableCell></TableRow>
                        : expenses.map(exp => (
                            <TableRow key={exp.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold font-mono">{exp.vehicle_reg || `V-${exp.vehicle_id}`}</TableCell>
                                <TableCell className="text-muted-foreground">{exp.category}</TableCell>
                                <TableCell className="text-muted-foreground">{exp.description || '—'}</TableCell>
                                <TableCell className="font-medium">{formatINR(exp.amount)}</TableCell>
                                <TableCell className="text-muted-foreground">{exp.date || '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Fuel Modal */}
            {isFuelOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsFuelOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-gas-pump text-primary"></i> Log Fuel</h3>
                            <button onClick={() => setIsFuelOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {fuelError && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{fuelError}</div>}
                        <form onSubmit={handleFuelSave} className="space-y-3.5">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vehicle *</label>
                                <Select onValueChange={setFuelVehicleId} value={fuelVehicleId}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                    <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={String(v.id)}>{v.registration_number}</SelectItem>)}</SelectContent></Select></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Litres *</label><Input type="number" placeholder="42" value={fuelLiters} onChange={(e) => setFuelLiters(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cost (₹) *</label><Input type="number" placeholder="3150" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Station *</label><Input placeholder="HP Pump" value={fuelStation} onChange={(e) => setFuelStation(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label><Input type="date" value={fuelDate} onChange={(e) => setFuelDate(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <Button type="submit" disabled={fuelSaving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {fuelSaving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {isExpOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsExpOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-receipt text-accent"></i> Add Expense</h3>
                            <button onClick={() => setIsExpOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {expError && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{expError}</div>}
                        <form onSubmit={handleExpSave} className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vehicle *</label>
                                    <Select onValueChange={setExpVehicleId} value={expVehicleId}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                        <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={String(v.id)}>{v.registration_number}</SelectItem>)}</SelectContent></Select></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category *</label>
                                    <Select onValueChange={setExpCategory} value={expCategory}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Toll">Toll</SelectItem><SelectItem value="Parking">Parking</SelectItem><SelectItem value="Insurance">Insurance</SelectItem><SelectItem value="Repair">Repair</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
                            </div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label><Input placeholder="Highway toll" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (₹) *</label><Input type="number" placeholder="340" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label><Input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <Button type="submit" disabled={expSaving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {expSaving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
