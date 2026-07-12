import React from 'react'
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
import { Search, Plus } from 'lucide-react'

export default function Fuel() {
    const expenses = [
        { id: "EXP-801", vehicle: "Trk-12", type: "Fuel", amount: "120 L", cost: "$180.00", date: "2026-07-11" },
        { id: "EXP-802", vehicle: "Van-05", type: "Toll", amount: "-", cost: "$15.50", date: "2026-07-10" },
        { id: "EXP-803", vehicle: "Van-02", type: "Fuel", amount: "65 L", cost: "$97.50", date: "2026-07-09" },
        { id: "EXP-804", vehicle: "Trk-08", type: "Maintenance", amount: "-", cost: "$450.00", date: "2026-07-08" },
    ]

    const getTypeColor = (type) => {
        switch (type) {
            case 'Fuel': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'Toll': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'Maintenance': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            default: return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search expenses..." className="pl-8 bg-card border-border" />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden flex-1">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Record ID</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Expense Type</TableHead>
                            <TableHead>Amount/Volume</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id} className="border-border">
                                <TableCell className="font-medium">{expense.id}</TableCell>
                                <TableCell>{expense.vehicle}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getTypeColor(expense.type)}>
                                        {expense.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{expense.amount}</TableCell>
                                <TableCell className="font-semibold">{expense.cost}</TableCell>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        View Receipt
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}