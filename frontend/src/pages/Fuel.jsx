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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, X, Calculator } from 'lucide-react'
import { getFuelLogs, createFuelLog } from '@/api/fuellog.service'
import { getExpenses, createExpense } from '@/api/expense.service'
import { getVehicles } from '@/api/vehicle.service'

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function Fuel() {
    const [fuelLogs, setFuelLogs] = useState([])
    const [expenses, setExpenses] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isFuelOpen, setIsFuelOpen] = useState(false)
    const [isExpenseOpen, setIsExpenseOpen] = useState(false)

    // Fuel form states
    const [fuelVehicle, setFuelVehicle] = useState("")
    const [fuelDate, setFuelDate] = useState("")
    const [fuelLiters, setFuelLiters] = useState("")
    const [fuelCost, setFuelCost] = useState("")
    const [fuelStation, setFuelStation] = useState("")

    // Expense form states
    const [expVehicle, setExpVehicle] = useState("")
    const [expCategory, setExpCategory] = useState("Toll")
    const [expDescription, setExpDescription] = useState("")
    const [expAmount, setExpAmount] = useState("")
    const [expDate, setExpDate] = useState("")

    // Totals
    const totalFuelCost = fuelLogs.reduce((sum, item) => sum + Number(item.fuel_cost), 0)
    const totalExpenseCost = expenses.reduce((sum, item) => sum + Number(item.amount), 0)
    const totalOperationalCost = totalFuelCost + totalExpenseCost

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fuelData, expenseData, vehiclesData] = await Promise.allSettled([
                    getFuelLogs(),
                    getExpenses(),
                    getVehicles()
                ])
                if (fuelData.status === 'fulfilled' && Array.isArray(fuelData.value)) setFuelLogs(fuelData.value)
                if (expenseData.status === 'fulfilled' && Array.isArray(expenseData.value)) setExpenses(expenseData.value)
                if (vehiclesData.status === 'fulfilled' && Array.isArray(vehiclesData.value)) {
                    setVehicles(vehiclesData.value)
                    if (vehiclesData.value.length > 0) {
                        const firstReg = vehiclesData.value[0].registration_number
                        setFuelVehicle(firstReg)
                        setExpVehicle(firstReg)
                    }
                }
            } catch {
                console.error("Failed to fetch fuel/expense data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleFuelSave = async (e) => {
        e.preventDefault()
        if (!fuelVehicle || !fuelDate || !fuelLiters || !fuelCost) return

        const selectedVehicle = vehicles.find(v => v.registration_number === fuelVehicle)
        const payload = { 
            vehicle_id: selectedVehicle ? selectedVehicle.id : null,
            vehicle_reg: fuelVehicle, 
            date: fuelDate, 
            liters: Number(fuelLiters), 
            fuel_cost: Number(fuelCost), 
            fuel_station: fuelStation.trim() 
        }

        try {
            const created = await createFuelLog(payload)
            setFuelLogs([created, ...fuelLogs])
            setIsFuelOpen(false)
            setFuelDate(""); setFuelLiters(""); setFuelCost(""); setFuelStation("")
            if (vehicles.length > 0) {
                setFuelVehicle(vehicles[0].registration_number)
            } else {
                setFuelVehicle("")
            }
        } catch {
            alert("Failed to save fuel log. Please check vehicle registration.")
        }
    }

    const handleExpenseSave = async (e) => {
        e.preventDefault()
        if (!expVehicle || !expCategory || !expAmount || !expDate) return

        const selectedVehicle = vehicles.find(v => v.registration_number === expVehicle)
        const payload = { 
            vehicle_id: selectedVehicle ? selectedVehicle.id : null,
            vehicle_reg: expVehicle, 
            category: expCategory, 
            description: expDescription.trim(), 
            amount: Number(expAmount), 
            date: expDate 
        }

        try {
            const created = await createExpense(payload)
            setExpenses([created, ...expenses])
            setIsExpenseOpen(false)
            setExpCategory("Toll"); setExpDescription(""); setExpAmount(""); setExpDate("")
            if (vehicles.length > 0) {
                setExpVehicle(vehicles[0].registration_number)
            } else {
                setExpVehicle("")
            }
        } catch {
            alert("Failed to save expense. Please check vehicle registration.")
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="all-vehicles">
                        <SelectTrigger className="w-[180px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Vehicle: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-vehicles">Vehicle: All</SelectItem>
                            {vehicles.map((v) => (
                                <SelectItem key={v.id} value={v.registration_number}>
                                    {v.registration_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search logs..." className="pl-9 bg-card border-border h-9 text-xs" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsFuelOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer">
                        <Plus className="h-4 w-4" /> Log Fuel
                    </Button>
                    <Button onClick={() => setIsExpenseOpen(true)} variant="outline" className="font-semibold gap-2 h-9 text-xs cursor-pointer border-border">
                        <Plus className="h-4 w-4" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Fuel Logs Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Fuel Logs</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">VEHICLE</TableHead>
                            <TableHead className="text-xs">DATE</TableHead>
                            <TableHead className="text-xs">LITRES</TableHead>
                            <TableHead className="text-xs">COST</TableHead>
                            <TableHead className="text-xs">STATION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fuelLogs.map((log) => (
                            <TableRow key={log.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{log.vehicle_reg || `V-${log.vehicle_id}`}</TableCell>
                                <TableCell className="text-sm">{log.date}</TableCell>
                                <TableCell className="text-sm">{log.liters} L</TableCell>
                                <TableCell className="text-sm">{formatINR(log.fuel_cost)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{log.fuel_station || '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Other Expenses Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Other Expenses</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs">VEHICLE</TableHead>
                            <TableHead className="text-xs">CATEGORY</TableHead>
                            <TableHead className="text-xs">DESCRIPTION</TableHead>
                            <TableHead className="text-xs">AMOUNT</TableHead>
                            <TableHead className="text-xs">DATE</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((exp) => (
                            <TableRow key={exp.id} className="border-border">
                                <TableCell className="font-semibold text-sm">{exp.vehicle_reg || `V-${exp.vehicle_id}`}</TableCell>
                                <TableCell className="text-sm">{exp.category}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{exp.description || '—'}</TableCell>
                                <TableCell className="text-sm">{formatINR(exp.amount)}</TableCell>
                                <TableCell className="text-sm">{exp.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Total Operational Cost */}
            <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-bold uppercase tracking-wider">Total Operational Cost (Auto)</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <span className="text-muted-foreground">Fuel: <span className="font-semibold text-foreground">{formatINR(totalFuelCost)}</span></span>
                    <span className="text-muted-foreground">Expenses: <span className="font-semibold text-foreground">{formatINR(totalExpenseCost)}</span></span>
                    <span className="text-amber-500 font-bold text-base">{formatINR(totalOperationalCost)}</span>
                </div>
            </div>

            {/* Fuel Log Modal */}
            {isFuelOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Log Fuel Entry</h3>
                            <button onClick={() => setIsFuelOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
                        </div>
                        <form onSubmit={handleFuelSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                <Select onValueChange={setFuelVehicle} value={fuelVehicle}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v.id} value={v.registration_number}>
                                                {v.registration_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Litres</label>
                                    <Input type="number" placeholder="e.g. 42" value={fuelLiters} onChange={(e) => setFuelLiters(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cost (₹)</label>
                                    <Input type="number" placeholder="e.g. 3150" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Station</label>
                                    <Input placeholder="e.g. HP Petrol Pump" value={fuelStation} onChange={(e) => setFuelStation(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                                    <Input type="date" value={fuelDate} onChange={(e) => setFuelDate(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg text-xs cursor-pointer mt-4">Save Fuel Log</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {isExpenseOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Add Expense</h3>
                            <button onClick={() => setIsExpenseOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
                        </div>
                        <form onSubmit={handleExpenseSave} className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                    <Select onValueChange={setExpVehicle} value={expVehicle}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((v) => (
                                                <SelectItem key={v.id} value={v.registration_number}>
                                                    {v.registration_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                                    <Select onValueChange={setExpCategory} value={expCategory}>
                                        <SelectTrigger className="bg-background border-border h-9 text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Toll">Toll</SelectItem>
                                            <SelectItem value="Parking">Parking</SelectItem>
                                            <SelectItem value="Insurance">Insurance</SelectItem>
                                            <SelectItem value="Repair">Repair</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                                <Input placeholder="e.g. Highway toll charges" value={expDescription} onChange={(e) => setExpDescription(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Amount (₹)</label>
                                    <Input type="number" placeholder="e.g. 340" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                                    <Input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} className="bg-background border-border h-9 text-xs" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg text-xs cursor-pointer mt-4">Save Expense</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
