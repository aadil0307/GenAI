"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatarSVG } from "@/components/ui/profile-avatar-svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/products/search-bar"
import { Palette, Heart, ShoppingCart, User, LogOut, Plus, Sparkles, BookOpen, BarChart3, Wand2, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, userProfile, logout } = useAuth()
  const { cartCount } = useCart()
  const { favorites } = useFavorites()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/products")
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group transition-all duration-200 hover:scale-105" 
            onClick={() => router.push("/dashboard")}
          >
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">
              CraftConnect
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            {/* AI Dashboard */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/ai-dashboard")}
              className="relative hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 hidden md:flex"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Dashboard
            </Button>

            {/* Dynamic AI */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/dynamic-ai")}
              className="relative hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 hidden md:flex"
            >
              <Settings className="h-4 w-4 mr-2" />
              Dynamic AI
            </Button>

            {/* Analytics Dashboard */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/analytics")}
              className="relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hidden md:flex"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/products/new")}
              className="relative hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 transition-all duration-200" 
              onClick={() => router.push("/favorites")}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-pink-500 to-red-500 border-0 shadow-lg animate-pulse">
                  {favorites.length > 99 ? "99+" : favorites.length}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200" 
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-500 to-purple-500 border-0 shadow-lg animate-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                  <ProfileAvatarSVG 
                    size={44} 
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    showOnlineIndicator={true}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-3 shadow-2xl border-0 bg-white/95 backdrop-blur-lg" align="end" forceMount>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl mb-3">
                  <ProfileAvatarSVG 
                    size={48} 
                    showOnlineIndicator={true}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{userProfile?.username || "User"}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer rounded-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200"
                >
                  <User className="mr-3 h-4 w-4 text-emerald-600" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => router.push("/my-listings")}
                  className="cursor-pointer rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                >
                  <Plus className="mr-3 h-4 w-4 text-blue-600" />
                  <span>My Listings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => router.push("/purchases")}
                  className="cursor-pointer rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                >
                  <ShoppingCart className="mr-3 h-4 w-4 text-purple-600" />
                  <span>Purchase History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer rounded-md hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 text-red-600 focus:text-red-700"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
