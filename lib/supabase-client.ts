import { createClient } from "@supabase/supabase-js"

// For client components - singleton pattern to avoid multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Create client with options to avoid database schema queries
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    // Disable realtime subscriptions to avoid schema queries
    realtime: {
      params: {
        eventsPerSecond: 0,
      },
    },
  })

  return supabaseClient
}

// For server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    // Disable realtime subscriptions to avoid schema queries
    realtime: {
      params: {
        eventsPerSecond: 0,
      },
    },
  })
}
