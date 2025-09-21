"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Palette, Sparkles, Users, TrendingUp, Heart, Search } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Palette className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">CraftConnect</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
            Where Artisan Stories Meet AI-Powered Reach
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Discover authentic handcrafted goods and connect with local artisans. Our AI helps craftspeople tell their stories 
            and expand their digital reach to passionate customers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/signup")}>
              Join as Artisan
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/products")}>
              Discover Crafts
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg bg-card">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Storytelling</h3>
            <p className="text-muted-foreground">
              Generate compelling stories about your craft, heritage, and artistic journey with AI assistance
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expand Digital Reach</h3>
            <p className="text-muted-foreground">
              Grow your audience with AI-optimized product descriptions and targeted marketing insights
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect with Customers</h3>
            <p className="text-muted-foreground">
              Build meaningful relationships through authentic storytelling and showcase your craftsmanship
            </p>
          </div>
        </div>

        {/* For Artisans Section */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">For Local Artisans</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your craft into a thriving digital business with AI-powered tools designed specifically for artisans
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">AI Story Generation</h4>
                  <p className="text-sm text-muted-foreground">Create compelling narratives about your artistic journey, heritage, and inspiration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Search className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Product Optimization</h4>
                  <p className="text-sm text-muted-foreground">AI-generated descriptions and tags that highlight your craftsmanship</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <TrendingUp className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Analytics Dashboard</h4>
                  <p className="text-sm text-muted-foreground">Track your digital reach, engagement, and growth metrics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-2 mt-1">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Community Building</h4>
                  <p className="text-sm text-muted-foreground">Connect with customers who appreciate authentic handcrafted goods</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craft Categories Preview */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Discover Traditional Crafts</h3>
          <p className="text-muted-foreground mb-8">Explore authentic handcrafted goods from skilled artisans</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Pottery", "Textiles", "Jewelry", "Woodwork", "Leather", "Glass"].map((craft) => (
              <div key={craft} className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <p className="font-medium text-sm">{craft}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary text-primary-foreground rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Share Your Story?</h3>
          <p className="mb-6 opacity-90">
            Join thousands of artisans who are growing their reach with AI-powered storytelling
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push("/signup")}>
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  )
}
