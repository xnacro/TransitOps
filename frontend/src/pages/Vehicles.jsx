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
import { getVehicles, createVehicle } from '@/api/vehicle.service'

// Fallback mock data
const MOCK_VEHICLES = [
    { id: 1, registration_number: "GJO1UB4521", make: "Ford", model: "Transit", type: "Van", capacity: 500, fuel_type: "Diesel", odometer: 74000, status: "Available" },
    { id: 2, registration_number: "GJO1UB9981", make: "Volvo", model: "FH16", type: "Truck", capacity: 5000, fuel_type: "Diesel", odometer: 182000, status: "On Trip" },
    { id: 3, registration_number: "GJO1UB1120", make: "Suzuki", model: "Mini-03", type: "Mini", capacity: 1000, fuel_type: "Petrol", odometer: 66000, status: "In Shop" },
    { id: 4, registration_number: "GJO1UB0071", make: "Mercedes", model: "Sprinter", type: "Van", capacity: 750, fuel_type: "Diesel", odometer: 217900, status: "Retired" },
]

export default function Vehicles() {
    const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
    const [isLoading, setIsLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false)
    const [regNo, setRegNo] = useState("")
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [type, setType] = useState("Van")
    const [capacity, setCapacity] = useState("")
    const [fuelType, setFuelType] = useState("Diesel")
    const [odometer, setOdometer] = useState("")
    const [status, setStatus] = useState("Available")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getVehicles()
                if (data && Array.isArray(data)) setVehicles(data)
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
        if (!regNo || !make || !model || !type || !capacity || !odometer) return

        const payload = {
            registration_number: regNo.toUpperCase().trim(),
            make: make.trim(),
            model: model.trim(),
            type,
            capacity: Number(capacity),
            fuel_type: fuelType,
            odometer: Number(odometer),
            status
        }

        try {
            const created = await createVehicle(payload)
            setVehicles([created, ...vehicles])
        } catch {
            // Backend not available — add locally with mock id
            setVehicles([{ id: Date.now(), ...payload }, ...vehicles])
        }

        setIsOpen(false)
        setRegNo(""); setMake(""); setModel(""); setType("Van"); setCapacity(""); setFuelType("Diesel"); setOdometer(""); setStatus("Available")
    }

    const formatCapacity = (kg) => {
        if (kg >= 1000) return `${(kg / 1000).toFixed(kg % 1000 === 0 ? 0 : 1)} Ton`
        return `${kg} kg`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20 border-green-500/25'
            case 'On Trip': return 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 border-blue-500/25'
            case 'In Shop': return 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/25'
            case 'Retired': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20 border-red-500/25'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="all-types">
                        <SelectTrigger className="w-[160px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Type: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-types">Type: All</SelectItem>
                            <SelectItem value="truck">Trucks</SelectItem>
                            <SelectItem value="van">Vans</SelectItem>
                            <SelectItem value="mini">Minis</SelectItem>
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
                            <SelectItem value="in-shop">In Shop</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search reg. no..." className="pl-9 bg-card border-border h-9 text-xs" />
                    </div>
                </div>

                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">REG. NO. (UNIQUE)</TableHead>
                            <TableHead className="text-xs">MAKE / MODEL</TableHead>
                            <TableHead className="text-xs">TYPE</TableHead>
                            <TableHead className="text-xs">CAPACITY</TableHead>
                            <TableHead className="text-xs">FUEL</TableHead>
                            <TableHead className="text-xs">ODOMETER</TableHead>
                            <TableHead className="text-xs">STATUS</TableHead>
                            <TableHead className="text-xs text-right">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id || vehicle.registration_number} className="border-border">
                                <TableCell className="font-semibold text-sm">{vehicle.registration_number}</TableCell>
                                <TableCell className="text-sm">{vehicle.make} {vehicle.model}</TableCell>
                                <TableCell className="text-sm">{vehicle.type}</TableCell>
                                <TableCell className="text-sm">{formatCapacity(vehicle.capacity)}</TableCell>
                                <TableCell className="text-sm">{vehicle.fuel_type}</TableCell>
                                <TableCell className="text-sm">{Number(vehicle.odometer).toLocaleString('en-IN')} km</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                                        {vehicle.status}
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

            {/* Modal Dialog Overlay for Add Vehicle */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Add New Vehicle</h3>
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
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Registration No. (Unique)</label>
                                <Input 
                                    placeholder="e.g. GJO1UB4521" 
                                    value={regNo} 
                                    onChange={(e) => setRegNo(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Make</label>
                                    <Input 
                                        placeholder="e.g. Ford, Volvo" 
                                        value={make} 
                                        onChange={(e) => setMake(e.target.value)} 
                                        className="bg-background border-border h-9 text-xs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Model</label>
                                    <Input 
                                        placeholder="e.g. Transit, FH16" 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)} 
                                        className="bg-background border-border h-9 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
                                    <Select onValueChange={setType} value={type}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Van">Van</SelectItem>
                                            <SelectItem value="Truck">Truck</SelectItem>
                                            <SelectItem value="Mini">Mini</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</label>
                                    <Select onValueChange={setFuelType} value={fuelType}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs">
                                            <SelectValue placeholder="Select fuel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Diesel">Diesel</SelectItem>
                                            <SelectItem value="Petrol">Petrol</SelectItem>
                                            <SelectItem value="CNG">CNG</SelectItem>
                                            <SelectItem value="Electric">Electric</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Capacity (kg)</label>
                                <Input 
                                    type="number"
                                    placeholder="e.g. 500, 5000" 
                                    value={capacity} 
                                    onChange={(e) => setCapacity(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Odometer Reading (km)</label>
                                <Input 
                                    type="number"
                                    placeholder="e.g. 74000" 
                                    value={odometer} 
                                    onChange={(e) => setOdometer(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg transition-colors text-xs cursor-pointer mt-4"
                            >
                                Save Vehicle
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
