import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMaintenanceLogs, createMaintenance } from '@/api/maintenance.service'
import { getVehicles } from '@/api/vehicle.service'

const formatINR = (a) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a)
function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Maintenance() {
    const [logs, setLogs] = useState([]); const [vehicles, setVehicles] = useState([]); const [loading, setLoading] = useState(true); const [isOpen, setIsOpen] = useState(false)
    const [vehicleId, setVehicleId] = useState(""); const [description, setDescription] = useState("")
    const [garage, setGarage] = useState(""); const [cost, setCost] = useState(""); const [startDate, setStartDate] = useState("")
    const [saving, setSaving] = useState(false); const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const [l, v] = await Promise.all([getMaintenanceLogs(), getVehicles()])
                if (Array.isArray(l)) setLogs(l)
                if (Array.isArray(v)) setVehicles(v)
            } catch {} finally { setLoading(false) }
        })()
    }, [])

    const resetForm = () => { setVehicleId(""); setDescription(""); setGarage(""); setCost(""); setStartDate(""); setError(null) }

    const handleSave = async (e) => {
        e.preventDefault(); setError(null)
        if (!vehicleId || !description || !garage || !cost) { setError("Vehicle, description, garage, and cost are required."); return }
        setSaving(true)
        try {
            const created = await createMaintenance({ vehicle_id: Number(vehicleId), description: description.trim(), garage: garage.trim(), cost: Number(cost), start_date: startDate || undefined })
            setLogs([created, ...logs]); setIsOpen(false); resetForm()
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to save record.")
        } finally { setSaving(false) }
    }

    const statusBadge = (s) => s === 'Closed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="relative"><i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"></i>
                        <Input placeholder="Search logs..." className="pl-9 h-10 w-64 text-sm rounded-xl bg-secondary/50 border-border" /></div>
                </div>
                <Button onClick={() => { resetForm(); setIsOpen(true) }} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5">
                    <i className="fa-solid fa-plus"></i> Log Maintenance
                </Button>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['ID', 'Vehicle', 'Description', 'Garage', 'Cost', 'Date', 'Status', ''].map((h, i) => (
                            <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i === 7 ? 'text-right' : ''}`}>{h}</TableHead>
                        ))}</TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border">{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>
                        )) : logs.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                                <i className="fa-solid fa-wrench text-4xl opacity-15 mb-3 block"></i>
                                <p className="font-medium">No maintenance records</p>
                            </TableCell></TableRow>
                        ) : logs.map((log) => (
                            <TableRow key={log.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold text-foreground font-mono">MNT-{String(log.id).padStart(3, '0')}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{log.vehicle_reg || `V-${log.vehicle_id}`}</TableCell>
                                <TableCell className="text-muted-foreground">{log.description}</TableCell>
                                <TableCell className="text-muted-foreground">{log.garage || '—'}</TableCell>
                                <TableCell className="font-medium text-foreground">{formatINR(log.cost)}</TableCell>
                                <TableCell className="text-muted-foreground">{log.start_date || '—'}</TableCell>
                                <TableCell><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(log.status)}`}>{log.status}</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-xs cursor-pointer rounded-lg h-8"><i className="fa-solid fa-eye mr-1.5"></i>View</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-wrench text-primary"></i> Log Service</h3>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}
                        <form onSubmit={handleSave} className="space-y-3.5">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vehicle *</label>
                                <Select onValueChange={setVehicleId} value={vehicleId}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                    <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={String(v.id)}>{v.registration_number} — {v.make} {v.model}</SelectItem>)}</SelectContent></Select></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description *</label><Input placeholder="Oil change, brake repair..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Garage *</label><Input placeholder="AutoFix" value={garage} onChange={(e) => setGarage(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cost (₹) *</label><Input type="number" placeholder="2500" value={cost} onChange={(e) => setCost(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Start Date</label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save Record</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}