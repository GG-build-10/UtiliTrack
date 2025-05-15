import { categorizeProvider, type UtilityType } from "./providers-mapping"

export interface BillData {
  provider: string
  type: UtilityType
  amount: number
  date: string
  image?: string
}

// Function to extract text from an image (mock implementation)
// In a real app, this would use OCR or a service like Google Cloud Vision
export async function extractTextFromImage(imageFile: File): Promise<string> {
  // This is a mock function - in a real app, you would use OCR
  console.log("Extracting text from image:", imageFile.name)

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock text based on filename to simulate OCR
  const filename = imageFile.name.toLowerCase()
  if (filename.includes("hep") || filename.includes("elektra")) {
    return "HEP Elektra Račun za električnu energiju Iznos: 65,99 € Datum: 15.05.2023"
  } else if (filename.includes("voda") || filename.includes("vode")) {
    return "Hrvatske vode Račun za vodu Iznos: 32,50 € Datum: 10.05.2023"
  } else if (filename.includes("plin") || filename.includes("plinara")) {
    return "Gradska plinara Zagreb Račun za plin Iznos: 45,75 € Datum: 05.05.2023"
  } else if (filename.includes("telekom") || filename.includes("internet")) {
    return "Hrvatski Telekom Internet račun Iznos: 29,99 € Datum: 01.05.2023"
  } else if (filename.includes("a1") || filename.includes("telefon")) {
    return "A1 Hrvatska Račun za mobilne usluge Iznos: 25,00 € Datum: 28.04.2023"
  } else if (filename.includes("hrt") || filename.includes("tv") || filename.includes("pristojba")) {
    return "Hrvatska Radiotelevizija Mjesečna pristojba Iznos: 10,62 € Datum: 20.05.2023"
  }

  // Default mock text
  return "Komunalni račun Iznos: 40,00 € Datum: 01.05.2023"
}

// Function to extract bill data from text
export function extractBillDataFromText(text: string): Partial<BillData> {
  const data: Partial<BillData> = {}

  // Try to identify provider and type
  const providerInfo = categorizeProvider(text)
  if (providerInfo) {
    data.provider = providerInfo.name
    data.type = providerInfo.type
  }

  // Extract amount using regex - looking for Euro amounts
  // This handles formats like: 45,99 € or 45.99 € or 45 €
  const amountMatch = text.match(/(\d+(?:[,.]\d{1,2})?)(?:\s*)?(?:€|EUR)/i)
  if (amountMatch && amountMatch[1]) {
    // Convert comma to dot for proper parsing if needed
    const normalizedAmount = amountMatch[1].replace(",", ".")
    data.amount = Number.parseFloat(normalizedAmount)
  }

  // Extract date using regex (assuming DD.MM.YYYY format common in Croatia)
  const dateMatch = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/)
  if (dateMatch) {
    // Convert to YYYY-MM-DD format for consistency
    const day = dateMatch[1].padStart(2, "0")
    const month = dateMatch[2].padStart(2, "0")
    const year = dateMatch[3]
    data.date = `${year}-${month}-${day}`
  }

  return data
}

// Main function to process a bill image and extract data
export async function processBillImage(imageFile: File): Promise<Partial<BillData>> {
  // Extract text from image
  const extractedText = await extractTextFromImage(imageFile)

  // Extract bill data from text
  const billData = extractBillDataFromText(extractedText)

  // Add image reference
  billData.image = URL.createObjectURL(imageFile)

  return billData
}
