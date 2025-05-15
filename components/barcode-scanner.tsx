"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, X, RefreshCw } from "lucide-react"
import { initBarcodeScanner, startBarcodeScanner, stopBarcodeScanner, parseBarcodeData } from "@/lib/barcode-service"

interface BarcodeScannerProps {
  onBarcodeDetected: (data: Record<string, string>) => void
  onClose: () => void
}

export function BarcodeScanner({ onBarcodeDetected, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const initScanner = async () => {
      if (!scannerRef.current) return

      try {
        // Check for camera permission
        const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })

        if (permissionStatus.state === "denied") {
          setCameraPermission(false)
          setError("Camera access denied. Please enable camera permissions in your browser settings.")
          setIsInitializing(false)
          return
        }

        setCameraPermission(true)
        await initBarcodeScanner(scannerRef.current)

        if (isMounted) {
          setIsInitializing(false)

          startBarcodeScanner((result) => {
            if (isMounted && result.code) {
              // Parse the barcode data
              const parsedData = parseBarcodeData(result.code)

              // Stop scanner after successful detection
              stopBarcodeScanner()

              // Call the callback with the parsed data
              onBarcodeDetected({
                ...parsedData,
                barcode: result.code,
                format: result.format,
                confidence: result.confidence,
              })
            }
          })
        }
      } catch (err) {
        if (isMounted) {
          setError("Could not access camera. Please ensure you've granted camera permissions.")
          setIsInitializing(false)
          setCameraPermission(false)
        }
      }
    }

    initScanner()

    // Cleanup function
    return () => {
      isMounted = false
      stopBarcodeScanner()
    }
  }, [onBarcodeDetected])

  const retryScanner = () => {
    setIsInitializing(true)
    setError(null)
    setCameraPermission(null)

    // Small delay to ensure cleanup
    setTimeout(() => {
      if (scannerRef.current) {
        initBarcodeScanner(scannerRef.current)
          .then(() => {
            setIsInitializing(false)
            setCameraPermission(true)

            startBarcodeScanner((result) => {
              if (result.code) {
                // Parse the barcode data
                const parsedData = parseBarcodeData(result.code)

                // Stop scanner after successful detection
                stopBarcodeScanner()

                // Call the callback with the parsed data
                onBarcodeDetected({
                  ...parsedData,
                  barcode: result.code,
                  format: result.format,
                  confidence: result.confidence,
                })
              }
            })
          })
          .catch(() => {
            setError("Could not access camera. Please ensure you've granted camera permissions.")
            setIsInitializing(false)
            setCameraPermission(false)
          })
      }
    }, 500)
  }

  return (
    <Card className="relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="p-0">
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-900">
            <Loader2 className="h-8 w-8 text-sage-600 animate-spin mb-4" />
            <p className="text-muted-foreground">Initializing camera...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-900 p-4">
            <p className="text-red-500 mb-4 text-center">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={retryScanner} className="bg-sage-600 hover:bg-sage-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
            {!cameraPermission && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                You may need to update your browser settings to allow camera access
              </p>
            )}
          </div>
        ) : (
          <div className="relative">
            <div ref={scannerRef} className="w-full h-[300px] bg-black"></div>
            <div className="absolute inset-0 pointer-events-none border-2 border-sage-500 opacity-50 z-10">
              <div className="absolute top-0 left-0 right-0 h-1/3 border-b-2 border-sage-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 border-t-2 border-sage-500"></div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
              Position the barcode within the frame
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
