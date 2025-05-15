"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, Trash, FileEdit, Loader2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useBills } from "@/hooks/use-bills"
import { deleteBill } from "@/lib/bill-service"
import { useToast } from "@/hooks/use-toast"

interface BillsTableProps {
  limit?: number
}

export function BillsTable({ limit }: BillsTableProps) {
  const { bills, loading, error, refreshBills } = useBills()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Apply limit if specified
  const displayedBills = limit ? bills.slice(0, limit) : bills

  const handleExport = () => {
    // Convert bills to CSV
    const headers = ["Provider", "Type", "Date", "Amount", "Due Date"]
    const csvContent = [
      headers.join(","),
      ...bills.map((bill) =>
        [bill.provider, bill.bill_type, bill.bill_date, bill.amount, bill.due_date || ""].join(","),
      ),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `utility-bills-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) return

    setDeletingId(id)
    try {
      const success = await deleteBill(id)
      if (success) {
        toast({
          title: "Bill deleted",
          description: "The bill has been successfully deleted",
        })
        refreshBills()
      } else {
        throw new Error("Failed to delete bill")
      }
    } catch (err) {
      console.error("Error deleting bill:", err)
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-sage-500 animate-spin mr-2" />
        <p>Loading bills...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={refreshBills}>
          Try Again
        </Button>
      </div>
    )
  }

  if (displayedBills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No bills found</p>
        <Button asChild>
          <a href="/upload">Upload Your First Bill</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden md:table-cell">Image</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.provider}</TableCell>
                <TableCell>{bill.bill_type}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(bill.bill_date)}</TableCell>
                <TableCell>{formatCurrency(Number(bill.amount))}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {bill.due_date ? formatDate(bill.due_date) : "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="relative h-10 w-10">
                    <Image
                      src={bill.image_url || "/placeholder.svg?height=40&width=40"}
                      alt={`Bill from ${bill.provider}`}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`/bills/${bill.id}`}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          View Details
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(bill.id)} disabled={deletingId === bill.id}>
                        {deletingId === bill.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
