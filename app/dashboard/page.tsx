import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardFilters } from "@/components/dashboard-filters"
import { ProviderChart } from "@/components/provider-chart"
import { UtilityTypeChart } from "@/components/utility-type-chart"
import { ExpenseTrendChart } from "@/components/expense-trend-chart"
import { MonthlyComparisonChart } from "@/components/monthly-comparison-chart"
import { ExpenseDistributionChart } from "@/components/expense-distribution-chart"
import { DashboardMetrics } from "@/components/dashboard-metrics"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">View insights about your utility expenses</p>
      </div>

      <DashboardFilters />

      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900">
          <CardHeader>
            <CardTitle className="text-sage-700 dark:text-sage-300">Cost by Provider</CardTitle>
            <CardDescription>Total expenses grouped by service provider</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ProviderChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-clay-50 to-clay-100 dark:from-clay-950 dark:to-clay-900">
          <CardHeader>
            <CardTitle className="text-clay-700 dark:text-clay-300">Cost by Utility Type</CardTitle>
            <CardDescription>Total expenses grouped by utility type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <UtilityTypeChart />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-olive-50 to-olive-100 dark:from-olive-950 dark:to-olive-900">
        <CardHeader>
          <CardTitle className="text-olive-700 dark:text-olive-300">Expense Trends</CardTitle>
          <CardDescription>Monthly expense trends over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ExpenseTrendChart />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-terracotta-50 to-terracotta-100 dark:from-terracotta-950 dark:to-terracotta-900">
          <CardHeader>
            <CardTitle className="text-terracotta-700 dark:text-terracotta-300">Monthly Comparison</CardTitle>
            <CardDescription>Compare expenses across months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <MonthlyComparisonChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-clay-50 to-clay-100 dark:from-clay-950 dark:to-clay-900">
          <CardHeader>
            <CardTitle className="text-clay-700 dark:text-clay-300">Expense Distribution</CardTitle>
            <CardDescription>Breakdown of expenses by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ExpenseDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
