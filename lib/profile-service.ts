import { getSupabaseClient } from "./supabase-client"

export type Profile = {
  id: string
  created_at: string
  updated_at: string
}

// Get user profile
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}
