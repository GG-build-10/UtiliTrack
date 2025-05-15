import { HistoryView } from "@/components/history-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bill History</h1>
        <p className="text-muted-foreground">View and export your bill history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>View all bills or filter by month</CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryView />
        </CardContent>
      </Card>
    </div>
  )
}
