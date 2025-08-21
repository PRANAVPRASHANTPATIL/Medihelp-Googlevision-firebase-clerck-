"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrescriptionUploadProps {
  onUploadComplete?: (result: any) => void
}

export function PrescriptionUpload({ onUploadComplete }: PrescriptionUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const processImage = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/ocr/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process image")
      }

      const result = await response.json()

      toast({
        title: "Prescription processed successfully!",
        description: "Your medication schedule has been updated.",
      })

      onUploadComplete?.(result)
      clearSelection()
    } catch (error) {
      console.error("Error processing image:", error)
      toast({
        title: "Processing failed",
        description: "Failed to process the prescription image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="font-poppins">Upload Prescription</CardTitle>
        <CardDescription>Take a photo or upload an image of your prescription for automatic processing</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" className="h-16 flex-col gap-2" onClick={() => cameraInputRef.current?.click()}>
              <Camera className="w-6 h-6" />
              <span>Take Photo</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 flex-col gap-2 bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6" />
              <span>Upload File</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={previewUrl! || "/placeholder.svg"}
                alt="Prescription preview"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-transparent"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={processImage} disabled={isUploading} className="flex-1">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Prescription"
                )}
              </Button>
              <Button variant="outline" onClick={clearSelection}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
