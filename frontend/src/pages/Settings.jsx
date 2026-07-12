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
import { Check, Shield } from 'lucide-react'

export default function Settings() {
    const [depotName, setDepotName] = useState("Gandhinagar Depot GJO1")
    const [currency, setCurrency] = useState("INR (Rs)")
    const [distanceUnit, setDistanceUnit] = useState("Kilometers")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = (e) => {
        e.preventDefault()
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            alert("Settings updated successfully!")
        }, 800)
    }

    const rbacData = [
        { role: "Fleet Manager", fleet: "✓", drivers: "✓", trips: "—", fuel: "—", analytics: "✓" },
        { role: "Dispatcher", fleet: "view", drivers: "—", trips: "✓", fuel: "—", analytics: "—" },
        { role: "Safety Officer", fleet: "—", drivers: "✓", trips: "view", fuel: "—", analytics: "—" },
        { role: "Financial Analyst", fleet: "view", drivers: "—", trips: "—", fuel: "✓", analytics: "✓" }
    ]

    const renderCellContent = (value) => {
        if (value === "✓") {
            return <Check className="h-4.5 w-4.5 text-green-500 font-black mx-auto" />
        } else if (value === "view") {
            return (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 text-[10px] font-semibold tracking-wider uppercase mx-auto block w-fit">
                    View Only
                </Badge>
            )
        } else {
            return <span className="text-muted-foreground/60 mx-auto block w-fit">—</span>
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12 w-full items-start">
            
            {/* General Settings Column (Fixed elegant width on desktop) */}
            <div className="w-full lg:w-[360px] shrink-0">
                <form onSubmit={handleSave}>
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 shadow-xs">
                        <div className="border-b border-border pb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">General Settings</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Configure global parameters for depot operations.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Depot Name</label>
                                <Input 
                                    value={depotName} 
                                    onChange={(e) => setDepotName(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Currency</label>
                                <Input 
                                    value={currency} 
                                    onChange={(e) => setCurrency(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Distance Unit</label>
                                <Input 
                                    value={distanceUnit} 
                                    onChange={(e) => setDistanceUnit(e.target.value)} 
                                    className="bg-background border-border h-9 text-xs"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 h-9 rounded-lg text-xs cursor-pointer mt-2"
                        >
                            {isSaving ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Role-Based Access Control Column (Fluid layout) */}
            <div className="flex-1 w-full">
                <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Role-Based Access (RBAC)</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Permission matrix for functional platform roles.</p>
                        </div>
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                            <Shield className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent bg-muted/20">
                                    <TableHead className="text-xs">ROLE</TableHead>
                                    <TableHead className="text-xs text-center">FLEET</TableHead>
                                    <TableHead className="text-xs text-center">DRIVERS</TableHead>
                                    <TableHead className="text-xs text-center">TRIPS</TableHead>
                                    <TableHead className="text-xs text-center">FUEL/EXP.</TableHead>
                                    <TableHead className="text-xs text-center">ANALYTICS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rbacData.map((row, idx) => (
                                    <TableRow key={idx} className="border-border">
                                        <TableCell className="font-bold text-xs text-foreground py-4.5">{row.role}</TableCell>
                                        <TableCell className="text-center">{renderCellContent(row.fleet)}</TableCell>
                                        <TableCell className="text-center">{renderCellContent(row.drivers)}</TableCell>
                                        <TableCell className="text-center">{renderCellContent(row.trips)}</TableCell>
                                        <TableCell className="text-center">{renderCellContent(row.fuel)}</TableCell>
                                        <TableCell className="text-center">{renderCellContent(row.analytics)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

        </div>
    )
}
