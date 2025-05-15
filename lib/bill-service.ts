import { mockBills } from "./mock-data"

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

// Get all bills for a user
export async function getUserBills(userId: string): Promise<BillWithImage[]> {
  // Check if the user has any bills in the database or if demo mode is enabled
  const hasUserBills = localStorage.getItem(`user-${userId}-has-bills`) === "true"

  // If this is a new user with no bills and demo mode is not enabled, return an empty array
  if (!hasUserBills && !isDemoMode()) {
    return []
  }

  // For existing users or demo mode, return mock bills
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
    amount: number
    bill_date: string
    due_date?: string
    period_start?: string
    period_end?: string
    bill_type: string
  },
  userId: string,
  imageFile?: File,
): Promise<string | null> {
  // Mark that this user now has bills
  localStorage.setItem(`user-${userId}-has-bills`, "true")

  // Generate a mock bill ID
  return `bill-${Date.now()}`
}

// Delete a bill
export async function deleteBill(billId: string): Promise<boolean> {
  // Pretend to delete the bill
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

  // Calculate statistics from mock bills for existing users or demo mode
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
