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

export default function Drivers() {
    const [drivers, setDrivers] = useState([
        { id: "D-01", name: "Alex Johnson", license: "Class A", expiry: "2026-10-15", score: "98", status: "Available" },
        { id: "D-02", name: "Maria Garcia", license: "Class B", expiry: "2027-02-20", score: "95", status: "On Trip" },
        { id: "D-03", name: "James Smith", license: "Class A", expiry: "2026-08-01", score: "72", status: "Off Duty" },
        { id: "D-04", name: "Linda Chen", license: "Class A", expiry: "2026-05-11", score: "88", status: "Available" },
        { id: "D-05", name: "Robert Taylor", license: "Class C", expiry: "2025-12-01", score: "45", status: "Suspended" },
    ])

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState("")
    const [license, setLicense] = useState("Class A")
    const [expiry, setExpiry] = useState("")
    const [score, setScore] = useState("100")
    const [status, setStatus] = useState("Available")

    const handleSave = (e) => {
        e.preventDefault()
        if (!name || !license || !expiry || !score || !status) return

        const newDriver = {
            id: `D-0${drivers.length + 1}`,
            name: name.trim(),
            license,
            expiry,
            score: score.trim(),
            status
        }

        setDrivers([newDriver, ...drivers])
        setIsOpen(false)

        // Reset fields
        setName("")
        setLicense("Class A")
        setExpiry("")
        setScore("100")
        setStatus("Available")
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'On Trip': return 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 border-blue-500/25'
            case 'Off Duty': return 'bg-zinc-500/15 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/25'
            case 'Suspended': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20 border-red-500/25'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="all-classes">
                        <SelectTrigger className="w-[170px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="License: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-classes">License: All</SelectItem>
                            <SelectItem value="class-a">Class A</SelectItem>
                            <SelectItem value="class-b">Class B</SelectItem>
                            <SelectItem value="class-c">Class C</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-[140px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Status: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">Status: All</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="on-trip">On Trip</SelectItem>
                            <SelectItem value="off-duty">Off Duty</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search drivers..." className="pl-9 bg-card border-border h-9 text-xs" />
                    </div>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Add Driver
                </Button>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">Driver ID</TableHead>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">License Class</TableHead>
                            <TableHead className="text-xs">Expiry Date</TableHead>
                            <TableHead className="text-xs">Safety Score</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{driver.id}</TableCell>
                                <TableCell className="text-sm font-semibold">{driver.name}</TableCell>
                                <TableCell className="text-sm">{driver.license}</TableCell>
                                <TableCell className="text-sm">{driver.expiry}</TableCell>
                                <TableCell className="text-sm">{driver.score}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(driver.status)}`}>
                                        {driver.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Dialog Overlay for Add Driver */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Add New Driver</h3>
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
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Driver Name</label>
                                <Input 
                                    placeholder="e.g. Alex Johnson" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">License Class</label>
                                <Select onValueChange={setLicense} value={license}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Class A">Class A</SelectItem>
                                        <SelectItem value="Class B">Class B</SelectItem>
                                        <SelectItem value="Class C">Class C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">License Expiry Date</label>
                                <Input 
                                    type="date"
                                    value={expiry} 
                                    onChange={(e) => setExpiry(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Safety Score (1-100)</label>
                                <Input 
                                    type="number"
                                    min="1"
                                    max="100"
                                    placeholder="e.g. 95" 
                                    value={score} 
                                    onChange={(e) => setScore(e.target.value)} 
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
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="On Trip">On Trip</SelectItem>
                                        <SelectItem value="Off Duty">Off Duty</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4"
                            >
                                Save Driver
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}