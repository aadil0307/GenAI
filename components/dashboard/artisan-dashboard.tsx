"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LiveMetricsGrid } from '@/components/dashboard/live-metrics-grid'
import { 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Heart,
  Share2,
  Wand2,
  Target,
  ArrowRight,
  Star,
  Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ArtisanDashboardProps {
  artisanName: string
  craftType?: string
}

export function ArtisanDashboard({ artisanName, craftType = "Artisan" }: ArtisanDashboardProps) {
  const router = useRouter()

  // Mock data - in real app this would come from your database/analytics
  const stats = {
    profileViews: 1248,
    storyShares: 34,
    aiStoriesGenerated: 8,
    productsSold: 12,
    totalReach: 3450,
    engagementRate: 85,
    profileCompleteness: 78,
    aiOptimizedProducts: 15
  }

  const aiFeatures = [
    {
      title: "Story Generator",
      description: "Create compelling narratives about your craft journey",
      icon: BookOpen,
      status: "active",
      usage: "8 stories generated",
      action: () => router.push("/storytelling")
    },
    {
      title: "Product AI Assistant",
      description: "Generate optimized descriptions and marketing copy",
      icon: Wand2,
      status: "active", 
      usage: "15 products optimized",
      action: () => router.push("/products/new")
    },
    {
      title: "Digital Analytics",
      description: "Track your reach and engagement growth",
      icon: BarChart3,
      status: "active",
      usage: "Real-time insights",
      action: () => router.push("/analytics")
    },
    {
      title: "AI Discovery",
      description: "Help customers find your crafts through smart recommendations",
      icon: Target,
      status: "coming-soon",
      usage: "Enhanced visibility",
      action: () => {}
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {artisanName}! ✨</h1>
            <p className="opacity-90 mb-4">
              Your AI-powered artisan dashboard is ready to help you expand your digital reach
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {craftType}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                AI-Enhanced Profile
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.totalReach.toLocaleString()}</div>
            <div className="text-sm opacity-90">Total Digital Reach</div>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid - Real-time Dashboard Stats */}
      <LiveMetricsGrid />

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
                  <feature.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {feature.title}
                    {feature.status === 'coming-soon' && (
                      <Badge variant="outline" className="text-xs">Soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">{feature.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{feature.usage}</div>
                <Button 
                  size="sm" 
                  variant={feature.status === 'coming-soon' ? 'outline' : 'default'}
                  onClick={feature.action}
                  disabled={feature.status === 'coming-soon'}
                >
                  {feature.status === 'coming-soon' ? 'Coming Soon' : 'Use Tool'}
                  {feature.status !== 'coming-soon' && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Digital Presence Optimization
          </CardTitle>
          <CardDescription>
            Complete your profile to maximize your digital reach and connect with more customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Profile Completeness</span>
              <span className="text-sm text-muted-foreground">{stats.profileCompleteness}%</span>
            </div>
            <Progress value={stats.profileCompleteness} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">✅ Completed</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Basic profile information</li>
                <li>• AI-generated story</li>
                <li>• Portfolio images</li>
              </ul>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">🔄 Next Steps</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Add workshop photos</li>
                <li>• Update craft techniques</li>
                <li>• Connect social media</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={() => router.push("/profile")}>
              Complete Profile
            </Button>
            <Button size="sm" variant="outline" onClick={() => router.push("/storytelling")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Update Story
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/products/new")}>
          <CardContent className="p-4 text-center">
            <Plus className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-medium mb-1">Add New Product</h3>
            <p className="text-xs text-muted-foreground">Use AI to create compelling descriptions</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/storytelling")}>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium mb-1">Create AI Story</h3>
            <p className="text-xs text-muted-foreground">Generate compelling narratives</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/analytics")}>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium mb-1">View Analytics</h3>
            <p className="text-xs text-muted-foreground">Track your digital growth</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}