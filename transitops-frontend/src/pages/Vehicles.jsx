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

export default function Vehicles() {
    // Mock data representing the vehicle registry
    const vehicles = [
        { id: "Van-05", model: "Ford Transit", type: "Van", capacity: "500 kg", odometer: "45,200 km", status: "Available" },
        { id: "Trk-12", model: "Volvo FH16", type: "Truck", capacity: "25000 kg", odometer: "128,400 km", status: "On Trip" },
        { id: "Trk-08", model: "Scania R500", type: "Truck", capacity: "20000 kg", odometer: "210,000 km", status: "In Shop" },
        { id: "Van-02", model: "Mercedes Sprinter", type: "Van", capacity: "800 kg", odometer: "89,100 km", status: "Available" },
        { id: "Trk-01", model: "MAN TGX", type: "Truck", capacity: "18000 kg", odometer: "450,000 km", status: "Retired" },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'
            case 'On Trip': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20'
            case 'In Shop': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20'
            case 'Retired': return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search vehicles..." className="pl-8 bg-card border-border" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Registration</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Odometer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id} className="border-border">
                                <TableCell className="font-medium">{vehicle.id}</TableCell>
                                <TableCell>{vehicle.model}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell>{vehicle.capacity}</TableCell>
                                <TableCell>{vehicle.odometer}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                                        {vehicle.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        Edit
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