"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Barcode, Upload, ArrowLeft } from "lucide-react"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { OcrScanner } from "@/components/ocr-scanner"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { saveBill } from "@/lib/bill-service"
import { processBillImage } from "@/lib/bill-processing"

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBarcodeDetected = async (data: Record<string, string>) => {
    setIsProcessing(true)

    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save bills",
          variant: "destructive",
        })
        return
      }

      // Prepare bill data from barcode
      const billData = {
        provider: data.provider || "Unknown Provider",
        bill_type: data.type || "other",
        amount: Number.parseFloat(data.amount || "0"),
        bill_date: new Date().toISOString().split("T")[0],
        due_date: data.dueDate,
        reference: data.reference,
      }

      // Save bill
      await saveBill(billData, user.id)

      toast({
        title: "Bill saved",
        description: "Your bill has been successfully saved",
      })

      // Navigate to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error saving bill:", error)
      toast({
        title: "Error",
        description: "Failed to save the bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setShowBarcodeScanner(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save bills",
          variant: "destructive",
        })
        return
      }

      // Process the image to extract data
      const extractedData = await processBillImage(file)

      // Prepare bill data
      const billData = {
        provider: extractedData.provider || "Unknown Provider",
        bill_type: extractedData.type || "other",
        amount: extractedData.amount || 0,
        bill_date: extractedData.date || new Date().toISOString().split("T")[0],
        due_date: extractedData.dueDate,
        period_start: extractedData.periodStart,
        period_end: extractedData.periodEnd,
      }

      // Save bill with image
      await saveBill(billData, user.id, file)

      toast({
        title: "Bill saved",
        description: "Your bill has been successfully saved",
      })

      // Navigate to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error processing and saving bill:", error)
      toast({
        title: "Error",
        description: "Failed to process and save the bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageCaptured = async (imageFile: File) => {
    setIsProcessing(true)

    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save bills",
          variant: "destructive",
        })
        return
      }

      // Process the image to extract data
      const extractedData = await processBillImage(imageFile)

      // Prepare bill data
      const billData = {
        provider: extractedData.provider || "Unknown Provider",
        bill_type: extractedData.type || "other",
        amount: extractedData.amount || 0,
        bill_date: extractedData.date || new Date().toISOString().split("T")[0],
        due_date: extractedData.dueDate,
        period_start: extractedData.periodStart,
        period_end: extractedData.periodEnd,
      }

      // Save bill with image
      await saveBill(billData, user.id, imageFile)

      toast({
        title: "Bill saved",
        description: "Your bill has been successfully saved",
      })

      // Navigate to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error processing and saving bill:", error)
      toast({
        title: "Error",
        description: "Failed to process and save the bill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setShowImageUpload(false)
    }
  }

  const handleTextExtracted = () => {
    // We don't need to do anything here as we're processing the image directly
  }

  return (
    <div className="container mx-auto py-6 space-y-8 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload New Bill</h1>
          <p className="text-muted-foreground">Add a new utility bill to your tracker</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {!showBarcodeScanner && !showImageUpload && !isProcessing ? (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <Card className="overflow-hidden border-2 border-sage-200 hover:border-sage-400 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center mb-4">
                  <Barcode className="h-8 w-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Scan Barcode</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Quickly extract bill information by scanning the barcode
                </p>
                <Button
                  className="bg-sage-600 hover:bg-sage-700 w-full sm:w-auto"
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  Scan Barcode
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-teal-200 hover:border-teal-400 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Upload Image</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Upload a photo of your bill to extract data</p>
                <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto" onClick={handleFileSelect}>
                  Upload Image
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          {showBarcodeScanner && (
            <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} onClose={() => setShowBarcodeScanner(false)} />
          )}

          {showImageUpload && (
            <OcrScanner
              onTextExtracted={handleTextExtracted}
              onImageCaptured={handleImageCaptured}
              onClose={() => setShowImageUpload(false)}
            />
          )}

          {isProcessing && (
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mb-4"></div>
              <p className="text-lg font-medium">Processing your bill...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
