"use client"

import { TabsContent } from "@/components/ui/tabs"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileDown, Filter, SlidersHorizontal } from "lucide-react"
import { mockBillsByMonth, mockBills } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function HistoryView() {
  // Get current month in YYYY-MM format for default selection
  const getCurrentMonthKey = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey())
  const [viewType, setViewType] = useState("monthly")
  const months = Object.keys(mockBillsByMonth)
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null)

  // Check if there's data for the selected month
  useEffect(() => {
    if (viewType === "monthly") {
      const bills = mockBillsByMonth[selectedMonth]
      if (!bills || bills.length === 0) {
        setNoDataMessage(`No bills found for ${formatMonthDisplay(selectedMonth)}`)
      } else {
        setNoDataMessage(null)
      }
    } else {
      setNoDataMessage(null)
    }
  }, [selectedMonth, viewType])

  const handleExport = (type: string) => {
    if (type === "monthly") {
      alert(`Exporting bills for ${selectedMonth}...`)
    } else {
      alert("Exporting all bills...")
    }
  }

  // Format month for display (YYYY-MM to Month YYYY)
  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="all">All Bills</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            {viewType === "monthly" && (
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select month">{formatMonthDisplay(selectedMonth)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonthDisplay(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Options
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport(viewType)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export {viewType === "monthly" ? "Month" : "All"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => handleExport(viewType)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="monthly">
          {noDataMessage ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">{noDataMessage}</p>
              <Button asChild variant="outline">
                <a href="/upload">Upload a bill for this month</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockBillsByMonth[selectedMonth]?.map((bill) => (
                <Card key={bill.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{bill.provider}</h3>
                        <p className="text-sm text-muted-foreground">{bill.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(bill.amount)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(bill.date)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="relative h-24 w-full overflow-hidden rounded-md">
                      <Image
                        src={bill.image || "/placeholder.svg"}
                        alt={`Bill from ${bill.provider}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.provider}</TableCell>
                    <TableCell>{bill.type}</TableCell>
                    <TableCell>{formatDate(bill.date)}</TableCell>
                    <TableCell>{formatCurrency(bill.amount)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="relative h-10 w-10">
                        <Image
                          src={bill.image || "/placeholder.svg"}
                          alt={`Bill from ${bill.provider}`}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
