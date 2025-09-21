'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Sparkles, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart,
  ArrowRight,
  Wand2,
  Brain,
  Search,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useDashboard } from '@/contexts/dashboard-context'
import { Navbar } from '@/components/layout/navbar'
import { SessionStatus } from '@/components/debug/session-status'

interface AIFeatureCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  usageCount: number
  maxUsage?: number
  status: 'active' | 'coming-soon'
  route: string
  color: string
}

export default function ComprehensiveAIDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { stats, recentActivity, isLive } = useDashboard()

  const aiFeatures: AIFeatureCard[] = [
    {
      id: 'story-generator',
      title: 'Story Generator',
      description: 'Create compelling narratives about your craft journey',
      icon: <BookOpen className="w-6 h-6" />,
      usageCount: stats.storiesGenerated,
      maxUsage: 50,
      status: 'active',
      route: '/dynamic-ai',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'product-assistant',
      title: 'Product AI Assistant',
      description: 'Generate optimized descriptions and marketing copy',
      icon: <Sparkles className="w-6 h-6" />,
      usageCount: stats.productsOptimized,
      maxUsage: 100,
      status: 'active',
      route: '/products/new',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'digital-analytics',
      title: 'Digital Analytics',
      description: 'Track your reach and engagement growth',
      icon: <BarChart3 className="w-6 h-6" />,
      usageCount: 0,
      status: 'active',
      route: '/analytics',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'ai-discovery',
      title: 'AI Discovery',
      description: 'Help customers find your crafts through smart recommendations',
      icon: <Brain className="w-6 h-6" />,
      usageCount: 0,
      status: 'coming-soon',
      route: '/discovery',
      color: 'from-pink-500 to-red-500'
    }
  ]

  const quickStats = [
    { label: 'Profile Views', value: stats.profileViews.toLocaleString(), change: '+12%', icon: <Eye className="w-4 h-4" /> },
    { label: 'Story Shares', value: stats.storyShares, change: '+8%', icon: <Heart className="w-4 h-4" /> },
    { label: 'Engagement Rate', value: `${stats.engagementRate}%`, change: '+15%', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Monthly Reach', value: stats.monthlyReach, change: '+23%', icon: <Users className="w-4 h-4" /> }
  ]

  const handleFeatureClick = (feature: AIFeatureCard) => {
    if (feature.status === 'active') {
      router.push(feature.route)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      AI-Powered Dashboard
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Transform your craft business with intelligent tools
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">
                    Welcome back, <span className="font-semibold text-foreground">{user?.displayName || 'Artisan'}</span>
                  </p>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">
                    Manage your digital presence with AI
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                {isLive ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live Updates
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50 px-3 py-1">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline Mode
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Last updated: {stats.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {quickStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-green-600">{stat.change}</p>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="text-blue-600">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {aiFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg ${
                  feature.status === 'coming-soon' ? 'opacity-70' : ''
                }`}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    {feature.status === 'coming-soon' ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">Soon</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    )}
                  </div>
                  <CardTitle className="flex items-center justify-between text-xl">
                    {feature.title}
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {feature.status === 'active' && feature.maxUsage && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{feature.usageCount} {feature.id === 'story-generator' ? 'stories generated' : 'products optimized'}</span>
                        <span className="text-muted-foreground">{feature.maxUsage} limit</span>
                      </div>
                      <Progress value={(feature.usageCount / feature.maxUsage) * 100} className="h-3" />
                    </div>
                  )}
                  {feature.status === 'active' && !feature.maxUsage && (
                    <div className="text-sm text-muted-foreground">
                      Real-time insights and analytics
                    </div>
                  )}
                  {feature.status === 'coming-soon' && (
                    <div className="text-sm text-muted-foreground">
                      Enhanced AI-powered visibility coming soon
                    </div>
                  )}
                  <Button 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                    className="w-full mt-6 h-11"
                    disabled={feature.status === 'coming-soon'}
                  >
                    {feature.status === 'active' ? 'Use Tool' : 'Coming Soon'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl">Recent AI Activity</CardTitle>
              <CardDescription>Your latest interactions with AI tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl shadow-sm ${
                      activity.type === 'story' ? 'bg-gradient-to-br from-purple-100 to-purple-50' :
                      activity.type === 'product' ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 'bg-gradient-to-br from-green-100 to-green-50'
                    }`}>
                      {activity.type === 'story' && <BookOpen className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'product' && <Sparkles className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'analytics' && <BarChart3 className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">{activity.badge}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      {/* AI Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Complete Your Profile</h4>
              <p className="text-sm text-muted-foreground">Add heritage and inspiration details for richer AI-generated stories.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Use AI Descriptions</h4>
              <p className="text-sm text-muted-foreground">Let AI optimize your product descriptions for better search visibility.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Monitor Analytics</h4>
              <p className="text-sm text-muted-foreground">Track your digital reach growth with AI-powered insights.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JWT Session Status - Development/Debug Component */}
      <SessionStatus />
        </div>
      </div>
    </>
  )
}