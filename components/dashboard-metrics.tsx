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
      <Card className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-sage-200 to-transparent opacity-50 dark:from-sage-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700 dark:text-sage-300">Total Spent</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.totalSpent)}</h3>
            </div>
            <div className="rounded-full bg-sage-100 p-3 dark:bg-sage-800">
              <span className="flex h-6 w-6 items-center justify-center text-sage-700 dark:text-sage-300 font-bold text-lg">
                €
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-sage-700/70 dark:text-sage-300/70">All time utility expenses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-clay-50 to-clay-100 dark:from-clay-950 dark:to-clay-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-clay-200 to-transparent opacity-50 dark:from-clay-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-clay-700 dark:text-clay-300">Monthly Average</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.averageMonthly)}</h3>
            </div>
            <div className="rounded-full bg-clay-100 p-3 dark:bg-clay-800">
              <Zap className="h-6 w-6 text-clay-700 dark:text-clay-300" />
            </div>
          </div>
          <p className="mt-2 text-xs text-clay-700/70 dark:text-clay-300/70">Average monthly expenses</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-olive-50 to-olive-100 dark:from-olive-950 dark:to-olive-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-olive-200 to-transparent opacity-50 dark:from-olive-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-olive-700 dark:text-olive-300">Year over Year</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">{Math.abs(metrics.yearOverYear)}%</h3>
                {metrics.yearOverYear > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-terracotta-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-sage-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-olive-100 p-3 dark:bg-olive-800">
              {metrics.yearOverYear > 0 ? (
                <TrendingUp className="h-6 w-6 text-olive-700 dark:text-olive-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-olive-700 dark:text-olive-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-olive-700/70 dark:text-olive-300/70">
            {metrics.yearOverYear > 0 ? "Increase" : "Decrease"} compared to last year
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-terracotta-50 to-terracotta-100 dark:from-terracotta-950 dark:to-terracotta-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-terracotta-200 to-transparent opacity-50 dark:from-terracotta-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-terracotta-700 dark:text-terracotta-300">Month over Month</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">{Math.abs(metrics.monthOverMonth)}%</h3>
                {metrics.monthOverMonth > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-terracotta-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-sage-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-terracotta-100 p-3 dark:bg-terracotta-800">
              {metrics.monthOverMonth > 0 ? (
                <TrendingUp className="h-6 w-6 text-terracotta-700 dark:text-terracotta-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-terracotta-700 dark:text-terracotta-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-terracotta-700/70 dark:text-terracotta-300/70">
            {metrics.monthOverMonth > 0 ? "Increase" : "Decrease"} compared to last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
