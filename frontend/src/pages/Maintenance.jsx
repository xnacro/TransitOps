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
import { Search, Plus, X, AlertTriangle } from 'lucide-react'
import { getMaintenanceLogs, createMaintenance } from '@/api/maintenance.service'

const MOCK_LOGS = [
    { id: 1, vehicle_id: 3, vehicle_reg: "GJO1UB1120", description: "Oil Change", garage: "AutoFix Garage", cost: 2500, start_date: "2026-07-07", status: "Open" },
    { id: 2, vehicle_id: 2, vehicle_reg: "GJO1UB9981", description: "Engine Repair", garage: "Metro Motors", cost: 18000, start_date: "2026-06-25", completion_date: "2026-07-01", status: "Closed" },
    { id: 3, vehicle_id: 3, vehicle_reg: "GJO1UB1120", description: "Tyre Replace", garage: "QuickFit", cost: 6200, start_date: "2026-05-14", status: "Open" },
]

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function Maintenance() {
    const [logs, setLogs] = useState(MOCK_LOGS)
    const [isLoading, setIsLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false)
    const [vehicleReg, setVehicleReg] = useState("GJO1UB4521")
    const [description, setDescription] = useState("")
    const [garage, setGarage] = useState("")
    const [cost, setCost] = useState("")
    const [startDate, setStartDate] = useState("")
    const [status, setStatus] = useState("Open")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMaintenanceLogs()
                if (data && Array.isArray(data)) setLogs(data)
            } catch {
                // Backend not available — keep mock data
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        if (!vehicleReg || !description || !cost || !startDate) return

        const payload = {
            vehicle_id: null, // Will be resolved by backend from reg number
            vehicle_reg: vehicleReg,
            description: description.trim(),
            garage: garage.trim(),
            cost: Number(cost),
            start_date: startDate,
            status
        }

        try {
            const created = await createMaintenance(payload)
            setLogs([created, ...logs])
        } catch {
            setLogs([{ id: Date.now(), ...payload }, ...logs])
        }

        setIsOpen(false)
        setVehicleReg("GJO1UB4521"); setDescription(""); setGarage(""); setCost(""); setStartDate(""); setStatus("Open")
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Closed': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'Open': return 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/25'
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
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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
                            <TableHead className="text-xs">ID</TableHead>
                            <TableHead className="text-xs">VEHICLE</TableHead>
                            <TableHead className="text-xs">DESCRIPTION</TableHead>
                            <TableHead className="text-xs">GARAGE</TableHead>
                            <TableHead className="text-xs">COST</TableHead>
                            <TableHead className="text-xs">START DATE</TableHead>
                            <TableHead className="text-xs">STATUS</TableHead>
                            <TableHead className="text-xs text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-border">
                                <TableCell className="font-semibold text-sm">MNT-{String(log.id).padStart(3, '0')}</TableCell>
                                <TableCell className="text-sm">{log.vehicle_reg || `V-${log.vehicle_id}`}</TableCell>
                                <TableCell className="text-sm">{log.description}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{log.garage || '—'}</TableCell>
                                <TableCell className="text-sm">{formatINR(log.cost)}</TableCell>
                                <TableCell className="text-sm">{log.start_date}</TableCell>
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
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Log Service Record</h3>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                <Select onValueChange={setVehicleReg} value={vehicleReg}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GJO1UB4521">GJO1UB4521 — Ford Transit</SelectItem>
                                        <SelectItem value="GJO1UB9981">GJO1UB9981 — Volvo FH16</SelectItem>
                                        <SelectItem value="GJO1UB1120">GJO1UB1120 — Suzuki Mini</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                                <Input placeholder="e.g. Oil Change, Brake Repair" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Garage</label>
                                    <Input placeholder="e.g. AutoFix Garage" value={garage} onChange={(e) => setGarage(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cost (₹)</label>
                                    <Input type="number" placeholder="e.g. 2500" value={cost} onChange={(e) => setCost(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                                    <Select onValueChange={setStatus} value={status}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4">
                                Save Record
                            </Button>
                        </form>

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