"use client"

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "@/components/ui/chart"
import { mockMonthlyComparisonData } from "@/lib/mock-data"

export function MonthlyComparisonChart() {
  // Calculate average for reference line
  const average =
    mockMonthlyComparisonData.reduce((sum, item) => sum + item.value, 0) / mockMonthlyComparisonData.length

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockMonthlyComparisonData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
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
        <Legend />
        <ReferenceLine y={average} stroke="#FF8042" strokeDasharray="3 3" label="Average" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#f59e0b"
          strokeWidth={2}
          name="Monthly Expense"
          dot={{ stroke: "#f59e0b", strokeWidth: 2, r: 4, fill: "#fff" }}
          activeDot={{ r: 6, fill: "#f59e0b" }}
          label={{
            position: "top",
            formatter: (value) => `€${value}`,
            style: { fill: "#f59e0b", fontSize: 12, fontWeight: "bold" },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
