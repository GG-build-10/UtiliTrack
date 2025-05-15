import { createClient } from "@supabase/supabase-js"

// Types for our database
export type Profile = {
  id: string
  created_at: string
  updated_at: string
}

export type Bill = {
  id: string
  user_id: string
  provider: string
  amount: number
  bill_date: string
  due_date: string | null
  period_start: string | null
  period_end: string | null
  bill_type: string
  created_at: string
  updated_at: string
}

export type BillImage = {
  id: string
  bill_id: string
  storage_path: string
  created_at: string
}

// Create a single supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient<{
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
      }
      bills: {
        Row: Bill
        Insert: Omit<Bill, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Bill, "id" | "user_id" | "created_at" | "updated_at">>
      }
      bill_images: {
        Row: BillImage
        Insert: Omit<BillImage, "id" | "created_at">
        Update: Partial<Omit<BillImage, "id" | "bill_id" | "created_at">>
      }
    }
  }
}>(supabaseUrl, supabaseAnonKey)

// Create a server-side supabase client (for server components and API routes)
export const createServerSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: {
      persistSession: false,
    },
  })
}
