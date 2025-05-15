import Link from "next/link"
import { BillsTable } from "@/components/bills-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utility Bills</h1>
            <p className="text-muted-foreground">Manage and track your utility expenses</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg h-auto w-full sm:w-auto max-w-xs mx-auto"
          >
            <Link href="/upload" className="flex items-center justify-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Bill
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>View and manage your utility bills</CardDescription>
        </CardHeader>
        <CardContent>
          <BillsTable />
        </CardContent>
      </Card>
    </div>
  )
}
