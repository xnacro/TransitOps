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

export default function Drivers() {
    const drivers = [
        { id: "D-01", name: "Alex Johnson", license: "Class A", expiry: "2026-10-15", score: "98", status: "Available" },
        { id: "D-02", name: "Maria Garcia", license: "Class B", expiry: "2027-02-20", score: "95", status: "On Trip" },
        { id: "D-03", name: "James Smith", license: "Class A", expiry: "2026-08-01", score: "72", status: "Off Duty" },
        { id: "D-04", name: "Linda Chen", license: "Class A", expiry: "2026-05-11", score: "88", status: "Available" },
        { id: "D-05", name: "Robert Taylor", license: "Class C", expiry: "2025-12-01", score: "45", status: "Suspended" },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'
            case 'On Trip': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20'
            case 'Off Duty': return 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20'
            case 'Suspended': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search drivers..." className="pl-8 bg-card border-border" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Driver
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Driver ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>License Class</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Safety Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id} className="border-border">
                                <TableCell className="font-medium">{driver.id}</TableCell>
                                <TableCell>{driver.name}</TableCell>
                                <TableCell>{driver.license}</TableCell>
                                <TableCell>{driver.expiry}</TableCell>
                                <TableCell>{driver.score}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(driver.status)}>
                                        {driver.status}
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