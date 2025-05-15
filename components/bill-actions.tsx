"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash, Download } from "lucide-react"
import { deleteBill } from "@/lib/bill-service"
import { useToast } from "@/hooks/use-toast"

export function BillActions({ billId }: { billId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bill? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const success = await deleteBill(billId)

      if (success) {
        toast({
          title: "Bill deleted",
          description: "The bill has been successfully deleted",
        })
        router.push("/")
        router.refresh()
      } else {
        throw new Error("Failed to delete bill")
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
      toast({
        title: "Error",
        description: "Failed to delete the bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Manage this bill</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start">
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="destructive" className="justify-start" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Delete Bill
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
