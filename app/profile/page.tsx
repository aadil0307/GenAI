"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useDashboard } from "@/contexts/dashboard-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { ProfileForm } from "@/components/profile/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Heart, Eye, Share2, Calendar, MapPin } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { trackProfileView } = useDashboard()
  const router = useRouter()
  const [stories, setStories] = useState<any[]>([])
  const [loadingStories, setLoadingStories] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Track profile view when page loads
  useEffect(() => {
    if (user) {
      trackProfileView()
      fetchUserStories()
    }
  }, [user, trackProfileView])

  const fetchUserStories = async () => {
    if (!user) return
    
    setLoadingStories(true)
    try {
      const storiesRef = collection(db, 'artisan-stories')
      const q = query(
        storiesRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const userStories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      
      setStories(userStories)
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoadingStories(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Profile Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">Manage your account and view your artisan stories</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Settings
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Stories ({stories.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="stories">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Your Artisan Stories
                  </CardTitle>
                  <CardDescription>
                    Stories you've created and shared through AI Story Generator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStories ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : stories.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first artisan story using our AI Story Generator
                      </p>
                      <Button onClick={() => router.push('/dynamic-ai')}>
                        Create Story
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {stories.map((story) => (
                        <Card key={story.id} className="hover:shadow-lg transition-all duration-200 border border-slate-200 bg-white/80 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  {story.artisanProfile?.name || 'Artisan'}'s Story
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {story.createdAt?.toLocaleDateString() || 'Recently'}
                                  </div>
                                  {story.artisanProfile?.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {story.artisanProfile.location}
                                    </div>
                                  )}
                                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    {story.storyOptions?.tone || 'warm'} tone
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                  <Eye className="w-3 h-3" />
                                  {story.views || 0}
                                </div>
                                <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                                  <Heart className="w-3 h-3 text-red-500" />
                                  {story.likes || 0}
                                </div>
                                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                                  <Share2 className="w-3 h-3 text-green-500" />
                                  {story.shares || 0}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {story.artisanProfile?.craftType && (
                                <Badge variant="outline" className="border-purple-200 text-purple-700">
                                  {story.artisanProfile.craftType}
                                </Badge>
                              )}
                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <p className="text-sm leading-relaxed text-slate-700">
                                  {story.content}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                  onClick={() => navigator.clipboard.writeText(story.content)}
                                >
                                  Copy Story
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                                  onClick={() => router.push('/dynamic-ai')}
                                >
                                  Create Similar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
