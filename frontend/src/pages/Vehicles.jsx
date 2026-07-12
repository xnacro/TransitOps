import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVehicles, createVehicle } from '@/api/vehicle.service'

function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]); const [loading, setLoading] = useState(true); const [isOpen, setIsOpen] = useState(false)
    const [regNo, setRegNo] = useState(""); const [make, setMake] = useState(""); const [model, setModel] = useState("")
    const [year, setYear] = useState(String(new Date().getFullYear()))
    const [type, setType] = useState("Van"); const [capacity, setCapacity] = useState(""); const [fuelType, setFuelType] = useState("Diesel")
    const [odometer, setOdometer] = useState(""); const [status, setStatus] = useState("Available")
    const [saving, setSaving] = useState(false); const [error, setError] = useState(null)

    useEffect(() => { (async () => { try { const d = await getVehicles(); if (Array.isArray(d)) setVehicles(d) } catch {} finally { setLoading(false) } })() }, [])

    const resetForm = () => { setRegNo(""); setMake(""); setModel(""); setYear(String(new Date().getFullYear())); setType("Van"); setCapacity(""); setFuelType("Diesel"); setOdometer(""); setStatus("Available"); setError(null) }

    const handleSave = async (e) => {
        e.preventDefault(); setError(null)
        if (!regNo || !make || !model || !year || !type || !capacity) { setError("All fields are required."); return }
        setSaving(true)
        try {
            const created = await createVehicle({
                registration_number: regNo.toUpperCase().trim(), make: make.trim(), model: model.trim(),
                year: Number(year), type, capacity: Number(capacity), fuel_type: fuelType,
                odometer: Number(odometer || 0), status
            })
            setVehicles([created, ...vehicles]); setIsOpen(false); resetForm()
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to save vehicle.")
        } finally { setSaving(false) }
    }

    const statusBadge = (s) => ({ 'Available': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', 'On Trip': 'bg-blue-500/15 text-blue-600 dark:text-blue-400', 'In Shop': 'bg-amber-500/15 text-amber-600 dark:text-amber-400', 'Retired': 'bg-red-500/15 text-red-600 dark:text-red-400' })[s] || 'bg-muted text-muted-foreground'

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="relative"><i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"></i>
                        <Input placeholder="Search vehicles..." className="pl-9 h-10 w-64 text-sm rounded-xl bg-secondary/50 border-border" /></div>
                    <Select defaultValue="all"><SelectTrigger className="h-10 w-[140px] text-sm rounded-xl border-border"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="available">Available</SelectItem><SelectItem value="on-trip">On Trip</SelectItem><SelectItem value="in-shop">In Shop</SelectItem></SelectContent></Select>
                </div>
                <Button onClick={() => { resetForm(); setIsOpen(true) }} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5">
                    <i className="fa-solid fa-plus"></i> Add Vehicle
                </Button>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['Reg. No.', 'Make / Model', 'Year', 'Type', 'Capacity', 'Fuel', 'Odometer', 'Status', ''].map((h, i) => (
                            <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i === 8 ? 'text-right' : ''}`}>{h}</TableHead>
                        ))}</TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border">{Array.from({ length: 9 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>
                        )) : vehicles.length === 0 ? (
                            <TableRow><TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                                <i className="fa-solid fa-truck-front text-4xl opacity-15 mb-3 block"></i>
                                <p className="font-medium">No vehicles yet</p><p className="text-xs mt-1 text-muted-foreground/60">Add your first vehicle to get started</p>
                            </TableCell></TableRow>
                        ) : vehicles.map((v) => (
                            <TableRow key={v.id || v.registration_number} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold text-foreground font-mono">{v.registration_number}</TableCell>
                                <TableCell className="text-muted-foreground">{v.make} {v.model}</TableCell>
                                <TableCell className="text-muted-foreground">{v.year || '—'}</TableCell>
                                <TableCell className="text-muted-foreground">{v.type}</TableCell>
                                <TableCell className="text-muted-foreground">{v.capacity >= 1000 ? `${(v.capacity/1000).toFixed(v.capacity%1000===0?0:1)}T` : `${v.capacity}kg`}</TableCell>
                                <TableCell className="text-muted-foreground">{v.fuel_type}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{Number(v.odometer).toLocaleString('en-IN')} km</TableCell>
                                <TableCell><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(v.status)}`}>{v.status}</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-xs cursor-pointer rounded-lg h-8"><i className="fa-solid fa-pen-to-square mr-1.5"></i>Edit</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-truck-front text-primary"></i> Add Vehicle</h3>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}
                        <form onSubmit={handleSave} className="space-y-3.5">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Registration No. *</label><Input placeholder="GJ01UB4521" value={regNo} onChange={(e) => setRegNo(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Make *</label><Input placeholder="Ford" value={make} onChange={(e) => setMake(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Model *</label><Input placeholder="Transit" value={model} onChange={(e) => setModel(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Year *</label><Input type="number" placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type *</label><Select onValueChange={setType} value={type}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Van">Van</SelectItem><SelectItem value="Truck">Truck</SelectItem><SelectItem value="Mini">Mini</SelectItem><SelectItem value="Bus">Bus</SelectItem></SelectContent></Select></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuel</label><Select onValueChange={setFuelType} value={fuelType}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Petrol">Petrol</SelectItem><SelectItem value="CNG">CNG</SelectItem><SelectItem value="Electric">Electric</SelectItem></SelectContent></Select></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Capacity (kg) *</label><Input type="number" placeholder="5000" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Odometer (km)</label><Input type="number" placeholder="74000" value={odometer} onChange={(e) => setOdometer(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save Vehicle</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
