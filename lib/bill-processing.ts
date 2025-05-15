import { categorizeProvider, type UtilityType } from "./providers-mapping"
import { extractTextFromImage, extractDataFromOcrText } from "./ocr-service"
import { detectBarcodeInImage, parseBarcodeData } from "./barcode-service"

export interface BillData {
  id?: string
  provider: string
  type: UtilityType
  amount: number
  date: string
  dueDate?: string
  periodStart?: string
  periodEnd?: string
  image?: string
  barcode?: string
  reference?: string
  account?: string
  rawText?: string
  uploadDate?: string
}

// Main function to process a bill image and extract data using both OCR and barcode detection
export async function processBillImage(imageFile: File): Promise<Partial<BillData>> {
  console.log("Processing bill image:", imageFile.name)

  try {
    // Create a processing status message
    const statusUpdate = (message: string) => {
      console.log(`Processing status: ${message}`)
    }

    statusUpdate("Starting bill processing")

    // Step 1: Extract text using OCR
    statusUpdate("Extracting text with OCR")
    const extractedText = await extractTextFromImage(imageFile)

    // Step 2: Extract structured data from OCR text
    statusUpdate("Parsing OCR text")
    const ocrData = extractDataFromOcrText(extractedText)

    // Step 3: Try to detect barcode in the image
    statusUpdate("Detecting barcode")
    const barcodeResult = await detectBarcodeInImage(imageFile)

    // Step 4: Parse barcode data if found
    let barcodeData = {}
    if (barcodeResult && barcodeResult.code) {
      statusUpdate("Parsing barcode data")
      barcodeData = parseBarcodeData(barcodeResult.code)
    }

    // Step 5: Try to identify provider from OCR text
    statusUpdate("Identifying provider")
    const providerInfo = categorizeProvider(extractedText)

    // Step 6: Combine all data, with barcode data taking precedence for overlapping fields
    const billData: Partial<BillData> = {
      // Provider info from OCR
      provider: providerInfo?.name || "",
      type: providerInfo?.type || ("" as UtilityType),

      // Combine data from OCR and barcode, with barcode taking precedence
      amount: Number.parseFloat((barcodeData as any).amount || ocrData.amount || "0"),
      date: ocrData.date || "",
      dueDate: ocrData.dueDate || "",
      periodStart: ocrData.periodStart || "",
      periodEnd: ocrData.periodEnd || "",

      // Barcode specific data
      barcode: barcodeResult?.code || "",
      reference: (barcodeData as any).reference || "",
      account: (barcodeData as any).account || "",

      // Store raw OCR text for reference
      rawText: extractedText,

      // Add image reference
      image: URL.createObjectURL(imageFile),

      // Add upload date
      uploadDate: new Date().toISOString(),
    }

    statusUpdate("Bill processing complete")
    return billData
  } catch (error) {
    console.error("Error processing bill:", error)
    // Return minimal data with the image at least
    return {
      image: URL.createObjectURL(imageFile),
      uploadDate: new Date().toISOString(),
    }
  }
}

// Generate a unique ID for a new bill
export function generateBillId(): string {
  return `bill_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
