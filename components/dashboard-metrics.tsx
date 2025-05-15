"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getBillStatistics } from "@/lib/bill-service"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({
    totalAmount: 0,
    billCount: 0,
    averageAmount: 0,
    byProvider: [] as { provider: string; amount: number }[],
    byType: [] as { type: string; amount: number }[],
  })
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) return

      try {
        const stats = await getBillStatistics(user.id)
        setMetrics(stats)

        // Check if user has any bills
        if (stats.billCount === 0) {
          setIsEmpty(true)
        }
      } catch (error) {
        console.error("Error fetching statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [user])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // For new users with no data, show empty metrics
  if (isEmpty) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-sage-200 to-transparent opacity-50 dark:from-sage-800"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-700 dark:text-sage-300">Total Spent</p>
                <h3 className="text-2xl font-bold">{formatCurrency(0)}</h3>
              </div>
              <div className="rounded-full bg-sage-100 p-3 dark:bg-sage-800">
                <span className="flex h-6 w-6 items-center justify-center text-sage-700 dark:text-sage-300 font-bold text-lg">
                  €
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-sage-700/70 dark:text-sage-300/70">
              Upload your first bill to start tracking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-clay-50 to-clay-100 dark:from-clay-950 dark:to-clay-900 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-clay-200 to-transparent opacity-50 dark:from-clay-800"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-clay-700 dark:text-clay-300">Monthly Average</p>
                <h3 className="text-2xl font-bold">{formatCurrency(0)}</h3>
              </div>
              <div className="rounded-full bg-clay-100 p-3 dark:bg-clay-800">
                <Zap className="h-6 w-6 text-clay-700 dark:text-clay-300" />
              </div>
            </div>
            <p className="mt-2 text-xs text-clay-700/70 dark:text-clay-300/70">No data available yet</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-olive-50 to-olive-100 dark:from-olive-950 dark:to-olive-900 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-olive-200 to-transparent opacity-50 dark:from-olive-800"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-olive-700 dark:text-olive-300">Year over Year</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold">-</h3>
                </div>
              </div>
              <div className="rounded-full bg-olive-100 p-3 dark:bg-olive-800">
                <TrendingUp className="h-6 w-6 text-olive-700 dark:text-olive-300" />
              </div>
            </div>
            <p className="mt-2 text-xs text-olive-700/70 dark:text-olive-300/70">Add bills to see yearly comparisons</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta-50 to-terracotta-100 dark:from-terracotta-950 dark:to-terracotta-900 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-terracotta-200 to-transparent opacity-50 dark:from-terracotta-800"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-terracotta-700 dark:text-terracotta-300">Month over Month</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold">-</h3>
                </div>
              </div>
              <div className="rounded-full bg-terracotta-100 p-3 dark:bg-terracotta-800">
                <TrendingDown className="h-6 w-6 text-terracotta-700 dark:text-terracotta-300" />
              </div>
            </div>
            <p className="mt-2 text-xs text-terracotta-700/70 dark:text-terracotta-300/70">
              Add bills to see monthly comparisons
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock year-over-year and month-over-month data (would be calculated from real data)
  const yearOverYear = 8.5 // percentage increase
  const monthOverMonth = -3.2 // percentage decrease

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-sage-200 to-transparent opacity-50 dark:from-sage-800"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700 dark:text-sage-300">Total Spent</p>
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.totalAmount)}</h3>
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
              <h3 className="text-2xl font-bold">{formatCurrency(metrics.averageAmount)}</h3>
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
                <h3 className="text-2xl font-bold">{Math.abs(yearOverYear)}%</h3>
                {yearOverYear > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-terracotta-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-sage-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-olive-100 p-3 dark:bg-olive-800">
              {yearOverYear > 0 ? (
                <TrendingUp className="h-6 w-6 text-olive-700 dark:text-olive-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-olive-700 dark:text-olive-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-olive-700/70 dark:text-olive-300/70">
            {yearOverYear > 0 ? "Increase" : "Decrease"} compared to last year
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
                <h3 className="text-2xl font-bold">{Math.abs(monthOverMonth)}%</h3>
                {monthOverMonth > 0 ? (
                  <ArrowUpIcon className="ml-1 h-4 w-4 text-terracotta-500" />
                ) : (
                  <ArrowDownIcon className="ml-1 h-4 w-4 text-sage-500" />
                )}
              </div>
            </div>
            <div className="rounded-full bg-terracotta-100 p-3 dark:bg-terracotta-800">
              {monthOverMonth > 0 ? (
                <TrendingUp className="h-6 w-6 text-terracotta-700 dark:text-terracotta-300" />
              ) : (
                <TrendingDown className="h-6 w-6 text-terracotta-700 dark:text-terracotta-300" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-terracotta-700/70 dark:text-terracotta-300/70">
            {monthOverMonth > 0 ? "Increase" : "Decrease"} compared to last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
