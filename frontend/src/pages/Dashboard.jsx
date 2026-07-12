import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Truck, Users, Route, Wrench, Percent, AlertTriangle, Search, Camera } from 'lucide-react'

export default function Dashboard() {
    const stats = [
        { title: "Active Vehicles", value: "53", icon: Truck, color: "text-blue-500" },
        { title: "Available Vehicles", value: "42", icon: Truck, color: "text-green-500" },
        { title: "Vehicles in Maintenance", value: "05", icon: Wrench, color: "text-amber-500" },
        { title: "Active Trips", value: "18", icon: Route, color: "text-indigo-500" },
        { title: "Problem Trips", value: "09", icon: AlertTriangle, color: "text-red-500" },
        { title: "Drivers On Duty", value: "26", icon: Users, color: "text-purple-500" },
        { title: "Fleet Utilization", value: "81%", icon: Percent, color: "text-emerald-500" },
    ]

    const recentTrips = [
        { id: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", statusColor: "bg-green-500/15 text-green-500 border-green-500/25", eta: "45 min" },
        { id: "TR002", vehicle: "TRK-12", driver: "Tom", status: "Completed", statusColor: "bg-yellow-500/15 text-yellow-500 border-yellow-500/25", eta: "—" },
        { id: "TR003", vehicle: "ATAT-09", driver: "Priya", status: "Dispatched", statusColor: "bg-blue-500/15 text-blue-500 border-blue-500/25", eta: "In 10m" },
        { id: "TR004", vehicle: "—", driver: "—", status: "Standby", statusColor: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25", eta: "Awaiting vehicle" },
    ]

    const vehicleStatusData = [
        { label: "Available", count: 42, color: "bg-green-500", pct: 80 },
        { label: "On Trip", count: 18, color: "bg-blue-500", pct: 55 },
        { label: "In Shop", count: 5, color: "bg-amber-500", pct: 15 },
        { label: "Retired", count: 2, color: "bg-red-500", pct: 6 },
    ]

    return (
        <div className="space-y-6">
            {/* Top Bar — Search */}
            <div className="flex items-center">
                <div className="relative w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 bg-card border-border" />
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex gap-3 items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filters</span>
                <Select defaultValue="all-types">
                    <SelectTrigger className="w-[160px] h-8 text-xs bg-card border-border">
                        <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-types">Vehicle Type: All</SelectItem>
                        <SelectItem value="truck">Trucks</SelectItem>
                        <SelectItem value="van">Vans</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all-status">
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-card border-border">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">Status: All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all-regions">
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-card border-border">
                        <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-regions">Region: All</SelectItem>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards — 7 across */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-3 pb-1">
                                <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0">
                                <div className="text-2xl font-extrabold tracking-tight">{stat.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Bottom Section — Recent Trips + Vehicle Status */}
            <div className="grid gap-4 lg:grid-cols-5">
                {/* Recent Trips Table — takes 3 cols */}
                <Card className="lg:col-span-3 bg-card border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Trips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-xs">Trip#</TableHead>
                                    <TableHead className="text-xs">Vehicle</TableHead>
                                    <TableHead className="text-xs">Driver</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="text-xs text-right">ETA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTrips.map((trip) => (
                                    <TableRow key={trip.id} className="border-border">
                                        <TableCell className="font-medium text-sm">{trip.id}</TableCell>
                                        <TableCell className="text-sm">{trip.vehicle}</TableCell>
                                        <TableCell className="text-sm">{trip.driver}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-xs font-semibold ${trip.statusColor}`}>
                                                {trip.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">{trip.eta}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Vehicle Status — takes 2 cols */}
                <Card className="lg:col-span-2 bg-card border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Vehicle Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {vehicleStatusData.map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">{item.label}</span>
                                    <span className="font-bold">{item.count}</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}