"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import {
  mockBills,
  mockBillsByMonth,
  mockProviderData,
  mockUtilityTypeData,
  mockTrendData,
  mockMonthlyComparisonData,
} from "./mock-data"
import { type BillData, generateBillId } from "./bill-processing"

// Define the state context type
interface StateContextType {
  bills: BillData[]
  billsByMonth: Record<string, BillData[]>
  providerData: { name: string; value: number }[]
  utilityTypeData: { name: string; value: number }[]
  trendData: any[]
  monthlyComparisonData: { month: string; value: number }[]
  addBill: (bill: BillData) => void
  deleteBill: (id: string) => void
  updateBill: (id: string, bill: Partial<BillData>) => void
}

// Create the context
const StateContext = createContext<StateContextType | undefined>(undefined)

// Provider component
export function StateProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with mock data
  const [bills, setBills] = useState<BillData[]>(mockBills)
  const [billsByMonth, setBillsByMonth] = useState<Record<string, BillData[]>>(mockBillsByMonth)
  const [providerData, setProviderData] = useState(mockProviderData)
  const [utilityTypeData, setUtilityTypeData] = useState(mockUtilityTypeData)
  const [trendData, setTrendData] = useState(mockTrendData)
  const [monthlyComparisonData, setMonthlyComparisonData] = useState(mockMonthlyComparisonData)

  // Function to add a new bill
  const addBill = (bill: BillData) => {
    // Generate ID if not provided
    const newBill = {
      ...bill,
      id: bill.id || generateBillId(),
      uploadDate: bill.uploadDate || new Date().toISOString(),
    }

    // Update bills array
    setBills((prevBills) => [newBill, ...prevBills])

    // Update billsByMonth
    const billDate = new Date(newBill.date)
    const monthKey = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, "0")}`

    setBillsByMonth((prev) => {
      const updatedBillsByMonth = { ...prev }
      if (!updatedBillsByMonth[monthKey]) {
        updatedBillsByMonth[monthKey] = []
      }
      updatedBillsByMonth[monthKey] = [newBill, ...updatedBillsByMonth[monthKey]]
      return updatedBillsByMonth
    })

    // Update provider data
    setProviderData((prev) => {
      const updatedProviderData = [...prev]
      const providerIndex = updatedProviderData.findIndex((p) => p.name === newBill.provider)
      if (providerIndex >= 0) {
        updatedProviderData[providerIndex].value += newBill.amount
      } else {
        updatedProviderData.push({ name: newBill.provider, value: newBill.amount })
      }
      return updatedProviderData
    })

    // Update utility type data
    setUtilityTypeData((prev) => {
      const updatedUtilityTypeData = [...prev]
      const typeIndex = updatedUtilityTypeData.findIndex((t) => t.name.toLowerCase() === newBill.type.toLowerCase())
      if (typeIndex >= 0) {
        updatedUtilityTypeData[typeIndex].value += newBill.amount
      } else {
        updatedUtilityTypeData.push({
          name: newBill.type.charAt(0).toUpperCase() + newBill.type.slice(1),
          value: newBill.amount,
        })
      }
      return updatedUtilityTypeData
    })

    // Update trend data (simplified - in a real app, this would be more complex)
    const monthName = billDate.toLocaleDateString("en-US", { month: "short" })
    setTrendData((prev) => {
      const updatedTrendData = [...prev]
      const monthIndex = updatedTrendData.findIndex((m) => m.month === monthName)
      if (monthIndex >= 0) {
        updatedTrendData[monthIndex][newBill.type] = (updatedTrendData[monthIndex][newBill.type] || 0) + newBill.amount
      }
      return updatedTrendData
    })

    // Update monthly comparison data
    setMonthlyComparisonData((prev) => {
      const updatedMonthlyData = [...prev]
      const monthIndex = updatedMonthlyData.findIndex((m) => m.month === monthName)
      if (monthIndex >= 0) {
        updatedMonthlyData[monthIndex].value += newBill.amount
      }
      return updatedMonthlyData
    })
  }

  // Function to delete a bill
  const deleteBill = (id: string) => {
    // Get the bill to delete
    const billToDelete = bills.find((b) => b.id === id)
    if (!billToDelete) return

    // Update bills array
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id))

    // Update billsByMonth
    const billDate = new Date(billToDelete.date)
    const monthKey = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, "0")}`

    setBillsByMonth((prev) => {
      const updatedBillsByMonth = { ...prev }
      if (updatedBillsByMonth[monthKey]) {
        updatedBillsByMonth[monthKey] = updatedBillsByMonth[monthKey].filter((bill) => bill.id !== id)
      }
      return updatedBillsByMonth
    })

    // Update other data structures similarly (omitted for brevity)
  }

  // Function to update a bill
  const updateBill = (id: string, updatedFields: Partial<BillData>) => {
    // Get the bill to update
    const billToUpdate = bills.find((b) => b.id === id)
    if (!billToUpdate) return

    // Update bills array
    setBills((prevBills) => prevBills.map((bill) => (bill.id === id ? { ...bill, ...updatedFields } : bill)))

    // Update billsByMonth and other data structures similarly (omitted for brevity)
  }

  // Provide the state and functions
  const value = {
    bills,
    billsByMonth,
    providerData,
    utilityTypeData,
    trendData,
    monthlyComparisonData,
    addBill,
    deleteBill,
    updateBill,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

// Hook to use the state context
export function useAppState() {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider")
  }
  return context
}
