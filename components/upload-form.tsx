"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, Check, AlertCircle, Calendar, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { processBillImage } from "@/lib/bill-processing"
import { providersMapping, type UtilityType } from "@/lib/providers-mapping"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-provider"
import { saveBill } from "@/lib/bill-service"
import { useToast } from "@/hooks/use-toast"

interface UploadFormProps {
  initialData?: Record<string, string>
  imageFile?: File | null
}

export function UploadForm({ initialData = {}, imageFile = null }: UploadFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<"upload" | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Form data state
  const [billData, setBillData] = useState({
    provider: "",
    type: "" as UtilityType,
    amount: "",
    date: "",
    dueDate: "",
    periodStart: "",
    periodEnd: "",
    image: "",
    barcode: "",
    reference: "",
    account: "",
    rawText: "",
  })

  // Process initial data and image file when they change
  useEffect(() => {
    if (Object.keys(initialData).length > 0 || imageFile) {
      setIsProcessing(true)
      setProcessingStatus("Processing provided data...")

      // If we have an image file, set it as the preview
      if (imageFile) {
        setOriginalFile(imageFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(imageFile)
        setUploadMethod("upload")
      }

      // Process any initial data
      if (Object.keys(initialData).length > 0) {
        // Update form with extracted data
        setBillData((prevData) => ({
          ...prevData,
          provider: initialData.provider || prevData.provider,
          type: (initialData.type as UtilityType) || prevData.type,
          amount: initialData.amount || prevData.amount,
          date: initialData.date || prevData.date,
          dueDate: initialData.dueDate || prevData.dueDate,
          periodStart: initialData.periodStart || prevData.periodStart,
          periodEnd: initialData.periodEnd || prevData.periodEnd,
          barcode: initialData.barcode || prevData.barcode,
          reference: initialData.reference || prevData.reference,
          account: initialData.account || prevData.account,
          rawText: initialData.rawText || prevData.rawText,
        }))
      }

      // If we have both image and data, process the image to extract more data
      if (imageFile && Object.keys(initialData).length === 0) {
        processFile(imageFile)
      } else {
        setProcessingStatus("Data processed successfully!")
        setIsProcessing(false)
      }
    }
  }, [initialData, imageFile])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-sage-400", "bg-sage-50/50")
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-sage-400", "bg-sage-50/50")
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-sage-400", "bg-sage-50/50")
    }

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setProcessingStatus("Starting bill processing...")
    setProcessingError(null)
    setOriginalFile(file)

    try {
      // Create object URL for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setUploadMethod("upload")

      // Process the bill image to extract data using both OCR and barcode detection
      setProcessingStatus("Analyzing bill image...")
      const extractedData = await processBillImage(file)

      // Update form with extracted data
      setProcessingStatus("Extracting bill details...")
      setBillData({
        provider: extractedData.provider || "",
        type: extractedData.type || ("" as UtilityType),
        amount: extractedData.amount?.toString() || "",
        date: extractedData.date || "",
        dueDate: extractedData.dueDate || "",
        periodStart: extractedData.periodStart || "",
        periodEnd: extractedData.periodEnd || "",
        image: extractedData.image || "",
        barcode: extractedData.barcode || "",
        reference: extractedData.reference || "",
        account: extractedData.account || "",
        rawText: extractedData.rawText || "",
      })

      setProcessingStatus("Bill processed successfully!")
    } catch (error) {
      console.error("Error processing bill:", error)
      setProcessingError("Failed to process the bill. Please try again or enter details manually.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setProcessingError("You must be logged in to save bills")
      return
    }

    setIsUploading(true)
    setProcessingError(null)

    try {
      // Prepare data for submission
      const formData = {
        provider: billData.provider,
        bill_type: billData.type,
        amount: Number.parseFloat(billData.amount) || 0,
        bill_date: billData.date,
        due_date: billData.dueDate || undefined,
        period_start: billData.periodStart || undefined,
        period_end: billData.periodEnd || undefined,
      }

      console.log("Submitting bill data:", formData)

      // Save bill
      const billId = await saveBill(formData, user.id, originalFile || undefined)

      if (!billId) {
        throw new Error("Failed to save bill")
      }

      toast({
        title: "Bill saved",
        description: "Your bill has been successfully saved",
      })

      // Navigate to home page after a brief delay
      setTimeout(() => {
        setIsUploading(false)
        router.push("/dashboard")
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error("Error saving bill:", error)
      setProcessingError("Failed to save the bill. Please try again.")
      setIsUploading(false)

      toast({
        title: "Error",
        description: "Failed to save the bill. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get unique utility types for the dropdown
  const utilityTypes = Array.from(new Set(providersMapping.map((p) => p.type)))

  // If no preview and no initial data, show the drag and drop area
  if (!preview && Object.keys(initialData).length === 0) {
    return (
      <div
        ref={dropZoneRef}
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center transition-colors"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-sage-100 dark:bg-sage-800 p-4">
            <Upload className="h-8 w-8 text-sage-600 dark:text-sage-400" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag and drop your bill image here</p>
            <p className="text-sm text-muted-foreground">or</p>
          </div>
          <Button onClick={handleUploadClick} className="bg-sage-600 hover:bg-sage-700">
            Select File
          </Button>
          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, JPEG</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg border">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-sage-500 animate-spin mb-4" />
            <p className="text-lg">{processingStatus || "Processing your bill..."}</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        ) : (
          <>
            {processingError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{processingError}</AlertDescription>
              </Alert>
            )}

            {!processingError && processingStatus && (
              <Alert className="mb-6 bg-sage-50 dark:bg-sage-950 border-sage-200 dark:border-sage-800">
                <Check className="h-4 w-4 text-sage-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{processingStatus}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                <TabsTrigger value="details">Bill Details</TabsTrigger>
                <TabsTrigger value="dates">Dates</TabsTrigger>
                <TabsTrigger value="image">Bill Image</TabsTrigger>
                {billData.barcode && <TabsTrigger value="barcode">Barcode Data</TabsTrigger>}
              </TabsList>

              <TabsContent value="details">
                <div className="grid sm:grid-cols-2 gap-6">
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
                  </div>

                  <div className="space-y-4">
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

                    {billData.reference && (
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                          id="reference"
                          value={billData.reference}
                          onChange={(e) => setBillData({ ...billData, reference: e.target.value })}
                        />
                      </div>
                    )}

                    {billData.account && (
                      <div className="space-y-2">
                        <Label htmlFor="account">Account Number</Label>
                        <Input
                          id="account"
                          value={billData.account}
                          onChange={(e) => setBillData({ ...billData, account: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dates">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">
                        <Calendar className="h-4 w-4 inline-block mr-1" />
                        Payment Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={billData.dueDate}
                        onChange={(e) => setBillData({ ...billData, dueDate: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">When the bill needs to be paid</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="periodStart">Period Start</Label>
                      <Input
                        id="periodStart"
                        type="date"
                        value={billData.periodStart}
                        onChange={(e) => setBillData({ ...billData, periodStart: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="periodEnd">Period End</Label>
                      <Input
                        id="periodEnd"
                        type="date"
                        value={billData.periodEnd}
                        onChange={(e) => setBillData({ ...billData, periodEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="relative h-64 w-full overflow-hidden rounded-md mb-4">
                  {preview && (
                    <Image src={preview || "/placeholder.svg"} alt="Bill preview" fill className="object-contain" />
                  )}
                </div>
              </TabsContent>

              {billData.barcode && (
                <TabsContent value="barcode">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input id="barcode" value={billData.barcode} readOnly />
                    </div>

                    {billData.reference && (
                      <div className="space-y-2">
                        <Label htmlFor="barcode-reference">Reference Number</Label>
                        <Input id="barcode-reference" value={billData.reference} readOnly />
                      </div>
                    )}

                    {billData.account && (
                      <div className="space-y-2">
                        <Label htmlFor="barcode-account">Account Number</Label>
                        <Input id="barcode-account" value={billData.account} readOnly />
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPreview(null)
                  setUploadMethod(null)
                  setProcessingStatus(null)
                  setProcessingError(null)
                  setOriginalFile(null)
                  setBillData({
                    provider: "",
                    type: "" as UtilityType,
                    amount: "",
                    date: "",
                    dueDate: "",
                    periodStart: "",
                    periodEnd: "",
                    image: "",
                    barcode: "",
                    reference: "",
                    account: "",
                    rawText: "",
                  })
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading} className="bg-sage-600 hover:bg-sage-700 w-full sm:w-auto">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Bill"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
