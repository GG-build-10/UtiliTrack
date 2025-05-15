"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Download } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export function RecentUploads() {
  // Mock data for recent uploads with Croatian providers
  const [recentUploads] = useState([
    {
      id: "1",
      provider: "HEP",
      type: "Electricity",
      date: "2023-05-15",
      amount: 65.99,
      image: "/placeholder.svg?height=100&width=100",
      uploadDate: "2023-05-16T10:30:00",
    },
    {
      id: "2",
      provider: "Hrvatske vode",
      type: "Water",
      date: "2023-05-10",
      amount: 32.5,
      image: "/placeholder.svg?height=100&width=100",
      uploadDate: "2023-05-11T14:45:00",
    },
    {
      id: "3",
      provider: "Hrvatska Radiotelevizija",
      type: "TV",
      date: "2023-05-20",
      amount: 10.62,
      image: "/placeholder.svg?height=100&width=100",
      uploadDate: "2023-05-21T09:15:00",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recently Uploaded Bills</h2>
        <Button variant="outline" asChild>
          <Link href="/">View All Bills</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {recentUploads.map((bill) => (
          <Card key={bill.id} className="overflow-hidden">
            <div className={`h-1 ${getBillTypeColor(bill.type)}`}></div>
            <CardHeader className="pb-2">
              <CardTitle>{bill.provider}</CardTitle>
              <CardDescription>{bill.type}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bill Date</p>
                  <p>{formatDate(bill.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-bold">{formatCurrency(bill.amount)}</p>
                </div>
              </div>
              <div className="relative h-32 w-full overflow-hidden rounded-md">
                <Image
                  src={bill.image || "/placeholder.svg"}
                  alt={`Bill from ${bill.provider}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <p className="text-xs text-muted-foreground">Uploaded {formatUploadDate(bill.uploadDate)}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getBillTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "electricity":
      return "bg-blue-500"
    case "water":
      return "bg-teal-500"
    case "gas":
      return "bg-amber-500"
    case "internet":
      return "bg-purple-500"
    case "phone":
      return "bg-pink-500"
    case "tv":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function formatUploadDate(dateString: string): string {
  const uploadDate = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - uploadDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "today"
  } else if (diffDays === 1) {
    return "yesterday"
  } else {
    return `${diffDays} days ago`
  }
}
