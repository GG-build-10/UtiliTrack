import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardFilters } from "@/components/dashboard-filters"
import { ProviderChart } from "@/components/provider-chart"
import { UtilityTypeChart } from "@/components/utility-type-chart"
import { ExpenseTrendChart } from "@/components/expense-trend-chart"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { BillsTable } from "@/components/bills-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
// Add this import at the top
import { DemoModeToggle } from "@/components/demo-mode-toggle"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">View insights about your utility expenses</p>
          </div>
          <div className="flex items-center gap-4">
            <DemoModeToggle />
            <Button
              asChild
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-4 text-base h-auto rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Link href="/upload" className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Bill
              </Link>
            </Button>
          </div>
        </div>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bills</CardTitle>
            <CardDescription>Your most recently added utility bills</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/history">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <BillsTable limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}
