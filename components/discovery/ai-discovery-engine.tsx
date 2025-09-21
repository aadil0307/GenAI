"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Star, 
  Heart,
  Filter,
  Palette,
  User
} from 'lucide-react'
import { CRAFT_CATEGORIES } from '@/types/artisan'

interface ArtisanRecommendation {
  id: string
  name: string
  craftType: string
  location: string
  story: string
  rating: number
  profileImage?: string
  specialties: string[]
  featured?: boolean
}

interface AIDiscoveryEngineProps {
  onArtisanSelect: (artisan: ArtisanRecommendation) => void
}

export function AIDiscoveryEngine({ onArtisanSelect }: AIDiscoveryEngineProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<ArtisanRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data - in real app, this would come from AI-powered recommendations
  const mockRecommendations: ArtisanRecommendation[] = [
    {
      id: '1',
      name: 'Maya Patel',
      craftType: 'Pottery & Ceramics',
      location: 'Rajasthan, India',
      story: 'Third-generation potter preserving ancient techniques while creating contemporary pieces that tell stories of heritage and innovation.',
      rating: 4.9,
      specialties: ['Traditional pottery', 'Glazing techniques', 'Contemporary design'],
      featured: true
    },
    {
      id: '2',
      name: 'Roberto Silva',
      craftType: 'Woodworking & Carving',
      location: 'Oaxaca, Mexico',
      story: 'Combining Zapotec woodworking traditions with modern sustainability practices to create furniture that honors both craftsmanship and environment.',
      rating: 4.8,
      specialties: ['Hand carving', 'Sustainable materials', 'Traditional joinery']
    },
    {
      id: '3',
      name: 'Aisha Kamau',
      craftType: 'Textiles & Weaving',
      location: 'Nairobi, Kenya',
      story: 'Weaving stories of African heritage into contemporary textiles, empowering local women through traditional craft skills and modern design.',
      rating: 4.9,
      specialties: ['Hand weaving', 'Natural dyes', 'Cultural patterns'],
      featured: true
    },
    {
      id: '4',
      name: 'Elena Rossi',
      craftType: 'Jewelry & Metalwork',
      location: 'Florence, Italy',
      story: 'Artisan jeweler carrying forward Renaissance metalworking traditions, creating pieces that celebrate both historical techniques and contemporary aesthetics.',
      rating: 4.7,
      specialties: ['Silversmithing', 'Stone setting', 'Renaissance techniques']
    }
  ]

  const searchArtisans = async () => {
    setLoading(true)
    // Simulate AI-powered search
    setTimeout(() => {
      let filtered = mockRecommendations

      if (searchQuery.trim()) {
        filtered = filtered.filter(artisan => 
          artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artisan.craftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artisan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artisan.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artisan.specialties.some(specialty => 
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      }

      if (selectedCategories.length > 0) {
        filtered = filtered.filter(artisan =>
          selectedCategories.some(category =>
            artisan.craftType.includes(category)
          )
        )
      }

      setRecommendations(filtered)
      setLoading(false)
    }, 1000)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  React.useEffect(() => {
    // Load initial recommendations
    setRecommendations(mockRecommendations)
  }, [])

  React.useEffect(() => {
    if (searchQuery || selectedCategories.length > 0) {
      searchArtisans()
    } else {
      setRecommendations(mockRecommendations)
    }
  }, [searchQuery, selectedCategories])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Artisan Discovery
          </CardTitle>
          <CardDescription>
            Discover authentic artisans based on their stories, craftsmanship, and cultural heritage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by craft, story, location, or artisan name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Craft Categories:</p>
            <div className="flex flex-wrap gap-2">
              {CRAFT_CATEGORIES.slice(0, 6).map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {loading ? 'Searching...' : `Recommended Artisans (${recommendations.length})`}
          </h3>
          {recommendations.length > 0 && (
            <p className="text-sm text-muted-foreground">
              ✨ Ranked by story relevance and craftsmanship
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((artisan) => (
              <Card key={artisan.id} className={`transition-all hover:shadow-md ${artisan.featured ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={artisan.profileImage} alt={artisan.name} />
                      <AvatarFallback>
                        {getInitials(artisan.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{artisan.name}</h4>
                        {artisan.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-primary font-medium">{artisan.craftType}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {artisan.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {artisan.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {artisan.story}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {artisan.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onArtisanSelect(artisan)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && recommendations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No artisans found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to discover more artisans
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}