'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Wand2, 
  Loader2, 
  Copy, 
  Save, 
  Edit2, 
  RefreshCw, 
  Eye,
  Settings,
  Palette,
  User,
  MapPin,
  Clock,
  Lightbulb,
  Hammer,
  Send,
  Check
} from 'lucide-react'
import { aiStoryService, ArtisanProfile, StoryOptions } from '@/lib/ai-services'
import { toast } from '@/hooks/use-toast'
import { useDashboard } from '@/contexts/dashboard-context'
import { CRAFT_CATEGORIES } from '@/types/artisan'
import { Navbar } from '@/components/layout/navbar'
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function DynamicAIStoryPage() {
  const { 
    addActivity, 
    updateStats, 
    trackStoryGenerated, 
    trackEngagement,
    trackProfileView,
    trackStoryShare 
  } = useDashboard()
  const { user, userProfile } = useAuth()
  const [profile, setProfile] = useState<ArtisanProfile>({
    name: '',
    craftType: '',
    experience: '',
    location: '',
    heritage: '',
    inspiration: '',
    techniques: []
  })

  const [story, setStory] = useState('')
  const [editedStory, setEditedStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(false)
  const [storyLength, setStoryLength] = useState([250]) // words
  const [storyTone, setStoryTone] = useState<'warm' | 'professional' | 'casual' | 'inspiring'>('warm')
  const [includeHeritage, setIncludeHeritage] = useState(true)
  const [includeInspiration, setIncludeInspiration] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  // Debounced API call
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const generateStoryWithParams = useCallback(async (profileData: ArtisanProfile, options: {
    length: number,
    tone: 'warm' | 'professional' | 'casual' | 'inspiring',
    includeHeritage: boolean,
    includeInspiration: boolean
  }) => {
    if (!profileData.name || !profileData.craftType || !profileData.experience) {
      return
    }

    setLoading(true)
    
    try {
      // Use the new custom story generation method
      const storyOptions: StoryOptions = {
        length: options.length,
        tone: options.tone,
        includeHeritage: options.includeHeritage,
        includeInspiration: options.includeInspiration
      }

      const result = await aiStoryService.generateCustomArtisanStory(profileData, storyOptions)
      
      setStory(result)
      setEditedStory(result)
      
      // Track story generation in live metrics
      trackStoryGenerated()
      
      // Update dashboard stats and activity
      addActivity({
        type: 'story',
        title: `Generated ${storyOptions.tone} story for ${profile.name || 'artisan'}`,
        badge: 'Story Generator'
      })
      
      if (!previewMode) {
        toast({
          title: "Story Generated!",
          description: `${options.tone.charAt(0).toUpperCase() + options.tone.slice(1)} story created with your parameters.`,
        })
      }
    } catch (error) {
      if (!previewMode) {
        toast({
          title: "Generation Failed",
          description: error instanceof Error ? error.message : 'Unknown error occurred',
          variant: "destructive"
        })
      }
    } finally {
      setLoading(false)
    }
  }, [previewMode])

  // Auto-generate when parameters change (debounced)
  useEffect(() => {
    if (autoGenerate && profile.name && profile.craftType && profile.experience) {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      
      const timer = setTimeout(() => {
        generateStoryWithParams(profile, {
          length: storyLength[0],
          tone: storyTone,
          includeHeritage,
          includeInspiration
        })
      }, 1500) // 1.5 second delay
      
      setDebounceTimer(timer)
    }
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [profile, storyLength, storyTone, includeHeritage, includeInspiration, autoGenerate, generateStoryWithParams, debounceTimer])

  // Track page view and engagement when component mounts
  useEffect(() => {
    // Track profile view (story generator page view)
    trackProfileView()
    
    // Track engagement after user stays for 10 seconds
    const engagementTimer = setTimeout(() => {
      trackEngagement()
    }, 10000)

    return () => {
      clearTimeout(engagementTimer)
    }
  }, [trackProfileView, trackEngagement])

  const handleProfileChange = (field: keyof ArtisanProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const addTechnique = (technique: string) => {
    if (technique.trim() && !(profile.techniques || []).includes(technique.trim())) {
      setProfile(prev => ({
        ...prev,
        techniques: [...(prev.techniques || []), technique.trim()]
      }))
    }
  }

  const removeTechnique = (technique: string) => {
    setProfile(prev => ({
      ...prev,
      techniques: (prev.techniques || []).filter(t => t !== technique)
    }))
  }

  const manualGenerate = () => {
    generateStoryWithParams(profile, {
      length: storyLength[0],
      tone: storyTone,
      includeHeritage,
      includeInspiration
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const saveEdit = () => {
    setStory(editedStory)
    setIsEditing(false)
    toast({
      title: "Story Saved!",
      description: "Your edited story has been saved.",
    })
  }

  const copyToClipboard = async () => {
    const textToCopy = isEditing ? editedStory : story
    await navigator.clipboard.writeText(textToCopy)
    
    // Track engagement when user copies story
    trackEngagement()
    
    toast({
      title: "Copied!",
      description: "Story copied to clipboard.",
    })
  }

  const postStory = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post your story.",
        variant: "destructive",
      })
      return
    }

    if (!story.trim()) {
      toast({
        title: "No Story to Post",
        description: "Please generate a story first.",
        variant: "destructive",
      })
      return
    }

    setPosting(true)
    try {
      const storyData = {
        content: isEditing ? editedStory : story,
        artisanProfile: {
          name: profile.name || userProfile?.username || 'Anonymous Artisan',
          craftType: profile.craftType,
          location: profile.location,
          heritage: profile.heritage,
          inspiration: profile.inspiration
        },
        storyOptions: {
          tone: storyTone,
          length: storyLength[0],
          includeHeritage,
          includeInspiration
        },
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        isPublic: true,
        likes: 0,
        shares: 0,
        views: 0
      }

      await addDoc(collection(db, 'artisan-stories'), storyData)
      
      // Track story share in live metrics
      trackStoryShare()
      
      // Update dashboard stats
      addActivity({
        type: 'story',
        title: `Posted artisan story: "${profile.name || 'Artisan'}'s Journey"`,
        badge: 'Story Posted'
      })

      toast({
        title: "Story Posted!",
        description: "Your artisan story has been shared successfully.",
      })
    } catch (error) {
      console.error('Error posting story:', error)
      toast({
        title: "Posting Failed",
        description: "Unable to post your story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dynamic AI Story Generator
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Create compelling artisan narratives with real-time AI customization
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Real-time Parameters
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Auto-generation
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Edit2 className="w-3 h-3 mr-1" />
                Live Editing
              </Badge>
            </div>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Artisan Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="craftType">Craft Type *</Label>
                <Select value={profile.craftType} onValueChange={(value) => handleProfileChange('craftType', value)}>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Experience *
                  </Label>
                  <Input
                    id="experience"
                    value={profile.experience}
                    onChange={(e) => handleProfileChange('experience', e.target.value)}
                    placeholder="e.g., 10 years"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    placeholder="Your city"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="heritage" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Cultural Heritage
                </Label>
                <Textarea
                  id="heritage"
                  value={profile.heritage}
                  onChange={(e) => handleProfileChange('heritage', e.target.value)}
                  placeholder="Family traditions, cultural background..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="inspiration" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Inspiration
                </Label>
                <Textarea
                  id="inspiration"
                  value={profile.inspiration}
                  onChange={(e) => handleProfileChange('inspiration', e.target.value)}
                  placeholder="What inspires your work..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Hammer className="w-4 h-4" />
                  Techniques
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(profile.techniques || []).map((technique, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTechnique(technique)}>
                      {technique} ✕
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add technique (press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTechnique((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Story Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Story Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-generate">Auto Generate</Label>
                <Switch
                  id="auto-generate"
                  checked={autoGenerate}
                  onCheckedChange={setAutoGenerate}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="preview-mode">Preview Mode</Label>
                <Switch
                  id="preview-mode"
                  checked={previewMode}
                  onCheckedChange={setPreviewMode}
                />
              </div>

              <div>
                <Label>Story Length: {storyLength[0]} words</Label>
                <Slider
                  value={storyLength}
                  onValueChange={setStoryLength}
                  max={500}
                  min={100}
                  step={50}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Story Tone</Label>
                <Select value={storyTone} onValueChange={(value) => setStoryTone(value as 'warm' | 'professional' | 'casual' | 'inspiring')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">🤗 Warm & Personal</SelectItem>
                    <SelectItem value="professional">💼 Professional</SelectItem>
                    <SelectItem value="casual">😊 Casual & Friendly</SelectItem>
                    <SelectItem value="inspiring">✨ Inspiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Include Heritage</Label>
                  <Switch
                    checked={includeHeritage}
                    onCheckedChange={setIncludeHeritage}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Include Inspiration</Label>
                  <Switch
                    checked={includeInspiration}
                    onCheckedChange={setIncludeInspiration}
                  />
                </div>
              </div>

              <Button
                onClick={manualGenerate}
                disabled={loading || !profile.name || !profile.craftType}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Story Display */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Generated Story
                  {autoGenerate && <Badge variant="secondary">Auto</Badge>}
                  {loading && <Badge variant="outline">Generating...</Badge>}
                </div>
                
                {story && (
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={postStory} 
                      variant="default" 
                      size="sm"
                      disabled={posting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {posting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                    {!isEditing ? (
                      <>
                        <Button onClick={handleEdit} variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button onClick={manualGenerate} variant="outline" size="sm" disabled={loading}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button onClick={saveEdit} variant="default" size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!story && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in your profile details to generate your artisan story</p>
                  <p className="text-sm mt-2">Turn on Auto Generate for real-time updates</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4" />
                  <p className="text-muted-foreground">Crafting your story with AI...</p>
                </div>
              )}

              {story && (
                <div className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={editedStory}
                      onChange={(e) => setEditedStory(e.target.value)}
                      className="min-h-[300px] text-sm leading-relaxed"
                      placeholder="Edit your story here..."
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {story}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {storyTone.charAt(0).toUpperCase() + storyTone.slice(1)} Tone
                    </Badge>
                    <Badge variant="secondary">
                      ~{storyLength[0]} words
                    </Badge>
                    <Badge variant="secondary">
                      OpenRouter + Gemini
                    </Badge>
                    {autoGenerate && (
                      <Badge variant="outline">
                        Auto-Generated
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </>
  )
}