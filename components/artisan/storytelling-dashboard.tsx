"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  Share2,
  Edit,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  BarChart3
} from 'lucide-react'
import { AIStoryGenerator } from './ai-story-generator'
import { AIProductHelper } from './ai-product-helper'

interface StorytellingDashboardProps {
  artisanId: string
  artisanName: string
}

export function StorytellingDashboard({ artisanId, artisanName }: StorytellingDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app, this would come from your database
  const storyMetrics = {
    totalViews: 1248,
    storyShares: 34,
    engagement: 85,
    profileCompleteness: 78,
    recentGrowth: {
      views: 15,
      shares: 8,
      followers: 5
    }
  }

  const storyComponents = [
    {
      id: 'origin',
      title: 'Origin Story',
      description: 'How you discovered your craft',
      status: 'completed',
      engagement: 92
    },
    {
      id: 'heritage',
      title: 'Cultural Heritage',
      description: 'Your cultural background and traditions',
      status: 'partial',
      engagement: 78
    },
    {
      id: 'techniques',
      title: 'Craft Techniques',
      description: 'Your unique methods and skills',
      status: 'completed',
      engagement: 85
    },
    {
      id: 'inspiration',
      title: 'Sources of Inspiration',
      description: 'What drives your creativity',
      status: 'missing',
      engagement: 0
    },
    {
      id: 'future',
      title: 'Vision & Goals',
      description: 'Your aspirations and future projects',
      status: 'missing',
      engagement: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'partial': return 'bg-yellow-500'
      case 'missing': return 'bg-gray-300'
      default: return 'bg-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complete'
      case 'partial': return 'Needs Update'
      case 'missing': return 'Not Started'
      default: return 'Unknown'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storytelling Dashboard</h1>
          <p className="text-muted-foreground">Manage your artisan story and expand your digital reach</p>
        </div>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="story">Story Builder</TabsTrigger>
          <TabsTrigger value="products">Product AI</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="growth">Growth Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Story Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Completeness</p>
                    <p className="text-2xl font-bold">{storyMetrics.profileCompleteness}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <Progress value={storyMetrics.profileCompleteness} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Story Engagement</p>
                    <p className="text-2xl font-bold">{storyMetrics.engagement}%</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <Progress value={storyMetrics.engagement} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">{storyMetrics.totalViews.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">+{storyMetrics.recentGrowth.views}% this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Story Components Status */}
          <Card>
            <CardHeader>
              <CardTitle>Your Story Components</CardTitle>
              <CardDescription>Build a complete narrative to maximize your reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storyComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`} />
                      <div>
                        <h4 className="font-medium">{component.title}</h4>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={component.status === 'completed' ? 'default' : 'secondary'}>
                          {getStatusText(component.status)}
                        </Badge>
                        {component.engagement > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {component.engagement}% engagement
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        {component.status === 'missing' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Story Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Share your learning journey</p>
                    <p className="text-xs text-muted-foreground">Tell how you mastered your first technique</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Highlight your heritage</p>
                    <p className="text-xs text-muted-foreground">Connect your work to cultural traditions</p>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => setActiveTab('story')}>
                    Generate Full Story
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Profile Views</span>
                    <span className="text-sm font-medium">+{storyMetrics.recentGrowth.views}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Story Shares</span>
                    <span className="text-sm font-medium">+{storyMetrics.recentGrowth.shares}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Followers</span>
                    <span className="text-sm font-medium">+{storyMetrics.recentGrowth.followers}</span>
                  </div>
                  <Button size="sm" className="w-full" variant="outline" onClick={() => setActiveTab('analytics')}>
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI-Powered Story Builder
              </CardTitle>
              <CardDescription>
                Create compelling stories that connect with your audience and showcase your authentic journey as an artisan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIStoryGenerator 
                onStoryGenerated={(story) => {
                  // Handle story generation
                  console.log('Generated story:', story)
                }}
                initialProfile={{
                  name: artisanName
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Product Marketing Assistant</CardTitle>
              <CardDescription>
                Generate compelling product descriptions and marketing copy that highlights your craftsmanship and storytelling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIProductHelper 
                artisanName={artisanName}
                onDescriptionGenerated={(description) => {
                  console.log('Generated description:', description)
                }}
                onTagsGenerated={(tags) => {
                  console.log('Generated tags:', tags)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{storyMetrics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{storyMetrics.storyShares}</p>
                <p className="text-sm text-muted-foreground">Story Shares</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Inquiries</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Digital Reach Growth</CardTitle>
              <CardDescription>Track how your storytelling is expanding your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Analytics chart would go here (integrate with your preferred charting library)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Story Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📖 Complete Your Story</h4>
                  <p className="text-sm text-muted-foreground">Profiles with complete stories get 3x more engagement</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📸 Add Visual Elements</h4>
                  <p className="text-sm text-muted-foreground">Include photos of your workshop and process</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Use AI Descriptions</h4>
                  <p className="text-sm text-muted-foreground">AI-generated product descriptions perform 40% better</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Digital Marketing Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🌐 Share Your Profile</h4>
                  <p className="text-sm text-muted-foreground mb-2">Increase reach by sharing on social media</p>
                  <Button size="sm" variant="outline">Share Now</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🔗 Update Social Links</h4>
                  <p className="text-sm text-muted-foreground mb-2">Connect your Instagram, Facebook, and website</p>
                  <Button size="sm" variant="outline">Add Links</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">✨ Get Verified</h4>
                  <p className="text-sm text-muted-foreground mb-2">Verified artisans get priority in search</p>
                  <Button size="sm" variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}