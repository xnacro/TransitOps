import React from 'react'
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
import { Search, Plus } from 'lucide-react'

export default function Trips() {
    const trips = [
        { id: "TRP-101", destination: "Warehouse A", vehicle: "Van-05", driver: "Alex Johnson", status: "Completed" },
        { id: "TRP-102", destination: "Port Terminal", vehicle: "Trk-12", driver: "Maria Garcia", status: "Dispatched" },
        { id: "TRP-103", destination: "City Center", vehicle: "Van-02", driver: "Linda Chen", status: "Draft" },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'
            case 'Dispatched': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20'
            case 'Draft': return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20'
            case 'Cancelled': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search trips..." className="pl-8 bg-card border-border" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Create Trip
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Trip ID</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.id} className="border-border">
                                <TableCell className="font-medium">{trip.id}</TableCell>
                                <TableCell>{trip.destination}</TableCell>
                                <TableCell>{trip.vehicle}</TableCell>
                                <TableCell>{trip.driver}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(trip.status)}>
                                        {trip.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}