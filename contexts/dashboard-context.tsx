'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DashboardStats {
  storiesGenerated: number
  productsOptimized: number
  profileViews: number
  engagementRate: number
  storyShares: number
  monthlyReach: string
  activeViewers: number
  liveEngagement: number
  todayViews: number
  lastUpdated: Date
  
  // New metrics from screenshot
  profileViewsGrowth: string // e.g., "+12%"
  storySharesGrowth: string // e.g., "+8%"
  engagementRateGrowth: string // e.g., "+15%"
  monthlyReachGrowth: string // e.g., "+23%"
}

interface RecentActivity {
  id: string
  type: 'story' | 'product' | 'analytics'
  title: string
  timestamp: Date
  badge: string
}

interface DashboardContextType {
  stats: DashboardStats
  recentActivity: RecentActivity[]
  updateStats: (updates: Partial<DashboardStats>) => void
  addActivity: (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => void
  isLive: boolean
  // New methods for real activity tracking
  trackStoryGenerated: () => void
  trackProductOptimized: () => void
  trackProfileView: () => void
  trackStoryShare: () => void
  trackEngagement: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>({
    storiesGenerated: 8,
    productsOptimized: 15,
    profileViews: 1247,
    engagementRate: 78,
    storyShares: 34,
    monthlyReach: '2.1K',
    activeViewers: 23,
    liveEngagement: 8,
    todayViews: 156,
    lastUpdated: new Date(),
    
    // Growth metrics matching the screenshot
    profileViewsGrowth: '+12%',
    storySharesGrowth: '+8%',
    engagementRateGrowth: '+15%',
    monthlyReachGrowth: '+23%'
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'story',
      title: 'Generated artisan heritage story',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      badge: 'Story Generator'
    },
    {
      id: '2',
      type: 'product',
      title: 'Optimized ceramic bowl description',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      badge: 'Product AI'
    },
    {
      id: '3',
      type: 'analytics',
      title: 'Checked weekly performance',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      badge: 'Analytics'
    }
  ])

  const [isLive, setIsLive] = useState(true)
  const [previousStats, setPreviousStats] = useState<DashboardStats | null>(null)

  // Initialize previous stats for growth calculation
  useEffect(() => {
    if (!previousStats) {
      setPreviousStats({
        ...stats,
        profileViews: 1113, // Previous value to calculate +12% growth
        storyShares: 31,    // Previous value to calculate +8% growth  
        engagementRate: 68, // Previous value to calculate +15% growth
        monthlyReach: '1.7K', // Previous value to calculate +23% growth
        profileViewsGrowth: '0%',
        storySharesGrowth: '0%',
        engagementRateGrowth: '0%',
        monthlyReachGrowth: '0%'
      })
    }
  }, [stats, previousStats])

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) return '+0%'
    const growth = ((current - previous) / previous) * 100
    return growth >= 0 ? `+${Math.round(growth)}%` : `${Math.round(growth)}%`
  }

  const updateStats = (updates: Partial<DashboardStats>) => {
    setStats(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date()
    }))
  }

  const addActivity = (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]) // Keep only last 5 activities
  }

  // Real activity tracking functions
  const trackStoryGenerated = () => {
    setStats(prev => ({
      ...prev,
      storiesGenerated: prev.storiesGenerated + 1,
      lastUpdated: new Date()
    }))
    addActivity({
      type: 'story',
      title: 'Generated new artisan story',
      badge: 'Story Generator'
    })
  }

  const trackProductOptimized = () => {
    setStats(prev => ({
      ...prev,
      productsOptimized: prev.productsOptimized + 1,
      lastUpdated: new Date()
    }))
    addActivity({
      type: 'product',
      title: 'Optimized product description',
      badge: 'Product AI'
    })
  }

  const trackProfileView = () => {
    setStats(prev => {
      const newViews = prev.profileViews + 1
      const todayViews = prev.todayViews + 1
      // Use simple baseline calculation to avoid dependency loops
      const growth = ((newViews - 1100) / 1100) * 100
      const newGrowth = `+${Math.max(8, Math.min(15, growth)).toFixed(0)}%`
      
      return {
        ...prev,
        profileViews: newViews,
        todayViews: todayViews,
        profileViewsGrowth: newGrowth,
        lastUpdated: new Date()
      }
    })
  }

  const trackStoryShare = () => {
    setStats(prev => {
      const newShares = prev.storyShares + 1
      // Use simple baseline calculation to avoid dependency loops
      const growth = ((newShares - 30) / 30) * 100
      const newGrowth = `+${Math.max(5, Math.min(12, growth)).toFixed(0)}%`
      
      return {
        ...prev,
        storyShares: newShares,
        storySharesGrowth: newGrowth,
        lastUpdated: new Date()
      }
    })
    addActivity({
      type: 'story',
      title: 'Story shared by user',
      badge: 'Social'
    })
  }

  const trackEngagement = () => {
    setStats(prev => {
      const newEngagement = Math.min(100, prev.engagementRate + 1)
      // Use simple baseline calculation to avoid dependency loops
      const growth = ((newEngagement - 70) / 70) * 100
      const newGrowth = `+${Math.max(10, Math.min(20, growth)).toFixed(0)}%`
      
      return {
        ...prev,
        engagementRate: newEngagement,
        engagementRateGrowth: newGrowth,
        liveEngagement: Math.min(20, prev.liveEngagement + 1),
        lastUpdated: new Date()
      }
    })
  }

  // Enhanced real-time updates with more realistic patterns
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setStats(prev => {
        const updates: Partial<DashboardStats> = {}
        const currentHour = new Date().getHours()
        const isBusinessHours = currentHour >= 9 && currentHour <= 17
        const activityMultiplier = isBusinessHours ? 1.5 : 0.7
        
        // Profile views (most frequent updates)
        if (Math.random() < 0.4 * activityMultiplier) {
          const increment = Math.floor(Math.random() * 3) + 1
          updates.profileViews = prev.profileViews + increment
        }
        
        // Active viewers (real-time metric)
        if (Math.random() < 0.35) {
          const change = Math.floor(Math.random() * 6) - 3 // -3 to +2
          updates.activeViewers = Math.max(15, Math.min(35, prev.activeViewers + change))
        }
        
        // Engagement rate (slower, more meaningful changes)
        if (Math.random() < 0.08) {
          const change = Math.random() < 0.6 ? 1 : -1
          updates.engagementRate = Math.max(60, Math.min(85, prev.engagementRate + change))
        }
        
        // Today's views
        if (Math.random() < 0.3 * activityMultiplier) {
          const increment = Math.floor(Math.random() * 3) + 1
          updates.todayViews = prev.todayViews + increment
        }
        
        // Story shares (less frequent but meaningful)
        if (Math.random() < 0.12 * activityMultiplier) {
          updates.storyShares = prev.storyShares + 1
        }

        // Live engagement (fluctuates more during business hours)
        if (Math.random() < 0.25) {
          const change = Math.floor(Math.random() * 4) - 2
          updates.liveEngagement = Math.max(0, Math.min(15, prev.liveEngagement + change))
        }

        // Monthly reach (slower growth)
        if (Math.random() < 0.05) {
          const currentReach = parseFloat(prev.monthlyReach.replace('K', ''))
          const newReach = currentReach + 0.1
          updates.monthlyReach = `${newReach.toFixed(1)}K`
        }

        // Update growth metrics if we have changes - use fixed calculations to avoid circular dependencies
        if (Object.keys(updates).length > 0) {
          updates.lastUpdated = new Date()
          
          // Use simple baseline calculations instead of previousStats dependency
          if (updates.profileViews) {
            const growth = ((updates.profileViews - 1100) / 1100) * 100
            updates.profileViewsGrowth = `+${Math.max(8, Math.min(15, growth)).toFixed(0)}%`
          }
          if (updates.storyShares) {
            const growth = ((updates.storyShares - 30) / 30) * 100
            updates.storySharesGrowth = `+${Math.max(5, Math.min(12, growth)).toFixed(0)}%`
          }
          if (updates.engagementRate) {
            const growth = ((updates.engagementRate - 70) / 70) * 100
            updates.engagementRateGrowth = `+${Math.max(10, Math.min(20, growth)).toFixed(0)}%`
          }
          if (updates.monthlyReach) {
            updates.monthlyReachGrowth = '+23%' // Keep consistent with design
          }
          
          return { ...prev, ...updates }
        }
        
        return prev
      })
    }, 2000) // Update every 2 seconds for more responsive feeling

    return () => clearInterval(interval)
  }, [isLive]) // Removed problematic dependencies

  // Simulate new activities
  useEffect(() => {
    if (!isLive) return

    const activityInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const activities = [
          { type: 'story' as const, title: 'Generated pottery heritage story', badge: 'Story Generator' },
          { type: 'product' as const, title: 'Optimized textile description', badge: 'Product AI' },
          { type: 'analytics' as const, title: 'Viewed engagement metrics', badge: 'Analytics' },
          { type: 'story' as const, title: 'Created woodcraft narrative', badge: 'Story Generator' },
          { type: 'product' as const, title: 'Enhanced jewelry listing', badge: 'Product AI' }
        ]
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        addActivity(randomActivity)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(activityInterval)
  }, [isLive])

  // Simulate story and product generation
  useEffect(() => {
    const generationInterval = setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance every minute
        if (Math.random() < 0.6) {
          // Story generated
          setStats(prev => ({
            ...prev,
            storiesGenerated: prev.storiesGenerated + 1,
            lastUpdated: new Date()
          }))
          addActivity({
            type: 'story',
            title: 'New artisan story generated',
            badge: 'Story Generator'
          })
        } else {
          // Product optimized
          setStats(prev => ({
            ...prev,
            productsOptimized: prev.productsOptimized + 1,
            lastUpdated: new Date()
          }))
          addActivity({
            type: 'product',
            title: 'Product description optimized',
            badge: 'Product AI'
          })
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(generationInterval)
  }, [])

  return (
    <DashboardContext.Provider value={{
      stats,
      recentActivity,
      updateStats,
      addActivity,
      isLive,
      trackStoryGenerated,
      trackProductOptimized,
      trackProfileView,
      trackStoryShare,
      trackEngagement
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}