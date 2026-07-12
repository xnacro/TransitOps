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
import { getDrivers, createDriver } from '@/api/driver.service'

export default function Drivers() {
    const [drivers, setDrivers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [licenseExpiry, setLicenseExpiry] = useState("")
    const [status, setStatus] = useState("Available")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDrivers()
                if (data && Array.isArray(data)) setDrivers(data)
            } catch {
                console.error("Failed to fetch drivers")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        if (!name || !phone || !email || !licenseNumber || !licenseExpiry) return

        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            license_number: licenseNumber.trim(),
            license_expiry: licenseExpiry,
            status
        }

        try {
            const created = await createDriver(payload)
            setDrivers([created, ...drivers])
            setIsOpen(false)
            setName(""); setPhone(""); setEmail(""); setLicenseNumber(""); setLicenseExpiry(""); setStatus("Available")
        } catch {
            alert("Failed to save driver. Email or license number might already be taken.")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'On Trip': return 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 border-blue-500/25'
            case 'Suspended': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20 border-red-500/25'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-[140px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Status: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">Status: All</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="on-trip">On Trip</SelectItem>
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
                            <TableHead className="text-xs">NAME</TableHead>
                            <TableHead className="text-xs">PHONE</TableHead>
                            <TableHead className="text-xs">EMAIL</TableHead>
                            <TableHead className="text-xs">LICENSE NO.</TableHead>
                            <TableHead className="text-xs">LICENSE EXPIRY</TableHead>
                            <TableHead className="text-xs">STATUS</TableHead>
                            <TableHead className="text-xs text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{driver.name}</TableCell>
                                <TableCell className="text-sm">{driver.phone}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{driver.email}</TableCell>
                                <TableCell className="text-sm font-mono">{driver.license_number}</TableCell>
                                <TableCell className="text-sm">{driver.license_expiry}</TableCell>
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
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Add New Driver</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Driver Name</label>
                                <Input placeholder="e.g. Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
                                    <Input placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                                    <Input type="email" placeholder="e.g. alex@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">License Number</label>
                                    <Input placeholder="e.g. DL-A-12345" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">License Expiry</label>
                                    <Input type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
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
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4">
                                Save Driver
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
