'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Brain, 
  Star, 
  Heart,
  Share2,
  MapPin,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'

interface Artisan {
  id: string
  name: string
  craft: string
  location: string
  rating: number
  followers: number
  story: string
  image: string
  featured: boolean
  trending: boolean
  aiScore: number
}

interface Recommendation {
  id: string
  title: string
  type: 'artisan' | 'product' | 'story'
  description: string
  confidence: number
  reason: string
}

export default function AIDiscovery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [featuredArtisans, setFeaturedArtisans] = useState<Artisan[]>([])

  const filters = [
    'Traditional Crafts',
    'Modern Fusion',
    'Eco-Friendly',
    'Handwoven',
    'Pottery',
    'Jewelry',
    'Woodwork',
    'Metalwork'
  ]

  const aiInsights = [
    {
      title: "Rising Trends",
      items: ["Sustainable ceramics", "Heritage textiles", "Upcycled art"],
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: "Popular Regions",
      items: ["Rajasthan crafts", "Kerala artisans", "Bengal weavers"],
      icon: <MapPin className="w-4 h-4" />
    },
    {
      title: "Customer Interests",
      items: ["Home decor", "Wedding gifts", "Wall art"],
      icon: <Heart className="w-4 h-4" />
    }
  ]

  useEffect(() => {
    // Simulate AI recommendations
    setRecommendations([
      {
        id: '1',
        title: 'Traditional Pottery Masters',
        type: 'artisan',
        description: 'Discover artisans who share your heritage pottery style',
        confidence: 95,
        reason: 'Based on your craft profile and customer preferences'
      },
      {
        id: '2',
        title: 'Trending Ceramic Collections',
        type: 'product',
        description: 'Products similar to yours are gaining popularity',
        confidence: 88,
        reason: 'Market analysis shows 40% increase in ceramic sales'
      },
      {
        id: '3',
        title: 'Heritage Story Inspiration',
        type: 'story',
        description: 'Stories about traditional techniques are trending',
        confidence: 92,
        reason: 'Audiences engage 3x more with heritage content'
      }
    ])

    setFeaturedArtisans([
      {
        id: '1',
        name: 'Priya Sharma',
        craft: 'Traditional Pottery',
        location: 'Jaipur, Rajasthan',
        rating: 4.9,
        followers: 1200,
        story: 'Third-generation potter preserving ancient Rajasthani techniques',
        image: '/api/placeholder/150/150',
        featured: true,
        trending: false,
        aiScore: 96
      },
      {
        id: '2',
        name: 'Arjun Krishnan',
        craft: 'Handwoven Textiles',
        location: 'Kochi, Kerala',
        rating: 4.8,
        followers: 890,
        story: 'Reviving traditional Kerala handloom with contemporary designs',
        image: '/api/placeholder/150/150',
        featured: false,
        trending: true,
        aiScore: 94
      },
      {
        id: '3',
        name: 'Meera Patel',
        craft: 'Sustainable Jewelry',
        location: 'Mumbai, Maharashtra',
        rating: 4.7,
        followers: 1500,
        story: 'Creating eco-friendly jewelry from recycled materials',
        image: '/api/placeholder/150/150',
        featured: true,
        trending: true,
        aiScore: 91
      }
    ])
  }, [])

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                    AI Discovery
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Smart recommendations to help customers discover amazing crafts
                </p>
              </div>
            </div>
          </div>      {/* Coming Soon Notice */}
      <Card className="mb-8 border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Coming Soon: Enhanced Discovery</h3>
              <p className="text-amber-700">
                We're building advanced AI algorithms to provide personalized craft recommendations. 
                Preview the features below!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for crafts, artisans, or stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge variant="outline" className="text-green-600">
                        {rec.confidence}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <p className="text-xs text-blue-600">{rec.reason}</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Explore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Market trends and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2">
                      {insight.icon}
                      <h5 className="font-medium">{insight.title}</h5>
                    </div>
                    <div className="space-y-1">
                      {insight.items.map((item, i) => (
                        <Badge key={i} variant="secondary" className="mr-1 mb-1 text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Artisans */}
      <Card>
        <CardHeader>
          <CardTitle>Discover Similar Artisans</CardTitle>
          <CardDescription>Connect with artisans who share your craft heritage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtisans.map((artisan) => (
              <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {artisan.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{artisan.name}</h4>
                        <p className="text-sm text-muted-foreground">{artisan.craft}</p>
                      </div>
                    </div>
                    {artisan.featured && <Badge variant="default">Featured</Badge>}
                    {artisan.trending && <Badge variant="destructive">Trending</Badge>}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {artisan.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {artisan.rating}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{artisan.story}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {artisan.followers}
                      </span>
                      <span className="text-green-600 font-medium">
                        {artisan.aiScore}% AI Score
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Heart className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Features */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Coming Features</CardTitle>
          <CardDescription>Advanced AI capabilities in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visual Recognition
              </h4>
              <p className="text-sm text-muted-foreground">
                AI will analyze craft images to find similar styles and techniques
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Smart Recommendations
              </h4>
              <p className="text-sm text-muted-foreground">
                Personalized product suggestions based on customer behavior
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market Predictions
              </h4>
              <p className="text-sm text-muted-foreground">
                AI-powered insights into craft trends and demand forecasting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  )
}