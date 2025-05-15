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
import { mockProviderData } from "@/lib/mock-data"

export function ProviderChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mockProviderData}>
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
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(value) => `€${value}`}
            style={{ fill: "#3b82f6", fontWeight: "bold", fontSize: "12px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
