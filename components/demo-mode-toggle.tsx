"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/auth-provider"

export function DemoModeToggle() {
  const { user } = useAuth()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [hasUserBills, setHasUserBills] = useState(false)

  useEffect(() => {
    // Check if user has any bills
    if (user) {
      const hasBills = localStorage.getItem(`user-${user.id}-has-bills`) === "true"
      setHasUserBills(hasBills)
    }
    // Check if demo mode is enabled
    const demoMode = localStorage.getItem("demo-mode") === "true"
    setIsDemoMode(demoMode)
  }, [user])

  // Only show the demo toggle for users with no bills
  if (hasUserBills) {
    return null
  }

  const toggleDemoMode = (checked: boolean) => {
    setIsDemoMode(checked)
    localStorage.setItem("demo-mode", checked ? "true" : "false")

    // Reload the page to apply changes
    window.location.reload()
  }

  return (
    <div className="flex items-center space-x-2 bg-sage-50 dark:bg-sage-900 p-2 rounded-md">
      <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={toggleDemoMode} />
      <Label htmlFor="demo-mode" className="text-sm">
        Demo Mode
      </Label>
      <span className="text-xs text-muted-foreground">(See sample data)</span>
    </div>
  )
}
