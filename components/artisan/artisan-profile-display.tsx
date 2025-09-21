"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Clock, 
  Award, 
  Heart, 
  Share2, 
  Star, 
  Calendar,
  Camera,
  Instagram,
  Facebook,
  Globe,
  TrendingUp,
  Users,
  ShoppingBag,
  Eye
} from 'lucide-react'
import type { ArtisanProfile } from '@/types/artisan'

interface ArtisanProfileDisplayProps {
  artisan: ArtisanProfile
  isOwner?: boolean
  onEdit?: () => void
}

export function ArtisanProfileDisplay({ artisan, isOwner = false, onEdit }: ArtisanProfileDisplayProps) {
  const [activeTab, setActiveTab] = useState('story')

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const formatNumber = (num?: number) => {
    if (!num) return '0'
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={artisan.profileImage} alt={artisan.displayName || artisan.username} />
                <AvatarFallback className="text-2xl">
                  {getInitials(artisan.displayName || artisan.username)}
                </AvatarFallback>
              </Avatar>
              
              {isOwner && (
                <Button variant="outline" size="sm" className="mb-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Update Photo
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{artisan.displayName || artisan.username}</h1>
                {isOwner && (
                  <Button onClick={onEdit} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <p className="text-xl text-muted-foreground mb-4">{artisan.craftType} Artisan</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {artisan.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {artisan.experience}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  {artisan.isVerified ? 'Verified' : 'Unverified'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Since {artisan.establishedYear || new Date(artisan.createdAt).getFullYear()}
                </div>
              </div>

              {/* Tagline or AI-generated headline */}
              {artisan.tagline && (
                <p className="text-lg italic text-primary mb-4">"{artisan.tagline}"</p>
              )}

              {/* Specialties */}
              {artisan.specialties && artisan.specialties.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {artisan.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {artisan.socialLinks && (
                <div className="flex gap-2">
                  {artisan.socialLinks.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={artisan.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {artisan.socialLinks.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={artisan.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {artisan.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={artisan.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{formatNumber(artisan.profileViews)}</p>
            <p className="text-sm text-muted-foreground">Profile Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{formatNumber(artisan.productsSold)}</p>
            <p className="text-sm text-muted-foreground">Items Sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{artisan.averageRating?.toFixed(1) || '0.0'}</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{formatNumber(artisan.customerReviews)}</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="story">My Story</TabsTrigger>
          <TabsTrigger value="craft">Craft Process</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reach">Digital Reach</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Artistic Journey</CardTitle>
              <CardDescription>The story behind my craft and passion</CardDescription>
            </CardHeader>
            <CardContent>
              {artisan.aiGeneratedStory ? (
                <div className="space-y-4">
                  <p className="leading-relaxed whitespace-pre-line">{artisan.aiGeneratedStory}</p>
                  <Badge variant="outline" className="text-xs">
                    ✨ AI-Enhanced Story
                  </Badge>
                </div>
              ) : artisan.artisticJourney ? (
                <p className="leading-relaxed whitespace-pre-line">{artisan.artisticJourney}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  No story has been shared yet. {isOwner && "Use our AI story generator to create a compelling narrative about your craft!"}
                </p>
              )}
            </CardContent>
          </Card>

          {artisan.heritage && (
            <Card>
              <CardHeader>
                <CardTitle>Cultural Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{artisan.heritage}</p>
              </CardContent>
            </Card>
          )}

          {artisan.inspiration && (
            <Card>
              <CardHeader>
                <CardTitle>Sources of Inspiration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{artisan.inspiration}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="craft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Craft Techniques & Skills</CardTitle>
              <CardDescription>The methods and expertise behind the creations</CardDescription>
            </CardHeader>
            <CardContent>
              {artisan.techniques && artisan.techniques.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artisan.techniques.map((technique) => (
                    <div key={technique} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                      <span>{technique}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No techniques listed yet. {isOwner && "Add your skills and techniques to showcase your expertise!"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Workshop Images */}
          {artisan.workshopImages && artisan.workshopImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Behind the Scenes</CardTitle>
                <CardDescription>A glimpse into the creative process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artisan.workshopImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={image} 
                        alt={`Workshop ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Gallery</CardTitle>
              <CardDescription>Showcase of recent and notable works</CardDescription>
            </CardHeader>
            <CardContent>
              {artisan.portfolioImages && artisan.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artisan.portfolioImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={image} 
                        alt={`Portfolio piece ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-center py-8">
                  No portfolio images yet. {isOwner && "Upload images of your best work to attract customers!"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reach" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Digital Reach Analytics
              </CardTitle>
              <CardDescription>Track your online presence and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completeness</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Story Engagement</span>
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Product Discovery</span>
                      <span className="text-sm text-muted-foreground">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Recent Growth</h4>
                    <p className="text-sm text-muted-foreground">+24% profile views this month</p>
                    <p className="text-sm text-muted-foreground">+12% story shares this week</p>
                    <p className="text-sm text-muted-foreground">+8% new followers</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <p className="text-sm text-muted-foreground">• Add more portfolio images</p>
                    <p className="text-sm text-muted-foreground">• Share your craft process</p>
                    <p className="text-sm text-muted-foreground">• Update your story</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}