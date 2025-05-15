import Tesseract from "tesseract.js"

// Configuration for Tesseract OCR
const OCR_CONFIG = {
  lang: "eng+hrv", // English + Croatian language support
  logger: (m: any) => console.log(m), // Optional logger for debugging
}

/**
 * Extracts text from an image using Tesseract OCR
 * @param imageFile The image file to process
 * @returns Promise with the extracted text
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(imageFile)

    // Show processing status in console
    console.log("Starting OCR processing...")

    // Process the image with Tesseract
    const result = await Tesseract.recognize(imageUrl, OCR_CONFIG.lang, {
      logger: OCR_CONFIG.logger,
    })

    // Release the object URL to free memory
    URL.revokeObjectURL(imageUrl)

    console.log("OCR processing complete")

    // Return the extracted text
    return result.data.text
  } catch (error) {
    console.error("OCR processing failed:", error)
    throw new Error("Failed to extract text from image")
  }
}

/**
 * Extracts specific data from OCR text based on patterns
 * @param text The OCR extracted text
 * @returns Object with extracted data fields
 */
export function extractDataFromOcrText(text: string): Record<string, string> {
  const extractedData: Record<string, string> = {}

  // Common patterns in Croatian utility bills
  const patterns = {
    amount: /(?:iznos|ukupno|total|cijena)[\s:]*(\d+[.,]\d{2})(?:\s*€|\s*EUR)?/i,
    date: /(?:datum|date|dan)[\s:]*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    dueDate: /(?:dospijeće|rok plaćanja|due date)[\s:]*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    periodStart: /(?:razdoblje od|period from)[\s:]*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    periodEnd: /(?:razdoblje do|period to)[\s:]*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    invoiceNumber: /(?:račun br|broj računa|invoice no)[.:]*\s*([A-Z0-9-]+)/i,
  }

  // Extract data using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern)
    if (match && match[1]) {
      // For dates, convert to YYYY-MM-DD format
      if (key.includes("date") || key.includes("period")) {
        extractedData[key] = formatDateString(match[1])
      } else {
        extractedData[key] = match[1].trim()
      }
    }
  }

  return extractedData
}

/**
 * Formats a date string to YYYY-MM-DD format
 * @param dateStr Date string in various formats (DD.MM.YYYY, DD/MM/YYYY, etc.)
 * @returns Formatted date string in YYYY-MM-DD format
 */
function formatDateString(dateStr: string): string {
  // Replace all separators with a standard one
  const standardized = dateStr.replace(/[./-]/g, "-")
  const parts = standardized.split("-")

  // Check if we have a valid date with 3 parts
  if (parts.length !== 3) return dateStr

  let day = parts[0]
  let month = parts[1]
  let year = parts[2]

  // Pad day and month with leading zeros if needed
  day = day.padStart(2, "0")
  month = month.padStart(2, "0")

  // Handle 2-digit years
  if (year.length === 2) {
    const currentYear = new Date().getFullYear()
    const century = Math.floor(currentYear / 100) * 100
    const twoDigitYear = Number.parseInt(year, 10)
    // If the 2-digit year is greater than the current 2-digit year, assume previous century
    const fullYear = twoDigitYear > currentYear % 100 ? century - 100 + twoDigitYear : century + twoDigitYear
    year = fullYear.toString()
  }

  // Return in YYYY-MM-DD format
  return `${year}-${month}-${day}`
}
