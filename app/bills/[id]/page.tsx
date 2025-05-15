import { getBillById } from "@/lib/bill-service"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BillActions } from "@/components/bill-actions"

export default async function BillDetailPage({ params }: { params: { id: string } }) {
  const bill = await getBillById(params.id)

  if (!bill) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Bill Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The bill you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill Details</h1>
          <p className="text-muted-foreground">View and manage your bill information</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bill Information</CardTitle>
              <CardDescription>Details about this utility bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Provider</h3>
                  <p className="text-lg">{bill.provider}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p className="text-lg">{bill.bill_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                  <p className="text-lg font-bold">{formatCurrency(Number(bill.amount))}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Bill Date</h3>
                  <p className="text-lg">{formatDate(bill.bill_date)}</p>
                </div>
                {bill.due_date && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                    <p className="text-lg">{formatDate(bill.due_date)}</p>
                  </div>
                )}
                {bill.period_start && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Period Start</h3>
                    <p className="text-lg">{formatDate(bill.period_start)}</p>
                  </div>
                )}
                {bill.period_end && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Period End</h3>
                    <p className="text-lg">{formatDate(bill.period_end)}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Added On</h3>
                  <p className="text-lg">{new Date(bill.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <BillActions billId={bill.id} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bill Image</CardTitle>
              <CardDescription>Original bill document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 w-full overflow-hidden rounded-md mb-4">
                <Image
                  src={bill.image_url || "/placeholder.svg?height=320&width=240"}
                  alt={`Bill from ${bill.provider}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={bill.image_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
