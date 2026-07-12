import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTrips, createTrip } from '@/api/trip.service'
import { getVehicles } from '@/api/vehicle.service'
import { getDrivers } from '@/api/driver.service'

function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Trips() {
    const [trips, setTrips] = useState([]); const [vehicles, setVehicles] = useState([]); const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true); const [isOpen, setIsOpen] = useState(false)
    const [source, setSource] = useState("Gandhinagar Depot"); const [destination, setDestination] = useState("")
    const [vehicleId, setVehicleId] = useState(""); const [driverId, setDriverId] = useState("")
    const [cargoWeight, setCargoWeight] = useState(""); const [plannedDistance, setPlannedDistance] = useState("")
    const [saving, setSaving] = useState(false); const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const [t, v, d] = await Promise.allSettled([getTrips(), getVehicles(), getDrivers()])
                if (t.status === 'fulfilled' && Array.isArray(t.value)) setTrips(t.value)
                if (v.status === 'fulfilled' && Array.isArray(v.value)) setVehicles(v.value)
                if (d.status === 'fulfilled' && Array.isArray(d.value)) setDrivers(d.value)
            } catch {} finally { setLoading(false) }
        })()
    }, [])

    const resetForm = () => { setSource("Gandhinagar Depot"); setDestination(""); setVehicleId(""); setDriverId(""); setCargoWeight(""); setPlannedDistance(""); setError(null) }

    const handleSave = async (e) => {
        e.preventDefault(); setError(null)
        if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) { setError("All fields are required."); return }
        setSaving(true)
        try {
            const created = await createTrip({ source: source.trim(), destination: destination.trim(), vehicle_id: Number(vehicleId), driver_id: Number(driverId), cargo_weight: Number(cargoWeight), planned_distance: Number(plannedDistance), status: "Draft" })
            setTrips([created, ...trips]); setIsOpen(false); resetForm()
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to create trip.")
        } finally { setSaving(false) }
    }

    const statusBadge = (s) => ({ 'Completed': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', 'Dispatched': 'bg-blue-500/15 text-blue-600 dark:text-blue-400', 'Draft': 'bg-zinc-500/15 text-zinc-500', 'Cancelled': 'bg-red-500/15 text-red-600 dark:text-red-400' })[s] || 'bg-muted text-muted-foreground'

    // Filter available vehicles and drivers for new trip
    const availableVehicles = vehicles.filter(v => v.status === 'Available' || !v.status)
    const availableDrivers = drivers.filter(d => d.status === 'Available' || !d.status)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="relative"><i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"></i>
                        <Input placeholder="Search trips..." className="pl-9 h-10 w-64 text-sm rounded-xl bg-secondary/50 border-border" /></div>
                    <Select defaultValue="all"><SelectTrigger className="h-10 w-[140px] text-sm rounded-xl border-border"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="dispatched">Dispatched</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select>
                </div>
                <Button onClick={() => { resetForm(); setIsOpen(true) }} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5">
                    <i className="fa-solid fa-plus"></i> Create Trip
                </Button>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['ID', 'Source', 'Destination', 'Vehicle', 'Driver', 'Cargo', 'Distance', 'Status', ''].map((h, i) => (
                            <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i === 8 ? 'text-right' : ''}`}>{h}</TableHead>
                        ))}</TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border">{Array.from({ length: 9 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                        )) : trips.length === 0 ? (
                            <TableRow><TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                                <i className="fa-solid fa-route text-4xl opacity-15 mb-3 block"></i>
                                <p className="font-medium">No trips yet</p>
                            </TableCell></TableRow>
                        ) : trips.map((t) => (
                            <TableRow key={t.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold text-foreground font-mono">TRP-{String(t.id).padStart(3, '0')}</TableCell>
                                <TableCell className="text-muted-foreground">{t.source}</TableCell>
                                <TableCell className="font-medium text-foreground">{t.destination}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{t.vehicle_reg || `V-${t.vehicle_id}`}</TableCell>
                                <TableCell className="text-muted-foreground">{t.driver_name || `D-${t.driver_id}`}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{t.cargo_weight ? `${Number(t.cargo_weight).toLocaleString()} kg` : '—'}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{t.planned_distance ? `${t.planned_distance} km` : '—'}</TableCell>
                                <TableCell><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(t.status)}`}>{t.status}</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-xs cursor-pointer rounded-lg h-8"><i className="fa-solid fa-ellipsis mr-1.5"></i>Manage</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-route text-primary"></i> Create Trip</h3>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}
                        <form onSubmit={handleSave} className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Source *</label><Input placeholder="Gandhinagar Depot" value={source} onChange={(e) => setSource(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Destination *</label><Input placeholder="Warehouse A" value={destination} onChange={(e) => setDestination(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vehicle *</label>
                                    <Select onValueChange={setVehicleId} value={vehicleId}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                        <SelectContent>{(availableVehicles.length > 0 ? availableVehicles : vehicles).map(v => <SelectItem key={v.id} value={String(v.id)}>{v.registration_number}</SelectItem>)}</SelectContent></Select></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Driver *</label>
                                    <Select onValueChange={setDriverId} value={driverId}><SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border"><SelectValue placeholder="Select driver" /></SelectTrigger>
                                        <SelectContent>{(availableDrivers.length > 0 ? availableDrivers : drivers).map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cargo Weight (kg) *</label><Input type="number" placeholder="500" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Distance (km) *</label><Input type="number" placeholder="120" value={plannedDistance} onChange={(e) => setPlannedDistance(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save as Draft</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}