"use client"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, History, Upload } from "lucide-react"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuth } from "@/components/auth/auth-provider"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-3 mr-6">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sage-500 to-teal-500 shadow-md">
              <BarChart3 className="h-4 w-4 text-white absolute" />
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-teal-600 dark:from-sage-400 dark:to-teal-400">
              UtiliTrack
            </span>
          </Link>

          {user && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {user ? (
          <UserProfile />
        ) : (
          <Button asChild variant="outline" size="sm">
            <a href="#sign-in-section">Sign In</a>
          </Button>
        )}
      </div>
    </header>
  )
}
