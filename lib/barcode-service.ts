import Quagga from "@ericblade/quagga2"

/**
 * Detects barcodes in an image file
 * @param imageFile The image file to process
 * @returns Promise that resolves with the detected barcode data or null if none found
 */
export async function detectBarcodeInImage(imageFile: File): Promise<{ code: string; format: string } | null> {
  return new Promise((resolve) => {
    // Create an image element to load the file
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("Could not get canvas context")
        resolve(null)
        return
      }

      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, img.width, img.height)

      // Get image data as grayscale - this helps with barcode detection
      const imageData = ctx.getImageData(0, 0, img.width, img.height)

      // Configure Quagga for single image processing
      Quagga.decodeSingle(
        {
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
              "2of5_reader",
              "code_93_reader",
            ],
          },
          locate: true,
          src: canvas.toDataURL(),
        },
        (result) => {
          if (result && result.codeResult) {
            console.log("Barcode detected:", result.codeResult)
            resolve({
              code: result.codeResult.code,
              format: result.codeResult.format,
            })
          } else {
            console.log("No barcode detected")
            resolve(null)
          }
        },
      )
    }

    img.onerror = () => {
      console.error("Error loading image for barcode detection")
      resolve(null)
    }

    // Load the image from the file
    img.src = URL.createObjectURL(imageFile)
  })
}

// Configuration for Quagga barcode scanner for static image processing
const BARCODE_CONFIG = {
  inputStream: {
    name: "Live",
    type: "LiveStream",
    constraints: {
      width: { min: 640 },
      height: { min: 480 },
      facingMode: "environment", // Use the rear camera
    },
    target: null,
  },
  locator: {
    patchSize: "medium",
    halfSample: true,
  },
  numOfWorkers: 4,
  frequency: 10,
  decoder: {
    readers: [
      "code_128_reader",
      "ean_reader",
      "ean_8_reader",
      "code_39_reader",
      "code_39_vin_reader",
      "codabar_reader",
      "upc_reader",
      "upc_e_reader",
      "i2of5_reader",
      "2of5_reader",
      "code_93_reader",
    ],
  },
  locate: true,
}

/**
 * Initializes the barcode scanner
 * @param scannerNode The DOM node to attach the scanner to
 */
export async function initBarcodeScanner(scannerNode: HTMLDivElement): Promise<void> {
  BARCODE_CONFIG.inputStream.target = scannerNode

  return new Promise((resolve, reject) => {
    Quagga.init(BARCODE_CONFIG, (err) => {
      if (err) {
        console.error("QuaggaJS initialization failed:", err)
        reject(err)
        return
      }
      console.log("QuaggaJS initialization succeeded")
      resolve()
    })
  })
}

/**
 * Starts the barcode scanner
 * @param onDetected Callback function to handle detected barcodes
 */
export function startBarcodeScanner(onDetected: (result: any) => void): void {
  Quagga.onDetected((result) => {
    console.log("Barcode detected and calling onDetected callback")
    onDetected(result)
  })

  Quagga.start()
  console.log("QuaggaJS started")
}

/**
 * Stops the barcode scanner
 */
export function stopBarcodeScanner(): void {
  Quagga.offDetected()
  Quagga.stop()
  console.log("QuaggaJS stopped")
}

/**
 * Parses a utility bill barcode
 * @param barcodeData The barcode data to parse
 * @returns Object with parsed data
 */
export function parseBarcodeData(barcodeData: string): Record<string, string> {
  const parsedData: Record<string, string> = {}

  // Croatian utility bill barcodes often follow the HUB3 standard
  // Format: HUB3A{amount}{model}{reference}{account}{purpose}

  // Example parsing logic (adjust based on actual barcode format)
  if (barcodeData.startsWith("HUB3A")) {
    // Extract amount (positions 6-18, divided by 100 to get decimal places)
    const amountRaw = barcodeData.substring(5, 17)
    const amount = (Number.parseInt(amountRaw) / 100).toFixed(2)
    parsedData.amount = amount

    // Extract reference number (positions 24-49)
    parsedData.reference = barcodeData.substring(23, 48).trim()

    // Extract account number (positions 50-70)
    parsedData.account = barcodeData.substring(49, 69).trim()
  } else {
    // For other barcode formats, store the raw data
    parsedData.rawData = barcodeData
  }

  return parsedData
}
