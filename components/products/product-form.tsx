"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createProduct, updateProduct } from "@/lib/products"
import { PRODUCT_CATEGORIES, type CreateProductData, type Product } from "@/types/product"
import { useToast } from "@/hooks/use-toast"
import { Upload, Save, X, Wand2, Sparkles, RefreshCw } from "lucide-react"
import { generateProductDescription } from "@/lib/ai-services"
import { useDashboard } from "@/contexts/dashboard-context"

interface ProductFormProps {
  product?: Product
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const { addActivity, updateStats, trackProductOptimized } = useDashboard()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<CreateProductData>({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
    condition: product?.condition || "good",
    location: product?.location || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile) {
      console.error("No user profile found")
      toast({
        title: "Authentication Error",
        description: "Please log in to create a product.",
        variant: "destructive",
      })
      return
    }

    console.log("Form submission started with:", { formData, userProfile })

    // Validate that an image is uploaded
    if (!formData.imageUrl) {
      toast({
        title: "Image required",
        description: "Please upload an image for your product.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (isEditing && product) {
        console.log("Updating product:", product.id)
        await updateProduct(product.id, formData)
        toast({
          title: "Product updated",
          description: "Your product listing has been successfully updated.",
        })
      } else {
        console.log("Creating new product...")
        await createProduct(formData, userProfile.uid, userProfile.username)
        toast({
          title: "Product listed",
          description: "Your product has been successfully listed for sale.",
        })
      }
      router.push("/my-listings")
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      toast({
        title: "Error",
        description: `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Check if the base64 string is too large for Firestore (1MB limit)
        if (result.length > 900000) { // Leave some buffer below 1MB
          reject(new Error('Image too large after conversion'))
        } else {
          resolve(result)
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        
        // Check size again
        if (compressedDataUrl.length > 900000) {
          // Try with lower quality
          const lowerQualityDataUrl = canvas.toDataURL('image/jpeg', 0.5)
          if (lowerQualityDataUrl.length > 900000) {
            reject(new Error('Image still too large even after compression'))
          } else {
            resolve(lowerQualityDataUrl)
          }
        } else {
          resolve(compressedDataUrl)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (10MB limit before compression)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setImageUploading(true)
      try {
        const base64String = await resizeImage(file)
        setSelectedImage(file)
        setImagePreview(base64String)
        setFormData(prev => ({ ...prev, imageUrl: base64String }))
        toast({
          title: "Success",
          description: "Image uploaded and compressed successfully",
        })
      } catch (error) {
        console.error('Error processing image:', error)
        toast({
          title: "Error processing image",
          description: error instanceof Error ? error.message : "Failed to process the selected image.",
          variant: "destructive",
        })
      } finally {
        setImageUploading(false)
      }
    }
  }

  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAIDescription = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please add a product title and category before generating AI description.",
        variant: "destructive",
      })
      return
    }

    setAiGenerating(true)
    try {
      const description = await generateProductDescription({
        title: formData.title,
        category: formData.category,
        condition: formData.condition,
        price: formData.price,
        location: formData.location
      })
      
      setFormData(prev => ({ ...prev, description }))
      
      // Track product optimization in live metrics
      trackProductOptimized()
      
      // Update dashboard stats and activity
      updateStats({ productsOptimized: Date.now() }) // This will trigger increment in context
      addActivity({
        type: 'product',
        title: `Generated AI description for "${formData.title}"`,
        badge: 'Product AI'
      })
      
      toast({
        title: "AI Description Generated",
        description: "Your product description has been created! You can edit it further if needed.",
      })
    } catch (error) {
      console.error('AI description generation failed:', error)
      toast({
        title: "Generation Failed",
        description: "Unable to generate AI description. Please try again or write manually.",
        variant: "destructive",
      })
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Product" : "List New Product"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your product information" : "Create a new listing for your sustainable find"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image */}
          <div className="space-y-2">
            <Label>Product Image *</Label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted relative">
                {imagePreview || formData.imageUrl ? (
                  <>
                    <img
                      src={imagePreview || formData.imageUrl || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No image</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleImageUploadClick}
                  disabled={imageUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imageUploading ? "Uploading..." : "Upload Image"}
                </Button>
                {selectedImage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a clear photo of your item. Required field. Max size: 2MB.
            </p>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter a descriptive title for your item"
              required
            />
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description *</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAIDescription}
                  disabled={aiGenerating || !formData.title || !formData.category}
                  className="text-xs"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 mr-1" />
                      Generate AI Description
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your item's condition, features, and why it's special... Or use AI to generate!"
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              💡 Tip: Fill in the title and category first, then click "Generate AI Description" for a professional description that highlights your craft's unique qualities.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || imageUploading || !formData.imageUrl} 
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : imageUploading ? "Processing Image..." : isEditing ? "Update Product" : "List Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
