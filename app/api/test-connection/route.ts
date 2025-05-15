import { NextResponse } from "next/server"
import { checkSupabaseConnection } from "@/lib/bill-service"

export async function GET() {
  try {
    const isConnected = await checkSupabaseConnection()

    return NextResponse.json({
      success: true,
      connected: isConnected,
      message: isConnected ? "Successfully connected to Supabase" : "Failed to connect to Supabase",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        message: "Error testing Supabase connection",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
