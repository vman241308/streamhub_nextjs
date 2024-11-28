"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChannelGrid } from '@/components/channel-grid'
import { CategoryList } from '@/components/category-list'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'
import type { Category } from '@/types/xtream'
import { CategoryService } from '@/lib/services/client/CategoryService'

export default function LivePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, serverId, serverStatus } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }

    if (!isLoading && !serverStatus.hasData) {
      router.push('/setup')
      return
    }
  }, [isLoading, isAuthenticated, serverStatus.hasData, router])

  useEffect(() => {
    const loadCategories = async () => {
      if (!serverId) return

      try {
        const categoriesData = await CategoryService.getCategories(serverId)
        setCategories(categoriesData)
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [serverId])

  if (isLoading || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="sticky top-[4.5rem]">
          <div className="font-semibold mb-2">Categories</div>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      <div className="col-span-9">
        {selectedCategory && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">
              {selectedCategory.category_name}
            </h1>
            <ChannelGrid 
              serverId={serverId!} 
              categoryId={selectedCategory.category_id} 
            />
          </div>
        )}
      </div>
    </div>
  )
}