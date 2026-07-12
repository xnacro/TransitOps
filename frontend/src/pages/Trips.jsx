import React, { useState } from 'react'
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

export default function Trips() {
    const [trips, setTrips] = useState([
        { id: "TRP-101", destination: "Warehouse A", vehicle: "Van-05", driver: "Alex Johnson", status: "Completed" },
        { id: "TRP-102", destination: "Port Terminal", vehicle: "Trk-12", driver: "Maria Garcia", status: "Dispatched" },
        { id: "TRP-103", destination: "City Center", vehicle: "Van-02", driver: "Linda Chen", status: "Draft" },
    ])

    const [isOpen, setIsOpen] = useState(false)
    const [destination, setDestination] = useState("")
    const [vehicle, setVehicle] = useState("Van-05")
    const [driver, setDriver] = useState("Alex Johnson")
    const [status, setStatus] = useState("Draft")

    const handleSave = (e) => {
        e.preventDefault()
        if (!destination || !vehicle || !driver || !status) return

        const newTrip = {
            id: `TRP-10${trips.length + 1}`,
            destination: destination.trim(),
            vehicle,
            driver,
            status
        }

        setTrips([newTrip, ...trips])
        setIsOpen(false)

        // Reset fields
        setDestination("")
        setVehicle("Van-05")
        setDriver("Alex Johnson")
        setStatus("Draft")
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
                            <TableHead className="text-xs">Trip ID</TableHead>
                            <TableHead className="text-xs">Destination</TableHead>
                            <TableHead className="text-xs">Vehicle</TableHead>
                            <TableHead className="text-xs">Driver</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{trip.id}</TableCell>
                                <TableCell className="text-sm font-semibold">{trip.destination}</TableCell>
                                <TableCell className="text-sm">{trip.vehicle}</TableCell>
                                <TableCell className="text-sm">{trip.driver}</TableCell>
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
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Create New Trip</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Destination</label>
                                <Input 
                                    placeholder="e.g. Warehouse B, Port Terminal" 
                                    value={destination} 
                                    onChange={(e) => setDestination(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Assign</label>
                                <Select onValueChange={setVehicle} value={vehicle}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Van-05">Van-05</SelectItem>
                                        <SelectItem value="Trk-12">Trk-12</SelectItem>
                                        <SelectItem value="Van-02">Van-02</SelectItem>
                                        <SelectItem value="Trk-08">Trk-08</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Driver Assign</label>
                                <Select onValueChange={setDriver} value={driver}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                                        <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
                                        <SelectItem value="Linda Chen">Linda Chen</SelectItem>
                                        <SelectItem value="James Smith">James Smith</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Initial Status</label>
                                <Select onValueChange={setStatus} value={status}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Dispatched">Dispatched</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4"
                            >
                                Dispatch / Save Trip
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}