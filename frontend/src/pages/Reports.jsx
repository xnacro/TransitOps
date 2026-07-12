import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Activity, DollarSign } from 'lucide-react'
import { getFuelEfficiency, getFleetUtilization, getRevenue, getOperationalCost, exportCsv } from '@/api/report.service'

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

// Fallback mock data
const MOCK_REPORTS = {
    fuelEfficiency: { value: "8.4 km/L", trend: "+2.1%", trendColor: "text-green-500" },
    avgCostPerTrip: { value: formatINR(10700), trend: "+4.3%", trendColor: "text-red-500" },
    fleetROI: { value: "18.2%", trend: "+1.2%", trendColor: "text-green-500" },
}

export default function Reports() {
    const [reports, setReports] = useState(MOCK_REPORTS)
    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fuelData, utilizationData, revenueData, costData] = await Promise.allSettled([
                    getFuelEfficiency(),
                    getFleetUtilization(),
                    getRevenue(),
                    getOperationalCost()
                ])
                // Map API responses if available
                const updated = { ...MOCK_REPORTS }
                if (fuelData.status === 'fulfilled' && fuelData.value) {
                    updated.fuelEfficiency = { value: `${fuelData.value.efficiency} km/L`, trend: fuelData.value.trend || "+2.1%", trendColor: "text-green-500" }
                }
                if (costData.status === 'fulfilled' && costData.value) {
                    updated.avgCostPerTrip = { value: formatINR(costData.value.avgCostPerTrip || 10700), trend: costData.value.trend || "+4.3%", trendColor: "text-red-500" }
                }
                setReports(updated)
            } catch {
                // Backend not available — keep mock data
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleExportCsv = async () => {
        setIsExporting(true)
        try {
            await exportCsv('operational-cost')
        } catch {
            alert('CSV export is not available yet. Backend is offline.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select defaultValue="this-month">
                        <SelectTrigger className="w-[180px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Period: This Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">Period: This Month</SelectItem>
                            <SelectItem value="last-30">Last 30 Days</SelectItem>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all-divisions">
                        <SelectTrigger className="w-[180px] h-9 text-xs bg-card border-border">
                            <SelectValue placeholder="Division: All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-divisions">Division: All</SelectItem>
                            <SelectItem value="logistics">Logistics</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleExportCsv}
                    disabled={isExporting}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer"
                >
                    <Download className="h-4 w-4" /> {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Fuel Efficiency</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.fuelEfficiency.value}</div>
                        <p className={`text-xs ${reports.fuelEfficiency.trendColor} mt-1 flex items-center`}>
                            <TrendingUp className="h-3 w-3 mr-1" /> {reports.fuelEfficiency.trend} from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Cost Per Trip</CardTitle>
                        <DollarSign className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.avgCostPerTrip.value}</div>
                        <p className={`text-xs ${reports.avgCostPerTrip.trendColor} mt-1 flex items-center`}>
                            <TrendingUp className="h-3 w-3 mr-1" /> {reports.avgCostPerTrip.trend} from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Fleet ROI</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.fleetROI.value}</div>
                        <p className={`text-xs ${reports.fleetROI.trendColor} mt-1 flex items-center`}>
                            <TrendingUp className="h-3 w-3 mr-1" /> {reports.fleetROI.trend} from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* CSS-Only Bar Chart Mockup */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Monthly Operational Costs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-4">
                        {[40, 70, 45, 90, 65, 55, 85, 100, 75, 60, 50, 80].map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary rounded-t-sm transition-all relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {formatINR(height * 1000)}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}