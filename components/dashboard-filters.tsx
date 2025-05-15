"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardFilters() {
  const [timeRange, setTimeRange] = useState("all")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState("all")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  return (
    <Card className="bg-white dark:bg-gray-950">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setTimeRange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2">
            {timeRange === "year" || timeRange === "month" ? (
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {timeRange === "month" ? (
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
