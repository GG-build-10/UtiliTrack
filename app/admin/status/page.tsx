import { SupabaseStatus } from "@/components/supabase-status"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StatusPage() {
  return (
    <div className="container mx-auto py-6 space-y-8 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground">Check the status of your application components</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        <h2 className="text-xl font-semibold">Database Connection</h2>
        <SupabaseStatus />
      </div>
    </div>
  )
}
