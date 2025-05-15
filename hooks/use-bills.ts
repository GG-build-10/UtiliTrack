"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getUserBills, type BillWithImage } from "@/lib/bill-service"

export function useBills() {
  const { user } = useAuth()
  const [bills, setBills] = useState<BillWithImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBills = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const userBills = await getUserBills(user.id)
        setBills(userBills)
      } catch (err) {
        console.error("Error fetching bills:", err)
        setError("Failed to load bills")
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [user])

  const refreshBills = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const userBills = await getUserBills(user.id)
      setBills(userBills)
    } catch (err) {
      console.error("Error refreshing bills:", err)
      setError("Failed to refresh bills")
    } finally {
      setLoading(false)
    }
  }

  return { bills, loading, error, refreshBills }
}
