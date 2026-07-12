import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Activity, DollarSign } from 'lucide-react'

export default function Reports() {
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

                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 h-9 text-xs cursor-pointer">
                    <Download className="h-4 w-4" /> Export CSV
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Fuel Efficiency</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.4 km/L</div>
                        <p className="text-xs text-green-500 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +2.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Cost Per Trip</CardTitle>
                        <DollarSign className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$142.50</div>
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +4.3% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Fleet ROI</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18.2%</div>
                        <p className="text-xs text-green-500 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +1.2% from last month
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
                                        ${height}k
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