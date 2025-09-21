'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createTestProducts } from '@/lib/products'

export function CreateTestProductsButton() {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateTestProducts = async () => {
    setIsCreating(true)
    try {
      await createTestProducts()
      toast({
        title: "Success!",
        description: "Test products have been created successfully.",
      })
    } catch (error) {
      console.error('Error creating test products:', error)
      toast({
        title: "Error",
        description: "Failed to create test products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Button 
      onClick={handleCreateTestProducts} 
      disabled={isCreating}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      {isCreating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Creating Products...
        </>
      ) : (
        'Create Test Products'
      )}
    </Button>
  )
}
