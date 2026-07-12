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

export default function Maintenance() {
    const maintenanceLogs = [
        { id: "MNT-001", vehicle: "Trk-08", issue: "Engine Diagnostics", date: "2026-07-10", cost: "$450", status: "In Progress" },
        { id: "MNT-002", vehicle: "Van-05", issue: "Oil Change & Filters", date: "2026-06-25", cost: "$120", status: "Completed" },
        { id: "MNT-003", vehicle: "Trk-12", issue: "Brake Pad Replacement", date: "2026-05-14", cost: "$850", status: "Completed" },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'
            case 'In Progress': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search maintenance logs..." className="pl-8 bg-card border-border" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Log Maintenance
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Log ID</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Reported Issue</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {maintenanceLogs.map((log) => (
                            <TableRow key={log.id} className="border-border">
                                <TableCell className="font-medium">{log.id}</TableCell>
                                <TableCell>{log.vehicle}</TableCell>
                                <TableCell>{log.issue}</TableCell>
                                <TableCell>{log.date}</TableCell>
                                <TableCell>{log.cost}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(log.status)}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        View
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