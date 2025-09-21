'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  DollarSign,
  Globe,
  Clock,
  Target,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useDashboard } from '@/contexts/dashboard-context'
import { Navbar } from '@/components/layout/navbar'

interface AnalyticsData {
  views: number
  engagement: number
  shares: number
  sales: number
  revenue: number
  reach: number
}

export default function DigitalAnalytics() {
  const [timeframe, setTimeframe] = useState('7d')
  const { stats, isLive } = useDashboard()

  const data = {
    views: stats.profileViews,
    engagement: stats.engagementRate,
    shares: stats.storyShares,
    sales: 12,
    revenue: 890,
    reach: parseInt(stats.monthlyReach.replace('K', '')) * 1000
  }

  const realTimeData = {
    activeViews: stats.activeViewers,
    liveEngagement: stats.liveEngagement,
    todayViews: stats.todayViews
  }

  const insights = [
    {
      title: "Peak Engagement Time",
      value: "2-4 PM",
      description: "Your stories get 65% more engagement during afternoon hours",
      icon: <Clock className="w-4 h-4" />,
      trend: "+15%"
    },
    {
      title: "Top Performing Content",
      value: "Heritage Stories",
      description: "Traditional craft stories drive 3x more engagement",
      icon: <Target className="w-4 h-4" />,
      trend: "+230%"
    },
    {
      title: "Audience Growth",
      value: "23% Monthly",
      description: "AI-generated content increases follower acquisition",
      icon: <TrendingUp className="w-4 h-4" />,
      trend: "+23%"
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      description: "Story-driven products have higher purchase rates",
      icon: <Zap className="w-4 h-4" />,
      trend: "+8%"
    }
  ]

  const weeklyData = [
    { day: 'Mon', views: 180, engagement: 45, sales: 2 },
    { day: 'Tue', views: 220, engagement: 58, sales: 3 },
    { day: 'Wed', views: 195, engagement: 52, sales: 1 },
    { day: 'Thu', views: 240, engagement: 68, sales: 4 },
    { day: 'Fri', views: 280, engagement: 72, sales: 5 },
    { day: 'Sat', views: 320, engagement: 85, sales: 6 },
    { day: 'Sun', views: 210, engagement: 48, sales: 2 }
  ]

  const topContent = [
    { title: "Traditional Pottery Journey", type: "Story", views: 456, engagement: 89 },
    { title: "Handwoven Textile Heritage", type: "Story", views: 389, engagement: 76 },
    { title: "Ceramic Bowl Collection", type: "Product", views: 234, engagement: 65 },
    { title: "Artisan Workshop Tour", type: "Story", views: 198, engagement: 58 }
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Digital Analytics
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      AI-powered insights for your craft business
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Track your reach, engagement, and growth with intelligent analytics
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                {isLive ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50 px-3 py-1">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline Mode
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  Updated: {stats.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Viewers</p>
                <p className="text-2xl font-bold text-green-800">{realTimeData.activeViews}</p>
                <p className="text-xs text-green-600">Right now</p>
              </div>
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Live Engagement</p>
                <p className="text-2xl font-bold text-blue-800">{realTimeData.liveEngagement}</p>
                <p className="text-xs text-blue-600">Active interactions</p>
              </div>
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Today's Views</p>
                <p className="text-2xl font-bold text-purple-800">{realTimeData.todayViews}</p>
                <p className="text-xs text-purple-600">+12% vs yesterday</p>
              </div>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs value={timeframe} onValueChange={setTimeframe} className="mb-8">
        <TabsList>
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
          <TabsTrigger value="90d">90 Days</TabsTrigger>
        </TabsList>

        <TabsContent value={timeframe} className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{data.views.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold">{data.engagement}%</p>
                <p className="text-sm text-muted-foreground">Engagement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Share2 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{data.shares}</p>
                <p className="text-sm text-muted-foreground">Shares</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{data.sales}</p>
                <p className="text-sm text-muted-foreground">Sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold">${data.revenue}</p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-2xl font-bold">{(data.reach / 1000).toFixed(1)}K</p>
                <p className="text-sm text-muted-foreground">Total Reach</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Views and engagement over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{day.views} views</span>
                          <span>{day.engagement}% engagement</span>
                        </div>
                        <Progress value={(day.views / 320) * 100} className="h-2" />
                      </div>
                      <Badge variant="outline">{day.sales} sales</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Your most successful stories and products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{content.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                          <span className="text-xs text-muted-foreground">{content.views} views</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{content.engagement}%</p>
                        <p className="text-xs text-muted-foreground">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Personalized recommendations to grow your reach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {insight.icon}
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-green-600">{insight.trend}</Badge>
                </div>
                <p className="text-lg font-bold mb-1">{insight.value}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>AI-suggested improvements for better reach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">Post during peak hours (2-4 PM)</p>
                <p className="text-sm text-blue-600">Increase engagement by 65%</p>
              </div>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-800">Create more heritage stories</p>
                <p className="text-sm text-green-600">3x higher engagement rate</p>
              </div>
              <Button size="sm" variant="outline">Generate</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <p className="font-medium text-purple-800">Add product videos</p>
                <p className="text-sm text-purple-600">Boost conversion by 40%</p>
              </div>
              <Button size="sm" variant="outline">Upload</Button>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  )
}