"use client"

import { memo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CategoryBadge } from "@/components/category-badge"
import { cn } from "@/lib/utils/utils"
import type { Category } from "@/types/xtream"
import type { CategoryBadge as CategoryBadgeType } from "@/types/database"

interface CategoryListProps {
  categories: Category[]
  selectedCategory: Category | null
  onSelectCategory: (category: Category) => void
}

function CategoryListComponent({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="rounded-lg border bg-gradient-to-b from-background to-muted/30">
      <ScrollArea className="h-[calc(100vh*3/4-6rem)]">
        <div className="p-2">
          {categories.map((category) => {
            // Parse badges if they exist
            let badges: CategoryBadgeType[] = []
            if (category.badges) {
              badges = Array.isArray(category.badges) ? category.badges : []
            }

            return (
              <button
                key={`category-${category.category_id}`}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md transition-all mb-1",
                  "text-sm font-medium",
                  selectedCategory?.category_id === category.category_id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => onSelectCategory(category)}
              >
                <div className="flex items-center gap-1.5 w-full overflow-hidden">
                  <span className="truncate">{category.category_name}</span>
                  {badges.length > 0 && (
                    <div className="flex gap-1 flex-shrink-0">
                      {badges.map((badge, index) => (
                        <CategoryBadge 
                          key={`${badge.type}-${badge.value}-${index}`}
                          badge={badge}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export const CategoryList = memo(CategoryListComponent)
CategoryList.displayName = "CategoryList"