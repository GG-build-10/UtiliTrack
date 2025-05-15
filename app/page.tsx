import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LandingPage } from "./landing"

export default function Page() {
  // Check if user is authenticated
  const cookieStore = cookies()
  const userEmail = cookieStore.get("user-email")

  // If authenticated, redirect to home page
  if (userEmail) {
    redirect("/dashboard")
  }

  // If not authenticated, show landing page
  return <LandingPage />
}
