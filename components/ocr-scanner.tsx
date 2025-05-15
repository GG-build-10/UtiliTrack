"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, Loader2, RotateCw, RefreshCw, X } from "lucide-react"
import { extractTextFromImage, extractDataFromOcrText } from "@/lib/ocr-service"

interface OcrScannerProps {
  onTextExtracted: (text: string, data: Record<string, string>) => void
  onImageCaptured: (imageFile: File) => void
  onClose: () => void
}

export function OcrScanner({ onTextExtracted, onImageCaptured, onClose }: OcrScannerProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Start camera capture
  const startCamera = async () => {
    setIsCapturing(true)
    setCameraError(null)

    try {
      // Check for camera permission
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })

      if (permissionStatus.state === "denied") {
        setCameraError("Camera access denied. Please enable camera permissions in your browser settings.")
        setIsCapturing(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Could not access camera. Please ensure you've granted camera permissions.")
      setIsCapturing(false)
    }
  }

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera()

    return () => {
      // Clean up on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Stop camera capture
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              // Create a File object from the blob
              const imageFile = new File([blob], "captured-bill.jpg", { type: "image/jpeg" })

              // Set captured image preview
              setCapturedImage(URL.createObjectURL(blob))

              // Stop camera
              stopCamera()

              // Call callback with the image file
              onImageCaptured(imageFile)

              // Process the image with OCR
              processImage(imageFile)
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Set captured image preview
      setCapturedImage(URL.createObjectURL(file))

      // Call callback with the image file
      onImageCaptured(file)

      // Process the image with OCR
      processImage(file)
    }
  }

  // Process image with OCR
  const processImage = async (imageFile: File) => {
    setIsProcessing(true)

    try {
      // Extract text using OCR
      const extractedText = await extractTextFromImage(imageFile)

      // Extract structured data from the text
      const extractedData = extractDataFromOcrText(extractedText)

      // Call callback with extracted text and data
      onTextExtracted(extractedText, extractedData)
    } catch (err) {
      console.error("OCR processing error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Retake photo
  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
    setCapturedImage(null)
    startCamera()
  }

  return (
    <Card className="overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="p-4">
        {isCapturing ? (
          <div className="relative">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-900 p-4">
                <p className="text-red-500 mb-4 text-center">{cameraError}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button onClick={startCamera} className="bg-sage-600 hover:bg-sage-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Camera
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  You may need to update your browser settings to allow camera access
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[300px] object-cover rounded-md"
                  onLoadedMetadata={() => {
                    // Ensure video is ready before allowing capture
                    if (videoRef.current) {
                      videoRef.current.play()
                    }
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    onClick={captureImage}
                    className="rounded-full h-14 w-14 bg-white border-2 border-sage-500 p-0"
                  >
                    <Camera className="h-6 w-6 text-sage-700" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : capturedImage ? (
          <div className="relative">
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured bill"
              className="w-full h-[300px] object-contain rounded-md bg-gray-100 dark:bg-gray-900"
            />

            {isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md">
                <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                <p className="text-white">Processing image...</p>
              </div>
            ) : (
              <div className="absolute bottom-4 right-4">
                <Button onClick={retakePhoto} variant="outline" className="bg-white/80 dark:bg-gray-800/80" size="sm">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-muted-foreground text-center mb-4">Capture or upload a bill image</p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={startCamera} className="w-full sm:w-auto">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>

                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            <div className="text-sm text-muted-foreground text-center">
              For best results, ensure good lighting and that the bill is clearly visible
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
