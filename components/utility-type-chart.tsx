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
import { mockUtilityTypeData } from "@/lib/mock-data"

export function UtilityTypeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mockUtilityTypeData}>
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
        <Bar dataKey="value" fill="#b79374" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(value) => `€${value}`}
            style={{ fill: "#b79374", fontWeight: "bold", fontSize: "12px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
