// Get current date and previous months for realistic data
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()

// Helper to create date strings in YYYY-MM-DD format
function getDateString(monthsAgo: number, day = 15): string {
  const date = new Date(currentYear, currentMonth - monthsAgo, day)
  return date.toISOString().split("T")[0]
}

// Helper to format month names in English
function getMonthName(monthsAgo: number): string {
  const date = new Date(currentYear, currentMonth - monthsAgo, 1)
  return date.toLocaleDateString("en-US", { month: "short" })
}

// Helper to get YYYY-MM format for month keys
function getMonthKey(monthsAgo: number): string {
  const date = new Date(currentYear, currentMonth - monthsAgo, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export const mockBills = [
  {
    id: "1",
    provider: "HEP",
    type: "Electricity",
    date: getDateString(0),
    amount: 65.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    provider: "Hrvatske vode",
    type: "Water",
    date: getDateString(0, 10),
    amount: 32.5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    provider: "Gradska plinara Zagreb",
    type: "Gas",
    date: getDateString(0, 5),
    amount: 45.75,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    provider: "Hrvatski Telekom",
    type: "Internet",
    date: getDateString(0, 1),
    amount: 29.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    provider: "A1",
    type: "Phone",
    date: getDateString(1, 28),
    amount: 25.0,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    provider: "Hrvatska Radiotelevizija",
    type: "TV",
    date: getDateString(0, 20),
    amount: 10.62,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export const mockProviderData = [
  { name: "HEP", value: 185.97 },
  { name: "Hrvatske vode", value: 95.5 },
  { name: "Gradska plinara Zagreb", value: 135.25 },
  { name: "Hrvatski Telekom", value: 89.97 },
  { name: "A1", value: 75.0 },
  { name: "Hrvatska Radiotelevizija", value: 31.86 },
]

export const mockUtilityTypeData = [
  { name: "Electricity", value: 185.97 },
  { name: "Water", value: 95.5 },
  { name: "Gas", value: 135.25 },
  { name: "Internet", value: 89.97 },
  { name: "Phone", value: 75.0 },
  { name: "TV", value: 31.86 },
]

// Create dynamic month keys based on current date
const currentMonthKey = getMonthKey(0)
const lastMonthKey = getMonthKey(1)
const twoMonthsAgoKey = getMonthKey(2)

// Ensure we have data for the current month
export const mockBillsByMonth = {
  [currentMonthKey]: [
    {
      id: "1",
      provider: "HEP",
      type: "Electricity",
      date: getDateString(0),
      amount: 65.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      provider: "Hrvatske vode",
      type: "Water",
      date: getDateString(0, 10),
      amount: 32.5,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      provider: "Gradska plinara Zagreb",
      type: "Gas",
      date: getDateString(0, 5),
      amount: 45.75,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      provider: "Hrvatski Telekom",
      type: "Internet",
      date: getDateString(0, 1),
      amount: 29.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "11",
      provider: "Hrvatska Radiotelevizija",
      type: "TV",
      date: getDateString(0, 20),
      amount: 10.62,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  [lastMonthKey]: [
    {
      id: "5",
      provider: "A1",
      type: "Phone",
      date: getDateString(1, 28),
      amount: 25.0,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "6",
      provider: "HEP",
      type: "Electricity",
      date: getDateString(1, 15),
      amount: 59.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "7",
      provider: "Hrvatske vode",
      type: "Water",
      date: getDateString(1, 10),
      amount: 31.0,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "12",
      provider: "Hrvatska Radiotelevizija",
      type: "TV",
      date: getDateString(1, 20),
      amount: 10.62,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  [twoMonthsAgoKey]: [
    {
      id: "8",
      provider: "Gradska plinara Zagreb",
      type: "Gas",
      date: getDateString(2, 5),
      amount: 52.75,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "9",
      provider: "Hrvatski Telekom",
      type: "Internet",
      date: getDateString(2, 1),
      amount: 29.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "10",
      provider: "A1",
      type: "Phone",
      date: getDateString(2, 28),
      amount: 25.0,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "13",
      provider: "Hrvatska Radiotelevizija",
      type: "TV",
      date: getDateString(2, 20),
      amount: 10.62,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
}

// Create dynamic month names for trend data
export const mockTrendData = [
  {
    month: getMonthName(11),
    electricity: 65,
    water: 28,
    gas: 45,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(10),
    electricity: 59,
    water: 32,
    gas: 49,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(9),
    electricity: 60,
    water: 30,
    gas: 36,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(8),
    electricity: 61,
    water: 35,
    gas: 28,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(7),
    electricity: 65,
    water: 32,
    gas: 32,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(6),
    electricity: 55,
    water: 35,
    gas: 29,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(5),
    electricity: 50,
    water: 40,
    gas: 25,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(4),
    electricity: 52,
    water: 38,
    gas: 26,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(3),
    electricity: 55,
    water: 32,
    gas: 30,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(2),
    electricity: 60,
    water: 28,
    gas: 38,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(1),
    electricity: 65,
    water: 25,
    gas: 42,
    internet: 30,
    tv: 10.62,
  },
  {
    month: getMonthName(0),
    electricity: 72,
    water: 30,
    gas: 48,
    internet: 30,
    tv: 10.62,
  },
]

// Create dynamic month names for comparison data
export const mockMonthlyComparisonData = [
  { month: getMonthName(5), value: 180 },
  { month: getMonthName(4), value: 170 },
  { month: getMonthName(3), value: 190 },
  { month: getMonthName(2), value: 200 },
  { month: getMonthName(1), value: 210 },
  { month: getMonthName(0), value: 180 },
]
