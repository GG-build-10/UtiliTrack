import { mockBills } from "./mock-data"
import { createClient } from "@supabase/supabase-js"

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

export type BillWithImage = Bill & {
  image_url?: string
}

// Add this at the top of the file
function isDemoMode(): boolean {
  return typeof window !== "undefined" && localStorage.getItem("demo-mode") === "true"
}

// Create a Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
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
}

// Check if Supabase is connected
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) return false

    // Try a simple query to check connection
    const { error } = await supabase.from("bills").select("count").limit(1)

    return !error
  } catch (error) {
    console.error("Supabase connection error:", error)
    return false
  }
}

// Get all bills for a user
export async function getUserBills(userId: string): Promise<BillWithImage[]> {
  // Check if the user has any bills in the database or if demo mode is enabled
  const hasUserBills = localStorage.getItem(`user-${userId}-has-bills`) === "true"

  // If this is a new user with no bills and demo mode is not enabled, return an empty array
  if (!hasUserBills && !isDemoMode()) {
    return []
  }

  try {
    // Try to get bills from Supabase
    const supabase = createSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          bill_images (
            id,
            storage_path
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        // Format the data to match BillWithImage type
        return data.map((bill: any) => {
          const imageUrl =
            bill.bill_images && bill.bill_images[0]?.storage_path ? bill.bill_images[0].storage_path : null

          return {
            ...bill,
            image_url: imageUrl,
          }
        })
      }
    }
  } catch (error) {
    console.error("Error fetching bills from Supabase:", error)
  }

  // Fallback to mock data
  return mockBills.map((bill) => ({
    id: bill.id,
    user_id: userId,
    provider: bill.provider,
    amount: bill.amount,
    bill_date: bill.date,
    due_date: null,
    period_start: null,
    period_end: null,
    bill_type: bill.type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: bill.image,
  }))
}

// Get a single bill by ID
export async function getBillById(billId: string): Promise<BillWithImage | null> {
  try {
    // Try to get bill from Supabase
    const supabase = createSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          bill_images (
            id,
            storage_path
          )
        `)
        .eq("id", billId)
        .single()

      if (!error && data) {
        const imageUrl = data.bill_images && data.bill_images[0]?.storage_path ? data.bill_images[0].storage_path : null

        return {
          ...data,
          image_url: imageUrl,
        }
      }
    }
  } catch (error) {
    console.error("Error fetching bill from Supabase:", error)
  }

  // Fallback to mock data
  const mockBill = mockBills.find((bill) => bill.id === billId)
  if (!mockBill) {
    // If not found, return the first mock bill
    const firstBill = mockBills[0]
    return {
      id: firstBill.id,
      user_id: "user-id",
      provider: firstBill.provider,
      amount: firstBill.amount,
      bill_date: firstBill.date,
      due_date: null,
      period_start: null,
      period_end: null,
      bill_type: firstBill.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: firstBill.image,
    }
  }

  return {
    id: mockBill.id,
    user_id: "user-id",
    provider: mockBill.provider,
    amount: mockBill.amount,
    bill_date: mockBill.date,
    due_date: null,
    period_start: null,
    period_end: null,
    bill_type: mockBill.type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: mockBill.image,
  }
}

// Save bill data
export async function saveBill(
  billData: {
    provider: string
    bill_type: string
    amount: number
    bill_date: string
    due_date?: string
    period_start?: string
    period_end?: string
    reference?: string
  },
  userId: string,
  imageFile?: File,
): Promise<string | null> {
  // Mark that this user now has bills
  localStorage.setItem(`user-${userId}-has-bills`, "true")

  try {
    // Try to save to Supabase
    const supabase = createSupabaseClient()
    if (supabase) {
      // Insert bill data
      const { data: billData, error: billError } = await supabase
        .from("bills")
        .insert([
          {
            user_id: userId,
            provider: billData.provider,
            amount: billData.amount,
            bill_date: billData.bill_date,
            due_date: billData.due_date || null,
            period_start: billData.period_start || null,
            period_end: billData.period_end || null,
            bill_type: billData.bill_type,
          },
        ])
        .select()

      if (billError) {
        console.error("Error saving bill to Supabase:", billError)
        return null
      }

      const billId = billData[0].id

      // If we have an image file, upload it to storage
      if (imageFile && billId) {
        const fileExt = imageFile.name.split(".").pop()
        const filePath = `${userId}/${billId}/${Date.now()}.${fileExt}`

        // Upload file to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from("bill-images")
          .upload(filePath, imageFile)

        if (storageError) {
          console.error("Error uploading image to Supabase storage:", storageError)
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage.from("bill-images").getPublicUrl(filePath)

          // Save image reference to database
          if (publicUrlData) {
            const { error: imageError } = await supabase.from("bill_images").insert([
              {
                bill_id: billId,
                storage_path: publicUrlData.publicUrl,
              },
            ])

            if (imageError) {
              console.error("Error saving image reference to Supabase:", imageError)
            }
          }
        }
      }

      return billId
    }
  } catch (error) {
    console.error("Error saving bill:", error)
  }

  // Generate a mock bill ID as fallback
  return `bill-${Date.now()}`
}

// Delete a bill
export async function deleteBill(billId: string): Promise<boolean> {
  try {
    // Try to delete from Supabase
    const supabase = createSupabaseClient()
    if (supabase) {
      // First get the bill to check for images
      const { data: billData } = await supabase
        .from("bills")
        .select(`
          *,
          bill_images (
            id,
            storage_path
          )
        `)
        .eq("id", billId)
        .single()

      // Delete associated images from storage if they exist
      if (billData && billData.bill_images && billData.bill_images.length > 0) {
        for (const image of billData.bill_images) {
          // Extract the path from the URL
          const storagePath = image.storage_path.split("/").slice(-3).join("/")

          // Delete from storage
          await supabase.storage.from("bill-images").remove([storagePath])
        }

        // Delete image references
        await supabase.from("bill_images").delete().eq("bill_id", billId)
      }

      // Delete the bill
      const { error } = await supabase.from("bills").delete().eq("id", billId)

      if (error) {
        console.error("Error deleting bill from Supabase:", error)
        return false
      }

      return true
    }
  } catch (error) {
    console.error("Error deleting bill:", error)
  }

  // Pretend to delete the bill as fallback
  return true
}

// Get bill statistics
export async function getBillStatistics(userId: string): Promise<{
  totalAmount: number
  billCount: number
  averageAmount: number
  byProvider: { provider: string; amount: number }[]
  byType: { type: string; amount: number }[]
}> {
  // Check if the user has any bills or if demo mode is enabled
  const hasUserBills = localStorage.getItem(`user-${userId}-has-bills`) === "true"

  // If this is a new user with no bills and demo mode is not enabled, return empty statistics
  if (!hasUserBills && !isDemoMode()) {
    return {
      totalAmount: 0,
      billCount: 0,
      averageAmount: 0,
      byProvider: [],
      byType: [],
    }
  }

  try {
    // Try to get statistics from Supabase
    const supabase = createSupabaseClient()
    if (supabase) {
      // Get all bills for the user
      const { data, error } = await supabase.from("bills").select("*").eq("user_id", userId)

      if (!error && data && data.length > 0) {
        // Calculate statistics
        const totalAmount = data.reduce((sum, bill) => sum + Number(bill.amount), 0)
        const billCount = data.length
        const averageAmount = totalAmount / billCount

        // Group by provider
        const providerMap: Record<string, number> = {}
        data.forEach((bill) => {
          providerMap[bill.provider] = (providerMap[bill.provider] || 0) + Number(bill.amount)
        })
        const byProvider = Object.entries(providerMap).map(([provider, amount]) => ({ provider, amount }))

        // Group by type
        const typeMap: Record<string, number> = {}
        data.forEach((bill) => {
          typeMap[bill.bill_type] = (typeMap[bill.bill_type] || 0) + Number(bill.amount)
        })
        const byType = Object.entries(typeMap).map(([type, amount]) => ({ type, amount }))

        return {
          totalAmount,
          billCount,
          averageAmount,
          byProvider,
          byType,
        }
      }
    }
  } catch (error) {
    console.error("Error getting bill statistics from Supabase:", error)
  }

  // Calculate statistics from mock bills for existing users or demo mode as fallback
  const totalAmount = mockBills.reduce((sum, bill) => sum + bill.amount, 0)
  const billCount = mockBills.length
  const averageAmount = totalAmount / billCount

  // Group by provider
  const providerMap: Record<string, number> = {}
  mockBills.forEach((bill) => {
    providerMap[bill.provider] = (providerMap[bill.provider] || 0) + bill.amount
  })
  const byProvider = Object.entries(providerMap).map(([provider, amount]) => ({ provider, amount }))

  // Group by type
  const typeMap: Record<string, number> = {}
  mockBills.forEach((bill) => {
    typeMap[bill.type] = (typeMap[bill.type] || 0) + bill.amount
  })
  const byType = Object.entries(typeMap).map(([type, amount]) => ({ type, amount }))

  return {
    totalAmount,
    billCount,
    averageAmount,
    byProvider,
    byType,
  }
}
