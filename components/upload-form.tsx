"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Barcode, ImageIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { processBillImage } from "@/lib/bill-processing"
import { providersMapping, type UtilityType } from "@/lib/providers-mapping"

export function UploadForm() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<"scan" | "upload" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form data state
  const [billData, setBillData] = useState({
    provider: "",
    type: "" as UtilityType,
    amount: "",
    date: "",
    image: "",
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessing(true)

      try {
        // Create object URL for preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        setUploadMethod("upload")

        // Process the bill image to extract data
        const extractedData = await processBillImage(file)

        // Update form with extracted data
        setBillData({
          provider: extractedData.provider || "",
          type: extractedData.type || ("" as UtilityType),
          amount: extractedData.amount?.toString() || "",
          date: extractedData.date || "",
          image: extractedData.image || "",
        })
      } catch (error) {
        console.error("Error processing bill:", error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setIsProcessing(true)

      try {
        // Create object URL for preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        setUploadMethod("upload")

        // Process the bill image to extract data
        const extractedData = await processBillImage(file)

        // Update form with extracted data
        setBillData({
          provider: extractedData.provider || "",
          type: extractedData.type || ("" as UtilityType),
          amount: extractedData.amount?.toString() || "",
          date: extractedData.date || "",
          image: extractedData.image || "",
        })
      } catch (error) {
        console.error("Error processing bill:", error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleScanBarcode = () => {
    setUploadMethod("scan")
    setIsProcessing(true)

    // Simulate barcode scanning and data extraction
    setTimeout(() => {
      setPreview("/placeholder.svg?height=300&width=300")
      setBillData({
        provider: "HEP",
        type: "electricity",
        amount: "65.99",
        date: "2023-05-15",
        image: "/placeholder.svg?height=300&width=300",
      })
      setIsProcessing(false)
    }, 1500)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Prepare data for submission
    const formData = {
      ...billData,
      amount: Number.parseFloat(billData.amount),
    }

    console.log("Submitting bill data:", formData)

    // Simulate form submission
    setTimeout(() => {
      setIsUploading(false)
      router.push("/")
    }, 1500)
  }

  // Get unique utility types for the dropdown
  const utilityTypes = Array.from(new Set(providersMapping.map((p) => p.type)))

  return (
    <form onSubmit={handleSubmit}>
      {!preview && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card
              className="border-2 border-dashed hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer overflow-hidden"
              onClick={handleScanBarcode}
            >
              <div className="h-1 bg-blue-500"></div>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4">
                  <Barcode className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scan the barcode on the bill</h3>
                <p className="text-muted-foreground">Recommended</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-dashed hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors cursor-pointer overflow-hidden"
              onClick={handleUploadClick}
            >
              <div className="h-1 bg-teal-500"></div>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/30 p-4 mb-4">
                  <ImageIcon className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload an image of the bill</h3>
                <p className="text-muted-foreground">Alternative</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {preview && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <p className="text-lg">Processing your bill...</p>
                <p className="text-sm text-muted-foreground">We're extracting information from your bill</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {uploadMethod === "scan" ? "Scanned Barcode" : "Uploaded Bill"}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative h-64 w-full overflow-hidden rounded-md mb-4">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${preview})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Select
                        value={billData.provider}
                        onValueChange={(value) => setBillData({ ...billData, provider: value })}
                      >
                        <SelectTrigger id="provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providersMapping.map((provider) => (
                            <SelectItem key={provider.name} value={provider.name}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Utility Type</Label>
                      <Select
                        value={billData.type}
                        onValueChange={(value) => setBillData({ ...billData, type: value as UtilityType })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {utilityTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7"
                          placeholder="0.00"
                          value={billData.amount}
                          onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Bill Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={billData.date}
                        onChange={(e) => setBillData({ ...billData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPreview(null)
                      setUploadMethod(null)
                      setBillData({
                        provider: "",
                        type: "" as UtilityType,
                        amount: "",
                        date: "",
                        image: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading} className="bg-green-600 hover:bg-green-700">
                    {isUploading ? "Saving..." : "Save Bill"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  )
}
