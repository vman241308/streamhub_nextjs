"use client"

import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import type { CategoryBadge as CategoryBadgeType } from "@/types/database"

interface CategoryBadgeProps {
  badge: CategoryBadgeType
}

function CategoryBadgeComponent({ badge }: CategoryBadgeProps) {
  return (
    <Badge 
      variant={badge.type}
      className="px-1.5 py-0 text-[10px] font-medium"
    >
      {badge.value}
    </Badge>
  )
}

export const CategoryBadge = memo(CategoryBadgeComponent)
CategoryBadge.displayName = "CategoryBadge"