"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Copy, Check, Tag, Edit2, Save, X, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { aiStoryService, type ProductDetails } from '@/lib/ai-services'
import { PRODUCT_CATEGORIES } from '@/types/product'

interface AIProductHelperProps {
  onDescriptionGenerated: (description: string) => void
  onTagsGenerated: (tags: string[]) => void
  artisanName?: string
  initialProduct?: Partial<ProductDetails>
}

export function AIProductHelper({ 
  onDescriptionGenerated, 
  onTagsGenerated, 
  artisanName = "Artisan",
  initialProduct 
}: AIProductHelperProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  
  const [product, setProduct] = useState<ProductDetails>({
    title: initialProduct?.title || '',
    category: initialProduct?.category || '',
    materials: initialProduct?.materials || [],
    techniques: initialProduct?.techniques || [],
    timeToMake: initialProduct?.timeToMake || '',
    inspiration: initialProduct?.inspiration || ''
  })

  const [newMaterial, setNewMaterial] = useState('')
  const [newTechnique, setNewTechnique] = useState('')

  const addMaterial = () => {
    if (newMaterial.trim() && !product.materials.includes(newMaterial.trim())) {
      setProduct(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }))
      setNewMaterial('')
    }
  }

  const addTechnique = () => {
    if (newTechnique.trim() && !product.techniques.includes(newTechnique.trim())) {
      setProduct(prev => ({
        ...prev,
        techniques: [...prev.techniques, newTechnique.trim()]
      }))
      setNewTechnique('')
    }
  }

  const removeMaterial = (material: string) => {
    setProduct(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== material)
    }))
  }

  const removeTechnique = (technique: string) => {
    setProduct(prev => ({
      ...prev,
      techniques: prev.techniques.filter(t => t !== technique)
    }))
  }

  const generateDescription = async () => {
    if (!product.title || !product.category || product.materials.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in product title, category, and at least one material.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const description = await aiStoryService.generateProductDescription(product, artisanName)
      setGeneratedDescription(description)
      setEditedDescription(description)
      onDescriptionGenerated(description)
      
      toast({
        title: "Description Generated!",
        description: "Your product description has been created using AI.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate description. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditDescription = () => {
    setIsEditingDescription(true)
  }

  const saveDescriptionEdit = () => {
    setGeneratedDescription(editedDescription)
    setIsEditingDescription(false)
    onDescriptionGenerated(editedDescription)
    
    toast({
      title: "Description Saved!",
      description: "Your edited description has been saved.",
    })
  }

  const cancelDescriptionEdit = () => {
    setEditedDescription(generatedDescription)
    setIsEditingDescription(false)
  }

  const regenerateDescription = async () => {
    await generateDescription()
  }

  const generateTags = async () => {
    if (!product.title || !product.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in product title and category to generate tags.",
        variant: "destructive"
      })
      return
    }

    setTagsLoading(true)
    try {
      const tags = await aiStoryService.suggestTags(product.title, product.category, product.materials)
      setGeneratedTags(tags)
      onTagsGenerated(tags)
      
      toast({
        title: "Tags Generated!",
        description: `Generated ${tags.length} relevant tags for your product.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate tags. Please try again.",
        variant: "destructive"
      })
    } finally {
      setTagsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const textToCopy = isEditingDescription ? editedDescription : generatedDescription
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Description copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Product Assistant
          </CardTitle>
          <CardDescription>
            Let AI help you create compelling product descriptions and tags that highlight your craftsmanship and connect with customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-title">Product Title *</Label>
              <Input
                id="product-title"
                value={product.title}
                onChange={(e) => setProduct(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-category">Category *</Label>
              <Select
                value={product.category}
                onValueChange={(value) => setProduct(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Materials Used *</Label>
              <div className="flex gap-2">
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Add a material"
                  onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                />
                <Button type="button" onClick={addMaterial} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {product.materials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.materials.map((material) => (
                    <Badge key={material} variant="secondary" className="cursor-pointer" onClick={() => removeMaterial(material)}>
                      {material} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Techniques Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  placeholder="Add a technique"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
                />
                <Button type="button" onClick={addTechnique} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {product.techniques.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.techniques.map((technique) => (
                    <Badge key={technique} variant="outline" className="cursor-pointer" onClick={() => removeTechnique(technique)}>
                      {technique} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-to-make">Time to Create (Optional)</Label>
              <Input
                id="time-to-make"
                value={product.timeToMake}
                onChange={(e) => setProduct(prev => ({ ...prev, timeToMake: e.target.value }))}
                placeholder="e.g., 2 weeks, 3 days"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspiration">Inspiration Behind This Piece (Optional)</Label>
            <Textarea
              id="inspiration"
              value={product.inspiration}
              onChange={(e) => setProduct(prev => ({ ...prev, inspiration: e.target.value }))}
              placeholder="What inspired this creation? Story behind the design..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={generateDescription} 
              disabled={loading || !product.title || !product.category || product.materials.length === 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Description
                </>
              )}
            </Button>

            <Button 
              onClick={generateTags} 
              disabled={tagsLoading || !product.title || !product.category}
              variant="outline"
              className="flex-1"
            >
              {tagsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  Generate Tags
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Description
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                {!isEditingDescription ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEditDescription}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={regenerateDescription} disabled={loading}>
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="default" size="sm" onClick={saveDescriptionEdit}>
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelDescriptionEdit}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingDescription ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[120px] text-sm leading-relaxed"
                placeholder="Edit your product description here..."
              />
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-line">{generatedDescription}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Badge variant="secondary">
                AI Generated
              </Badge>
              <span>Powered by OpenRouter + Gemini</span>
              {isEditingDescription && (
                <Badge variant="outline">
                  Editing Mode
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Tags</CardTitle>
            <CardDescription>AI-suggested tags to improve discoverability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generatedTags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}