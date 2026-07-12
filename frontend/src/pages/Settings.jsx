import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Settings() {
    const [depotName, setDepotName] = useState("Gandhinagar Depot GJ01")
    const [currency, setCurrency] = useState("INR (₹)")
    const [distanceUnit, setDistanceUnit] = useState("Kilometers")
    const [saving, setSaving] = useState(false)

    const handleSave = (e) => {
        e.preventDefault(); setSaving(true)
        setTimeout(() => { setSaving(false); alert("Settings updated!") }, 800)
    }

    const rbacData = [
        { role: "Fleet Manager", icon: "fa-truck-front", fleet: true, drivers: true, trips: false, fuel: false, analytics: true },
        { role: "Dispatcher", icon: "fa-headset", fleet: 'view', drivers: false, trips: true, fuel: false, analytics: false },
        { role: "Safety Officer", icon: "fa-shield-halved", fleet: false, drivers: true, trips: 'view', fuel: false, analytics: false },
        { role: "Financial Analyst", icon: "fa-chart-column", fleet: 'view', drivers: false, trips: false, fuel: true, analytics: true },
    ]

    const renderAccess = (val) => {
        if (val === true) return <i className="fa-solid fa-circle-check text-emerald-500"></i>
        if (val === 'view') return <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 text-[10px] font-semibold uppercase tracking-wider">View</span>
        return <span className="text-muted-foreground/30">—</span>
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* General Settings */}
            <div className="w-full lg:w-[380px] shrink-0">
                <form onSubmit={handleSave} className="glass-card rounded-xl p-6 space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-border pb-4">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-gear text-primary"></i></div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">General</h3>
                            <p className="text-xs text-muted-foreground">Configure depot parameters</p>
                        </div>
                    </div>
                    <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Depot Name</label><Input value={depotName} onChange={(e) => setDepotName(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                    <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Currency</label><Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                    <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Distance Unit</label><Input value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                    <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer disabled:opacity-50 text-sm">
                        {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save Changes</>}
                    </Button>
                </form>
            </div>

            {/* RBAC Matrix */}
            <div className="flex-1 w-full">
                <div className="glass-card rounded-xl p-6 space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-border pb-4">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><i className="fa-solid fa-shield-halved text-primary"></i></div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Role-Based Access</h3>
                            <p className="text-xs text-muted-foreground">Permission matrix for platform roles</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border overflow-hidden">
                        <Table>
                            <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                                {['Role', 'Fleet', 'Drivers', 'Trips', 'Fuel/Exp.', 'Analytics'].map((h, i) => (
                                    <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i > 0 ? 'text-center' : ''}`}>{h}</TableHead>
                                ))}</TableRow></TableHeader>
                            <TableBody>
                                {rbacData.map((row, idx) => (
                                    <TableRow key={idx} className="border-border hover:bg-secondary/30">
                                        <TableCell className="font-bold text-foreground flex items-center gap-2.5 py-4">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><i className={`fa-solid ${row.icon} text-primary text-xs`}></i></div>
                                            {row.role}
                                        </TableCell>
                                        <TableCell className="text-center">{renderAccess(row.fleet)}</TableCell>
                                        <TableCell className="text-center">{renderAccess(row.drivers)}</TableCell>
                                        <TableCell className="text-center">{renderAccess(row.trips)}</TableCell>
                                        <TableCell className="text-center">{renderAccess(row.fuel)}</TableCell>
                                        <TableCell className="text-center">{renderAccess(row.analytics)}</TableCell>
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
