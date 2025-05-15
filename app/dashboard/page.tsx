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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Cost by Provider</CardTitle>
            <CardDescription>Total expenses grouped by service provider</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ProviderChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Cost by Utility Type</CardTitle>
            <CardDescription>Total expenses grouped by utility type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <UtilityTypeChart />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">Expense Trends</CardTitle>
          <CardDescription>Monthly expense trends over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ExpenseTrendChart />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-300">Monthly Comparison</CardTitle>
            <CardDescription>Compare expenses across months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <MonthlyComparisonChart />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
          <CardHeader>
            <CardTitle className="text-teal-700 dark:text-teal-300">Expense Distribution</CardTitle>
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
