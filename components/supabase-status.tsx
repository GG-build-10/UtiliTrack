"use client"

import { useEffect, useState } from "react"
import { checkSupabaseConnection } from "@/lib/bill-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection()
        setIsConnected(connected)
      } catch (error) {
        console.error("Error checking Supabase connection:", error)
        setIsConnected(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkConnection()
  }, [])

  if (isChecking) {
    return (
      <Alert className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <AlertCircle className="h-4 w-4 text-gray-500 animate-pulse" />
        <AlertTitle>Checking Supabase Connection</AlertTitle>
        <AlertDescription>Please wait while we check the database connection...</AlertDescription>
      </Alert>
    )
  }

  if (isConnected) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>Supabase Connected</AlertTitle>
        <AlertDescription>Your application is successfully connected to Supabase.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Supabase Connection Failed</AlertTitle>
      <AlertDescription>
        Unable to connect to Supabase. The application will use mock data instead. Please check your environment
        variables and Supabase configuration.
      </AlertDescription>
    </Alert>
  )
}
