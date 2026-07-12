import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDrivers, createDriver } from '@/api/driver.service'

function Skeleton({ className }) { return <div className={`skeleton ${className}`}></div> }

export default function Drivers() {
    const [drivers, setDrivers] = useState([]); const [loading, setLoading] = useState(true); const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState("")
    const [licenseNumber, setLicenseNumber] = useState(""); const [licenseExpiry, setLicenseExpiry] = useState("")
    const [saving, setSaving] = useState(false); const [error, setError] = useState(null)

    useEffect(() => { (async () => { try { const d = await getDrivers(); if (Array.isArray(d)) setDrivers(d) } catch {} finally { setLoading(false) } })() }, [])

    const resetForm = () => { setName(""); setPhone(""); setEmail(""); setLicenseNumber(""); setLicenseExpiry(""); setError(null) }

    const handleSave = async (e) => {
        e.preventDefault(); setError(null)
        if (!name || !phone || !email || !licenseNumber || !licenseExpiry) { setError("All fields are required."); return }
        setSaving(true)
        try {
            const created = await createDriver({ name: name.trim(), phone: phone.trim(), email: email.trim(), license_number: licenseNumber.trim(), license_expiry: licenseExpiry, status: 'Available' })
            setDrivers([created, ...drivers]); setIsOpen(false); resetForm()
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || "Failed to save driver.")
        } finally { setSaving(false) }
    }

    const statusBadge = (s) => ({ 'Available': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', 'On Trip': 'bg-blue-500/15 text-blue-600 dark:text-blue-400', 'Suspended': 'bg-red-500/15 text-red-600 dark:text-red-400' })[s] || 'bg-muted text-muted-foreground'

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="relative"><i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"></i>
                        <Input placeholder="Search drivers..." className="pl-9 h-10 w-64 text-sm rounded-xl bg-secondary/50 border-border" /></div>
                </div>
                <Button onClick={() => { resetForm(); setIsOpen(true) }} className="h-10 rounded-xl btn-gradient text-sm cursor-pointer gap-2 px-5">
                    <i className="fa-solid fa-plus"></i> Add Driver
                </Button>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow className="border-border hover:bg-transparent bg-muted/30">
                        {['Name', 'Phone', 'Email', 'License', 'Expiry', 'Status', ''].map((h, i) => (
                            <TableHead key={i} className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${i === 6 ? 'text-right' : ''}`}>{h}</TableHead>
                        ))}</TableRow></TableHeader>
                    <TableBody>
                        {loading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border">{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>
                        )) : drivers.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                                <i className="fa-solid fa-id-card text-4xl opacity-15 mb-3 block"></i>
                                <p className="font-medium">No drivers yet</p><p className="text-xs mt-1 text-muted-foreground/60">Add your first driver</p>
                            </TableCell></TableRow>
                        ) : drivers.map((d) => (
                            <TableRow key={d.id} className="border-border hover:bg-secondary/30 transition-colors">
                                <TableCell className="font-bold text-foreground">{d.name}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{d.phone}</TableCell>
                                <TableCell className="text-muted-foreground">{d.email}</TableCell>
                                <TableCell className="text-muted-foreground font-mono">{d.license_number}</TableCell>
                                <TableCell className="text-muted-foreground">{d.license_expiry}</TableCell>
                                <TableCell><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(d.status)}`}>{d.status}</span></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-xs cursor-pointer rounded-lg h-8"><i className="fa-solid fa-pen-to-square mr-1.5"></i>Edit</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><i className="fa-solid fa-id-card text-primary"></i> Add Driver</h3>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><i className="fa-solid fa-circle-exclamation"></i>{error}</div>}
                        <form onSubmit={handleSave} className="space-y-3.5">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label><Input placeholder="Rajesh Sharma" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone *</label><Input placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email *</label><Input type="email" placeholder="rajesh@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">License No. *</label><Input placeholder="DL-A-12345" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Expiry Date *</label><Input type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border" /></div>
                            </div>
                            <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl btn-gradient cursor-pointer mt-2 disabled:opacity-50 text-sm">
                                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa-solid fa-floppy-disk mr-2"></i>Save Driver</>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
