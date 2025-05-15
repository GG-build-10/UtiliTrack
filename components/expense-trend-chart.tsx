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

export function ExpenseTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={mockTrendData}>
        <defs>
          <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorInternet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff8042" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
          formatter={(value) => [`$${value}`, ""]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="electricity"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorElectricity)"
          activeDot={{ r: 8 }}
          name="Electricity"
        />
        <Area
          type="monotone"
          dataKey="water"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorWater)"
          activeDot={{ r: 8 }}
          name="Water"
        />
        <Area
          type="monotone"
          dataKey="gas"
          stroke="#ffc658"
          fillOpacity={1}
          fill="url(#colorGas)"
          activeDot={{ r: 8 }}
          name="Gas"
        />
        <Area
          type="monotone"
          dataKey="internet"
          stroke="#ff8042"
          fillOpacity={1}
          fill="url(#colorInternet)"
          activeDot={{ r: 8 }}
          name="Internet"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
