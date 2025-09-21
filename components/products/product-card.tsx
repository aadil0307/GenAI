"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Edit, Trash2 } from "lucide-react"
import type { Product } from "@/types/product"
import { useRouter } from "next/navigation"
import { useFavorites } from "@/contexts/favorites-context"
import { formatCurrencyCompact } from "@/lib/currency"

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
}

export function ProductCard({ product, showActions = false, onEdit, onDelete }: ProductCardProps) {
  const router = useRouter()
  const { favoriteIds, addToFavorites, removeFromFavorites, isInFavorites, loading } = useFavorites()

  const isFavorite = isInFavorites(product.id)

  const handleCardClick = () => {
    if (!showActions) {
      router.push(`/products/${product.id}`)
    }
  }

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (loading) return
    
    if (isFavorite) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
      case "good":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
      case "fair":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
      case "poor":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg"
    }
  }

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl ${!showActions ? "hover:scale-[1.02] cursor-pointer" : ""} bg-gradient-to-b from-white to-gray-50/50`}
    >
      <div onClick={handleCardClick}>
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {!showActions && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500/90 hover:bg-red-600 text-white shadow-lg' 
                  : 'bg-white/90 hover:bg-white text-gray-600 shadow-md'
              } backdrop-blur-sm`}
              onClick={handleFavoriteToggle}
              disabled={loading}
            >
              <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
            </Button>
          )}
          
          <Badge 
            className={`absolute top-3 left-3 shadow-lg backdrop-blur-sm border-0 ${getConditionColor(product.condition)}`}
          >
            {product.condition}
          </Badge>
          
          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-lg font-bold text-gray-900">{formatCurrencyCompact(product.price)}</p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 bg-gradient-to-b from-white to-gray-50/30">
        <div className="space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {formatCurrencyCompact(product.price)}
            </p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {product.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {product.location && (
              <div className="flex items-center text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">{product.location}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              by <span className="font-medium text-blue-600">{product.sellerName}</span>
            </div>
          </div>

          {showActions && (
            <div className="flex space-x-2 pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit?.(product)} 
                className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(product.id)}
                className="flex-1 text-destructive hover:text-destructive hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
