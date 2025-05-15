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
