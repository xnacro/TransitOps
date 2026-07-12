import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, X } from 'lucide-react'
import { getTrips, createTrip } from '@/api/trip.service'
import { getVehicles } from '@/api/vehicle.service'
import { getDrivers } from '@/api/driver.service'

export default function Trips() {
    const [trips, setTrips] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false)
    const [source, setSource] = useState("Gandhinagar Depot")
    const [destination, setDestination] = useState("")
    const [vehicleId, setVehicleId] = useState("")
    const [driverId, setDriverId] = useState("")
    const [cargoWeight, setCargoWeight] = useState("")
    const [plannedDistance, setPlannedDistance] = useState("")

    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripsData, vehiclesData, driversData] = await Promise.all([
                    getTrips(),
                    getVehicles(),
                    getDrivers()
                ])
                if (tripsData && Array.isArray(tripsData)) setTrips(tripsData)
                if (vehiclesData && Array.isArray(vehiclesData)) {
                    setVehicles(vehiclesData)
                    if (vehiclesData.length > 0) setVehicleId(String(vehiclesData[0].id))
                }
                if (driversData && Array.isArray(driversData)) {
                    setDrivers(driversData)
                    if (driversData.length > 0) setDriverId(String(driversData[0].id))
                }
            } catch {
                console.error("Failed to fetch trips data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        if (!source || !destination || !cargoWeight || !plannedDistance) return

        const payload = {
            source: source.trim(),
            destination: destination.trim(),
            vehicle_id: vehicleId ? Number(vehicleId) : null,
            driver_id: driverId ? Number(driverId) : null,
            cargo_weight: Number(cargoWeight),
            planned_distance: Number(plannedDistance),
            status: "Draft"
        }

        try {
            const created = await createTrip(payload)
            setTrips([created, ...trips])
            setIsOpen(false)
            setSource("Gandhinagar Depot"); setDestination(""); setVehicleId(""); setDriverId(""); setCargoWeight(""); setPlannedDistance("")
        } catch (error) {
            const serverMessage = error.response?.data?.message || error.message;
            alert(`Failed to save trip: ${serverMessage}`)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'Dispatched': return 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 border-blue-500/25'
            case 'Draft': return 'bg-zinc-500/15 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/25'
            case 'Cancelled': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20 border-red-500/25'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-[160px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Status: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">Status: All</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="dispatched">Dispatched</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search trips..." className="pl-9 bg-card border-border h-9 text-xs" />
                    </div>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Create Trip
                </Button>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">ID</TableHead>
                            <TableHead className="text-xs">SOURCE</TableHead>
                            <TableHead className="text-xs">DESTINATION</TableHead>
                            <TableHead className="text-xs">VEHICLE</TableHead>
                            <TableHead className="text-xs">DRIVER</TableHead>
                            <TableHead className="text-xs">CARGO (kg)</TableHead>
                            <TableHead className="text-xs">DISTANCE (km)</TableHead>
                            <TableHead className="text-xs">STATUS</TableHead>
                            <TableHead className="text-xs text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.id} className="border-border">
                                <TableCell className="font-semibold text-sm">TRP-{String(trip.id).padStart(3, '0')}</TableCell>
                                <TableCell className="text-sm">{trip.source}</TableCell>
                                <TableCell className="text-sm font-semibold">{trip.destination}</TableCell>
                                <TableCell className="text-sm">{trip.vehicle_reg || `V-${trip.vehicle_id}`}</TableCell>
                                <TableCell className="text-sm">{trip.driver_name || `D-${trip.driver_id}`}</TableCell>
                                <TableCell className="text-sm">{trip.cargo_weight ? Number(trip.cargo_weight).toLocaleString('en-IN') : '—'}</TableCell>
                                <TableCell className="text-sm">{trip.planned_distance || '—'}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(trip.status)}`}>
                                        {trip.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Dialog Overlay for Create Trip */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Create New Trip</h3>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Source</label>
                                    <Input placeholder="e.g. Gandhinagar Depot" value={source} onChange={(e) => setSource(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Destination</label>
                                    <Input placeholder="e.g. Warehouse A" value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                    <Select onValueChange={setVehicleId} value={vehicleId}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs">
                                            <SelectValue placeholder="Select vehicle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((v) => {
                                                const label = v.status !== 'Available' 
                                                    ? `${v.registration_number} (${v.status})` 
                                                    : v.registration_number;
                                                return (
                                                    <SelectItem key={v.id} value={String(v.id)}>
                                                        {label}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Driver</label>
                                    <Select onValueChange={setDriverId} value={driverId}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs">
                                            <SelectValue placeholder="Select driver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map((d) => {
                                                const isExpired = new Date(d.license_expiry) < new Date();
                                                const statusText = d.status !== 'Available' ? d.status : (isExpired ? 'License Expired' : '');
                                                const label = statusText ? `${d.name} (${statusText})` : d.name;
                                                return (
                                                    <SelectItem key={d.id} value={String(d.id)}>
                                                        {label}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cargo Weight (kg)</label>
                                    <Input type="number" placeholder="e.g. 500" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Planned Distance (km)</label>
                                    <Input type="number" placeholder="e.g. 120" value={plannedDistance} onChange={(e) => setPlannedDistance(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4">
                                Save as Draft
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}