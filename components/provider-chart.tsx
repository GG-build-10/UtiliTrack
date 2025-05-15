"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getBillStatistics } from "@/lib/bill-service"
import { Skeleton } from "@/components/ui/skeleton"

export function ProviderChart() {
  const { user } = useAuth()
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  // Default mock data for preview purposes only
  const defaultData = [
    { name: "HEP", value: 185.97 },
    { name: "Hrvatske vode", value: 95.5 },
    { name: "Gradska plinara Zagreb", value: 135.25 },
    { name: "Hrvatski Telekom", value: 89.97 },
    { name: "A1", value: 75.0 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        // If no user, use default data
        setData(defaultData)
        setLoading(false)
        return
      }

      try {
        const stats = await getBillStatistics(user.id)
        // Transform provider data to the format expected by the chart
        const providerData = stats.byProvider.map((item) => ({
          name: item.provider,
          value: Number(item.amount),
        }))

        // Check if we have any data
        if (providerData.length === 0) {
          setIsEmpty(true)
        } else {
          setData(providerData)
        }
      } catch (error) {
        console.error("Error fetching provider data:", error)
        setIsEmpty(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-2">No provider data available yet</p>
        <p className="text-sm text-center text-muted-foreground">
          Upload your first bill to see provider statistics here
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
          formatter={(value) => [`€${value}`, "Amount"]}
        />
        <Bar dataKey="value" fill="#678d65" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(value) => `€${value}`}
            style={{ fill: "#678d65", fontWeight: "bold", fontSize: "12px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
