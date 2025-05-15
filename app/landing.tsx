"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2, BarChart3, Receipt, Calendar, ArrowRight } from "lucide-react"

export function LandingPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simple validation
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Sign in with email
    signIn(email)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-sage-900 dark:text-sage-50">
                Track Your Utility Bills <span className="text-sage-600 dark:text-sage-400">Effortlessly</span>
              </h1>
              <p className="text-lg md:text-xl text-sage-700 dark:text-sage-300">
                UtiliTrack helps you monitor, analyze, and optimize your utility expenses with powerful tracking and
                visualization tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-6 text-lg h-auto rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                  onClick={() => document.getElementById("sign-in-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
              {/* Custom dashboard visualization */}
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-sage-100 dark:bg-sage-800 rounded-md px-3 py-1.5 text-sage-700 dark:text-sage-300 font-medium text-sm">
                    Dashboard
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                {/* Charts area */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* Expense chart */}
                  <div className="bg-sage-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col">
                    <div className="text-xs font-medium mb-2 text-sage-700 dark:text-sage-300">Monthly Expenses</div>
                    <div className="flex-1 flex items-end space-x-1">
                      <div className="flex-1 bg-sage-300 dark:bg-sage-600 rounded-t-sm" style={{ height: "60%" }}></div>
                      <div className="flex-1 bg-sage-400 dark:bg-sage-500 rounded-t-sm" style={{ height: "80%" }}></div>
                      <div className="flex-1 bg-sage-500 dark:bg-sage-400 rounded-t-sm" style={{ height: "40%" }}></div>
                      <div className="flex-1 bg-sage-600 dark:bg-sage-300 rounded-t-sm" style={{ height: "70%" }}></div>
                      <div className="flex-1 bg-teal-400 dark:bg-teal-500 rounded-t-sm" style={{ height: "50%" }}></div>
                      <div className="flex-1 bg-teal-500 dark:bg-teal-400 rounded-t-sm" style={{ height: "90%" }}></div>
                    </div>
                  </div>

                  {/* Pie chart */}
                  <div className="bg-sage-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col">
                    <div className="text-xs font-medium mb-2 text-sage-700 dark:text-sage-300">
                      Expense Distribution
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <div
                          className="absolute inset-0 rounded-full border-8 border-sage-400 dark:border-sage-500"
                          style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-teal-400 dark:border-teal-500"
                          style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 100%, 50% 0)" }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-clay-400 dark:border-clay-500"
                          style={{ clipPath: "polygon(50% 100%, 100% 100%, 0 100%, 0 50%, 50% 50%)" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bills list */}
                <div className="mt-4 bg-white dark:bg-gray-900 rounded-lg p-3">
                  <div className="text-xs font-medium mb-2 text-sage-700 dark:text-sage-300">Recent Bills</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">Electricity</span>
                      </div>
                      <span className="font-medium">€65.99</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">Water</span>
                      </div>
                      <span className="font-medium">€32.50</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">Gas</span>
                      </div>
                      <span className="font-medium">€45.75</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-sage-500/10 to-teal-500/10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose UtiliTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-sage-50 to-sage-100 dark:from-sage-950 dark:to-sage-900 border-0 shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-sage-100 dark:bg-sage-800 p-4 mb-4">
                  <Receipt className="h-8 w-8 text-sage-600 dark:text-sage-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Bill Upload</h3>
                <p className="text-sage-700 dark:text-sage-300">
                  Simply upload your utility bills and we'll automatically extract key information using OCR technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-clay-50 to-clay-100 dark:from-clay-950 dark:to-clay-900 border-0 shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-clay-100 dark:bg-clay-800 p-4 mb-4">
                  <BarChart3 className="h-8 w-8 text-clay-600 dark:text-clay-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Insightful Analytics</h3>
                <p className="text-clay-700 dark:text-clay-300">
                  Visualize your spending patterns and identify trends with our intuitive dashboard and reports.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-olive-50 to-olive-100 dark:from-olive-950 dark:to-olive-900 border-0 shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-olive-100 dark:bg-olive-800 p-4 mb-4">
                  <Calendar className="h-8 w-8 text-olive-600 dark:text-olive-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bill Reminders</h3>
                <p className="text-olive-700 dark:text-olive-300">
                  Never miss a payment with timely reminders and due date tracking for all your utility bills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign In Section */}
      <section id="sign-in-section" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Get Started Today</h2>
            <p className="text-center text-muted-foreground mb-8">
              Enter your email to start tracking your utility bills
            </p>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700 text-white" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Start Tracking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-950 mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground mb-2">
            © 2025 UtiliTrack. A utility bill management solution for tracking and optimizing household expenses.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-sage-600 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-sage-600 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-sage-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
