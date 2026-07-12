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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, X, Calculator } from 'lucide-react'

export default function Fuel() {
    // 1. State for Fuel Logs
    const [fuelLogs, setFuelLogs] = useState([
        { id: 1, vehicle: "VAN-05", date: "05 Jul 2026", liters: 42, cost: 3150 },
        { id: 2, vehicle: "TRUCK-11", date: "06 Jul 2026", liters: 110, cost: 8400 },
        { id: 3, vehicle: "MINI-03", date: "06 Jul 2026", liters: 28, cost: 2050 },
    ])

    // 2. State for Other Expenses (Toll / Misc)
    const [otherExpenses, setOtherExpenses] = useState([
        { trip: "TR001", vehicle: "VAN-05", toll: 120, other: 0, maint: 0 },
        { trip: "TR002", vehicle: "TRK-12", toll: 340, other: 150, maint: 18000 },
    ])

    // 3. Modals Visibility State
    const [isFuelOpen, setIsFuelOpen] = useState(false)
    const [isExpenseOpen, setIsExpenseOpen] = useState(false)

    // 4. Form States for Fuel
    const [fuelVehicle, setFuelVehicle] = useState("VAN-05")
    const [fuelDate, setFuelDate] = useState("2026-07-06")
    const [fuelLiters, setFuelLiters] = useState("")
    const [fuelCost, setFuelCost] = useState("")

    // 5. Form States for Expenses
    const [expTrip, setExpTrip] = useState("")
    const [expVehicle, setExpVehicle] = useState("VAN-05")
    const [expToll, setExpToll] = useState("")
    const [expOther, setExpOther] = useState("")
    const [expMaint, setExpMaint] = useState("")

    // Calculations
    const totalFuelCost = fuelLogs.reduce((sum, item) => sum + Number(item.cost), 0)
    const totalMaintCost = otherExpenses.reduce((sum, item) => sum + Number(item.maint), 0)
    const totalTollsCost = otherExpenses.reduce((sum, item) => sum + Number(item.toll), 0)
    const totalOtherCost = otherExpenses.reduce((sum, item) => sum + Number(item.other), 0)
    
    // Auto Total Operational Cost (matches user's Formula: Fuel + Maintenance + Tolls/Other)
    const totalOperationalCost = totalFuelCost + totalMaintCost + totalTollsCost + totalOtherCost

    // Handlers
    const handleFuelSave = (e) => {
        e.preventDefault()
        if (!fuelVehicle || !fuelDate || !fuelLiters || !fuelCost) return

        // Format Date to 'DD MMM YYYY'
        const dateObj = new Date(fuelDate)
        const formattedDate = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : fuelDate

        const newLog = {
            id: fuelLogs.length + 1,
            vehicle: fuelVehicle,
            date: formattedDate,
            liters: Number(fuelLiters),
            cost: Number(fuelCost)
        }

        setFuelLogs([...fuelLogs, newLog])
        setIsFuelOpen(false)

        // Reset fields
        setFuelLiters("")
        setFuelCost("")
    }

    const handleExpenseSave = (e) => {
        e.preventDefault()
        if (!expTrip || !expVehicle) return

        const newExpense = {
            trip: expTrip.toUpperCase().trim(),
            vehicle: expVehicle,
            toll: Number(expToll) || 0,
            other: Number(expOther) || 0,
            maint: Number(expMaint) || 0
        }

        setOtherExpenses([...otherExpenses, newExpense])
        setIsExpenseOpen(false)

        // Reset fields
        setExpTrip("")
        setExpToll("")
        setExpOther("")
        setExpMaint("")
    }

    return (
        <div className="space-y-6 flex flex-col h-full relative">
            
            {/* Top Section: Fuel Logs Title & Action Buttons */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Fuel Logs</h3>
                        <p className="text-xs text-muted-foreground">Daily fuel consumption entries by vehicle.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => setIsFuelOpen(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                        >
                            <Plus className="h-4 w-4" /> Log Fuel
                        </Button>
                        <Button 
                            onClick={() => setIsExpenseOpen(true)}
                            variant="outline"
                            className="border-border hover:bg-accent text-xs h-9 cursor-pointer"
                        >
                            <Plus className="h-4 w-4 mr-1 text-muted-foreground" /> Add Expense
                        </Button>
                    </div>
                </div>

                {/* Fuel Logs Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-xs">VEHICLE</TableHead>
                                <TableHead className="text-xs">DATE</TableHead>
                                <TableHead className="text-xs">LITERS</TableHead>
                                <TableHead className="text-xs text-right">FUEL COST ($)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fuelLogs.map((log) => (
                                <TableRow key={log.id} className="border-border">
                                    <TableCell className="font-semibold text-sm">{log.vehicle}</TableCell>
                                    <TableCell className="text-sm">{log.date}</TableCell>
                                    <TableCell className="text-sm font-medium">{log.liters} L</TableCell>
                                    <TableCell className="text-sm font-semibold text-right text-amber-500">
                                        {log.cost.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Middle Section: Other Expenses */}
            <div className="space-y-4 pt-2">
                <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Other Expenses (Toll / Misc)</h3>
                    <p className="text-xs text-muted-foreground">Toll logs, miscellaneous fees, and linked maintenance charges.</p>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-xs">TRIP</TableHead>
                                <TableHead className="text-xs">VEHICLE</TableHead>
                                <TableHead className="text-xs">TOLL ($)</TableHead>
                                <TableHead className="text-xs">OTHER ($)</TableHead>
                                <TableHead className="text-xs font-semibold text-amber-500">MAINT. (LINKED) ($)</TableHead>
                                <TableHead className="text-xs text-right">TOTAL ($)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {otherExpenses.map((expense, idx) => {
                                const total = expense.toll + expense.other + expense.maint
                                return (
                                    <TableRow key={idx} className="border-border">
                                        <TableCell className="font-semibold text-sm">{expense.trip}</TableCell>
                                        <TableCell className="text-sm">{expense.vehicle}</TableCell>
                                        <TableCell className="text-sm">{expense.toll.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm">{expense.other.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm font-semibold text-amber-500/90">{expense.maint.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm font-bold text-right text-emerald-500">
                                            {total.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Bottom Total Calculator Block */}
            <div className="mt-auto p-5 bg-card border border-border rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                        <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Operational Cost (Auto)</h4>
                        <p className="text-[10px] text-zinc-500 font-medium font-mono uppercase">Formula = Fuel + Maintenance + Tolls/Misc</p>
                    </div>
                </div>
                <div className="text-2xl font-black text-amber-500 font-mono tracking-tight pr-2">
                    ${totalOperationalCost.toLocaleString()}
                </div>
            </div>

            {/* FUEL LOG MODAL */}
            {isFuelOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Log Fuel Entry</h3>
                            <button onClick={() => setIsFuelOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleFuelSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                <Select onValueChange={setFuelVehicle} value={fuelVehicle}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VAN-05">VAN-05</SelectItem>
                                        <SelectItem value="TRUCK-11">TRUCK-11</SelectItem>
                                        <SelectItem value="MINI-03">MINI-03</SelectItem>
                                        <SelectItem value="TRK-12">TRK-12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                                <Input type="date" value={fuelDate} onChange={(e) => setFuelDate(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Liters (L)</label>
                                <Input type="number" placeholder="42" value={fuelLiters} onChange={(e) => setFuelLiters(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fuel Cost ($)</label>
                                <Input type="number" placeholder="3150" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg text-xs cursor-pointer mt-4">
                                Save Fuel Log
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* EXPENSE LOG MODAL */}
            {isExpenseOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
                    <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Add Other Expense</h3>
                            <button onClick={() => setIsExpenseOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleExpenseSave} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Trip ID</label>
                                <Input placeholder="e.g. TR003" value={expTrip} onChange={(e) => setExpTrip(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</label>
                                <Select onValueChange={setExpVehicle} value={expVehicle}>
                                    <SelectTrigger className="bg-background border-border h-9 text-xs">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VAN-05">VAN-05</SelectItem>
                                        <SelectItem value="TRK-12">TRK-12</SelectItem>
                                        <SelectItem value="TRUCK-11">TRUCK-11</SelectItem>
                                        <SelectItem value="MINI-03">MINI-03</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Toll Charges ($)</label>
                                <Input type="number" placeholder="120" value={expToll} onChange={(e) => setExpToll(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Other Miscellaneous ($)</label>
                                <Input type="number" placeholder="150" value={expOther} onChange={(e) => setExpOther(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-semibold text-amber-500">Maint. (Linked) ($)</label>
                                <Input type="number" placeholder="18000" value={expMaint} onChange={(e) => setExpMaint(e.target.value)} className="bg-background border-border h-9 text-xs" />
                            </div>
                            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg text-xs cursor-pointer mt-4">
                                Save Expense Log
                            </Button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}