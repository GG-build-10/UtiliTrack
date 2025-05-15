"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { mockTrendData } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseTrendChart() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [data, setData] = useState(mockTrendData)

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) return

      try {
        // Check if user has bills
        const hasUserBills = localStorage.getItem(`user-${user.id}-has-bills`) === "true"

        if (!hasUserBills) {
          setIsEmpty(true)
        }
      } catch (error) {
        console.error("Error checking user data:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserData()
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
        <p className="text-muted-foreground mb-2">No expense trend data available yet</p>
        <p className="text-sm text-center text-muted-foreground">
          Upload bills over time to see your expense trends here
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#678d65" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#678d65" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b79374" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#b79374" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#cf8766" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#cf8766" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorInternet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9dab4c" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#9dab4c" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickFormatter={(value) => value} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
          formatter={(value) => [`€${value}`, ""]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="electricity"
          stroke="#527a50"
          strokeWidth={2.5}
          fillOpacity={0.8}
          fill="url(#colorElectricity)"
          activeDot={{ r: 8, strokeWidth: 2 }}
          name="Electricity"
        />
        <Area
          type="monotone"
          dataKey="water"
          stroke="#8c6a4e"
          strokeWidth={2.5}
          fillOpacity={0.8}
          fill="url(#colorWater)"
          activeDot={{ r: 8, strokeWidth: 2 }}
          name="Water"
        />
        <Area
          type="monotone"
          dataKey="gas"
          stroke="#b35f34"
          strokeWidth={2.5}
          fillOpacity={0.8}
          fill="url(#colorGas)"
          activeDot={{ r: 8, strokeWidth: 2 }}
          name="Gas"
        />
        <Area
          type="monotone"
          dataKey="internet"
          stroke="#7f8c33"
          strokeWidth={2.5}
          fillOpacity={0.8}
          fill="url(#colorInternet)"
          activeDot={{ r: 8, strokeWidth: 2 }}
          name="Internet"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
