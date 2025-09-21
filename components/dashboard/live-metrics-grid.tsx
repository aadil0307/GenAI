'use client'

import { useDashboard } from '@/contexts/dashboard-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, TrendingUp, Users } from 'lucide-react'

export function LiveMetricsGrid() {
  const { stats } = useDashboard()

  const metrics = [
    {
      title: 'PROFILE VIEWS',
      value: stats.profileViews.toLocaleString(),
      growth: stats.profileViewsGrowth,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'STORY SHARES',
      value: stats.storyShares.toString(),
      growth: stats.storySharesGrowth,
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'ENGAGEMENT RATE',
      value: `${stats.engagementRate}%`,
      growth: stats.engagementRateGrowth,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'MONTHLY REACH',
      value: stats.monthlyReach,
      growth: stats.monthlyReachGrowth,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const isPositiveGrowth = metric.growth.startsWith('+')
        
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground tracking-wide">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {metric.value}
                    </span>
                    <Badge 
                      variant={isPositiveGrowth ? "default" : "destructive"} 
                      className={`text-xs font-medium ${
                        isPositiveGrowth 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {metric.growth}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              
              {/* Live indicator */}
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}