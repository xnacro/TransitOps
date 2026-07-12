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
import { Search, Plus, X, AlertTriangle } from 'lucide-react'

export default function Maintenance() {
    const [logs, setLogs] = useState([
        { id: "MNT-001", vehicle: "VAN-05", issue: "Oil Change", date: "2026-07-07", cost: "$2,500", status: "In Shop" },
        { id: "MNT-002", vehicle: "TRUCK-11", issue: "Engine Repair", date: "2026-06-25", cost: "$18,000", status: "Completed" },
        { id: "MNT-003", vehicle: "MINI-03", issue: "Tyre Replace", date: "2026-05-14", cost: "$6,200", status: "In Shop" },
    ])

    const [isOpen, setIsOpen] = useState(false)
    const [vehicle, setVehicle] = useState("VAN-05")
    const [issue, setIssue] = useState("Oil Change")
    const [cost, setCost] = useState("2500")
    const [date, setDate] = useState("2026-07-07")
    const [status, setStatus] = useState("In Shop")

    const handleSave = (e) => {
        e.preventDefault()
        if (!vehicle || !issue || !cost || !date || !status) return

        const formattedCost = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(cost)

        const newLog = {
            id: `MNT-00${logs.length + 1}`,
            vehicle,
            issue,
            date,
            cost: formattedCost,
            status
        }

        setLogs([newLog, ...logs])
        setIsOpen(false)

        // Reset fields
        setVehicle("VAN-05")
        setIssue("Oil Change")
        setCost("2500")
        setDate("2026-07-07")
        setStatus("In Shop")
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'In Shop': return 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/25'
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
                            <SelectItem value="in-shop">In Shop</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search logs..." className="pl-9 bg-card border-border h-9 text-xs" />
                    </div>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Log Maintenance
                </Button>
            </div>

            {/* Service Log Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">Log ID</TableHead>
                            <TableHead className="text-xs">Vehicle</TableHead>
                            <TableHead className="text-xs">Service</TableHead>
                            <TableHead className="text-xs">Date</TableHead>
                            <TableHead className="text-xs">Cost</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{log.id}</TableCell>
                                <TableCell className="text-sm">{log.vehicle}</TableCell>
                                <TableCell className="text-sm">{log.issue}</TableCell>
                                <TableCell className="text-sm">{log.date}</TableCell>
                                <TableCell className="text-sm">{log.cost}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(log.status)}`}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Dialog Overlay for Log Maintenance */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Log Service Record</h3>
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
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                <Select onValueChange={setVehicle} value={vehicle}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VAN-05">VAN-05</SelectItem>
                                        <SelectItem value="TRUCK-11">TRUCK-11</SelectItem>
                                        <SelectItem value="MINI-03">MINI-03</SelectItem>
                                        <SelectItem value="VAN-09">VAN-09</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Service Type</label>
                                <Input 
                                    placeholder="e.g. Oil Change, Brake Repair" 
                                    value={issue} 
                                    onChange={(e) => setIssue(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cost ($)</label>
                                <Input 
                                    type="number"
                                    placeholder="2500" 
                                    value={cost} 
                                    onChange={(e) => setCost(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                                <Input 
                                    type="date"
                                    value={date} 
                                    onChange={(e) => setDate(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                                <Select onValueChange={setStatus} value={status}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In Shop">In Shop</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4"
                            >
                                Save Record
                            </Button>
                        </form>

                        {/* Modal Workflow Notes */}
                        <div className="pt-3 border-t border-border space-y-1.5 text-[9px] text-muted-foreground leading-relaxed">
                            <div className="flex items-center space-x-1 font-semibold text-[10px] text-amber-500">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span>Lifecycle Status Rules:</span>
                            </div>
                            <p>• <span className="font-semibold text-foreground">Available</span> → creating record → <span className="font-semibold text-amber-500">In Shop</span></p>
                            <p>• <span className="font-semibold text-amber-500">In Shop</span> → closing record → <span className="font-semibold text-green-500">Available</span></p>
                            <p className="italic mt-1 text-zinc-500">* Note: In Shop vehicles are automatically removed from the dispatch pool.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}