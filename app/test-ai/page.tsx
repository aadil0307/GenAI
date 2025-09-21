'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Copy, RefreshCw, Save, Edit2 } from 'lucide-react'
import { aiStoryService } from '@/lib/ai-services'
import { toast } from '@/hooks/use-toast'

export default function AITestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [editedResult, setEditedResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  // Profile state for customization
  const [profile, setProfile] = useState({
    name: 'Maya Sharma',
    craftType: 'Pottery',
    experience: '15 years',
    location: 'Jaipur, India',
    heritage: 'Traditional Rajasthani pottery passed down through generations',
    inspiration: 'The vibrant colors of desert sunsets and ancient motifs',
    techniques: ['Hand throwing', 'Glazing', 'Terracotta painting']
  })

  const generateStory = async () => {
    setLoading(true)
    setError('')
    setResult('')
    setIsEditing(false)
    setIsSaved(false)

    try {
      const story = await aiStoryService.generateArtisanStory(profile)
      setResult(story)
      setEditedResult(story)
      toast({
        title: "Story Generated!",
        description: "AI story generated successfully using OpenRouter.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      toast({
        title: "Generation Failed",
        description: "Could not generate story. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const regenerateStory = async () => {
    await generateStory()
  }

  const handleEdit = () => {
    setIsEditing(true)
    setIsSaved(false)
  }

  const saveEdit = () => {
    setResult(editedResult)
    setIsEditing(false)
    setIsSaved(true)
    toast({
      title: "Story Saved!",
      description: "Your edited story has been saved.",
    })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(isEditing ? editedResult : result)
    toast({
      title: "Copied!",
      description: "Story copied to clipboard.",
    })
  }

  const addTechnique = () => {
    setProfile(prev => ({
      ...prev,
      techniques: [...prev.techniques, '']
    }))
  }

  const updateTechnique = (index: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      techniques: prev.techniques.map((tech, i) => i === index ? value : tech)
    }))
  }

  const removeTechnique = (index: number) => {
    setProfile(prev => ({
      ...prev,
      techniques: prev.techniques.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✏️ Artisan Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="craftType">Craft Type</Label>
                <Input
                  id="craftType"
                  value={profile.craftType}
                  onChange={(e) => setProfile(prev => ({ ...prev, craftType: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={profile.experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="heritage">Heritage</Label>
              <Textarea
                id="heritage"
                value={profile.heritage}
                onChange={(e) => setProfile(prev => ({ ...prev, heritage: e.target.value }))}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="inspiration">Inspiration</Label>
              <Textarea
                id="inspiration"
                value={profile.inspiration}
                onChange={(e) => setProfile(prev => ({ ...prev, inspiration: e.target.value }))}
                rows={2}
              />
            </div>
            
            <div>
              <Label>Techniques</Label>
              <div className="space-y-2">
                {profile.techniques.map((technique, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={technique}
                      onChange={(e) => updateTechnique(index, e.target.value)}
                      placeholder="Enter technique"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnique(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTechnique}
                >
                  + Add Technique
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Story Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 AI Story Generator
              <Badge variant="outline">OpenRouter + Gemini</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={generateStory} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Generating...' : 'Generate Story'}
              </Button>
              
              {result && (
                <Button
                  onClick={regenerateStory}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800">Error:</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-800">Generated Story:</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {!isEditing ? (
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={saveEdit}
                        variant="outline"
                        size="sm"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={editedResult}
                    onChange={(e) => setEditedResult(e.target.value)}
                    rows={8}
                    className="text-sm leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {result}
                    </p>
                    {isSaved && (
                      <Badge variant="secondary" className="mt-2">
                        ✓ Edited & Saved
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>🔑 <strong>API Status:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Primary: OpenRouter (Gemini Flash 1.5)</li>
                <li>Fallback: Direct Gemini API</li>
                <li>Features: Generate, Edit, Regenerate, Copy</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}