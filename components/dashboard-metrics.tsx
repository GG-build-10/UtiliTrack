"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function DashboardMetrics() {
  // Mock data for metrics
  const metrics = {
    totalSpent: 2345.67,
    averageMonthly: 389.28,
    highestBill: {
      amount: 189.99,
      provider: "City Power",
      type: "Electricity",
      date: "2023-07-15",
    },
    lowestBill: {
      amount: 35.5,
      provider: "Clear Water Co",
      type: "Water",
      date: "2023-02-10",
    },
    yearOverYear: 8.5, // percentage increase
    monthOverMonth: -3.2, // percentage decrease
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-200 to-transparent opacity-50 dark:from-blue-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Spent</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.totalSpent)}</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-800">
              <span className="flex h-6 w-6 items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg">
                €
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-700/70 dark:text-blue-300/70">All time utility expenses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-200 to-transparent opacity-50 dark:from-green-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Monthly Average</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.averageMonthly)}</h3>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
              <Zap className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-700/70 dark:text-green-300/70">Average monthly expenses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-amber-200 to-transparent opacity-50 dark:from-amber-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Year over Year</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">{Math.abs(metrics.yearOverYear)}%</h3>
                {metrics.yearOverYear > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-800">
              {metrics.yearOverYear > 0 ? (
                <TrendingUp className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-amber-700/70 dark:text-amber-300/70">
            {metrics.yearOverYear > 0 ? "Increase" : "Decrease"} compared to last year
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-purple-200 to-transparent opacity-50 dark:from-purple-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Month over Month</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">{Math.abs(metrics.monthOverMonth)}%</h3>
                {metrics.monthOverMonth > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-800">
              {metrics.monthOverMonth > 0 ? (
                <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-purple-700/70 dark:text-purple-300/70">
            {metrics.monthOverMonth > 0 ? "Increase" : "Decrease"} compared to last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
