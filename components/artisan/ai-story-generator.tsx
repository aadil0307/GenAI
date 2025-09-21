"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, RefreshCw, Copy, Check, Edit2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { aiStoryService, type ArtisanProfile } from '@/lib/ai-services'
import { CRAFT_CATEGORIES } from '@/types/artisan'

interface AIStoryGeneratorProps {
  onStoryGenerated: (story: string) => void
  initialProfile?: Partial<ArtisanProfile>
  initialStory?: string
  variant?: 'default' | 'compact' | 'inline'
}

export function AIStoryGenerator({ 
  onStoryGenerated, 
  initialProfile,
  initialStory = '',
  variant = 'default'
}: AIStoryGeneratorProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generatedStory, setGeneratedStory] = useState(initialStory)
  const [editedStory, setEditedStory] = useState(initialStory)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [profile, setProfile] = useState<Partial<ArtisanProfile>>({
    name: initialProfile?.name || '',
    craftType: initialProfile?.craftType || '',
    experience: initialProfile?.experience || '',
    location: initialProfile?.location || '',
    heritage: initialProfile?.heritage || '',
    inspiration: initialProfile?.inspiration || '',
    techniques: initialProfile?.techniques || []
  })

  const [newTechnique, setNewTechnique] = useState('')

  const addTechnique = () => {
    if (newTechnique.trim() && !profile.techniques?.includes(newTechnique.trim())) {
      setProfile(prev => ({
        ...prev,
        techniques: [...(prev.techniques || []), newTechnique.trim()]
      }))
      setNewTechnique('')
    }
  }

  const removeTechnique = (technique: string) => {
    setProfile(prev => ({
      ...prev,
      techniques: prev.techniques?.filter(t => t !== technique) || []
    }))
  }

  const generateStory = async () => {
    if (!profile.name || !profile.craftType || !profile.experience) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, craft type, and experience to generate a story.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const story = await aiStoryService.generateArtisanStory(profile as ArtisanProfile)
      setGeneratedStory(story)
      setEditedStory(story)
      onStoryGenerated(story)
      
      toast({
        title: "Story Generated!",
        description: "Your artisan story has been created using AI.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate story. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const saveEdit = () => {
    setGeneratedStory(editedStory)
    setIsEditing(false)
    onStoryGenerated(editedStory)
    
    toast({
      title: "Story Saved!",
      description: "Your edited story has been saved.",
    })
  }

  const cancelEdit = () => {
    setEditedStory(generatedStory)
    setIsEditing(false)
  }

  const regenerateStory = async () => {
    await generateStory()
  }

  const copyToClipboard = async () => {
    try {
      const textToCopy = isEditing ? editedStory : generatedStory
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Story copied to clipboard.",
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
            <Wand2 className="h-5 w-5" />
            AI Story Generator
          </CardTitle>
          <CardDescription>
            Let AI help you craft a compelling story about your artistic journey. Fill in the details below and we'll create a personalized story that connects with your audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artisan-name">Your Name *</Label>
              <Input
                id="artisan-name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="craft-type">Craft Type *</Label>
              <Select
                value={profile.craftType}
                onValueChange={(value) => setProfile(prev => ({ ...prev, craftType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your craft" />
                </SelectTrigger>
                <SelectContent>
                  {CRAFT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Input
                id="experience"
                value={profile.experience}
                onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 10 years, Since childhood"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Your city or region"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heritage">Cultural Heritage (Optional)</Label>
            <Textarea
              id="heritage"
              value={profile.heritage}
              onChange={(e) => setProfile(prev => ({ ...prev, heritage: e.target.value }))}
              placeholder="Describe any cultural background or family traditions that influence your craft"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspiration">Sources of Inspiration (Optional)</Label>
            <Textarea
              id="inspiration"
              value={profile.inspiration}
              onChange={(e) => setProfile(prev => ({ ...prev, inspiration: e.target.value }))}
              placeholder="What inspires your work? Nature, culture, personal experiences..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Techniques & Skills (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newTechnique}
                onChange={(e) => setNewTechnique(e.target.value)}
                placeholder="Add a technique or skill"
                onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
              />
              <Button type="button" onClick={addTechnique} variant="outline">
                Add
              </Button>
            </div>
            {profile.techniques && profile.techniques.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.techniques.map((technique) => (
                  <Badge key={technique} variant="secondary" className="cursor-pointer" onClick={() => removeTechnique(technique)}>
                    {technique} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={generateStory} 
            disabled={loading || !profile.name || !profile.craftType || !profile.experience}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate My Story
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedStory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Generated Story
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                {!isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={regenerateStory} disabled={loading}>
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="default" size="sm" onClick={saveEdit}>
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedStory}
                onChange={(e) => setEditedStory(e.target.value)}
                className="min-h-[200px] text-sm leading-relaxed"
                placeholder="Edit your story here..."
              />
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-line">{generatedStory}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Badge variant="secondary">
                AI Generated
              </Badge>
              <span>Powered by OpenRouter + Gemini</span>
              {isEditing && (
                <Badge variant="outline">
                  Editing Mode
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}