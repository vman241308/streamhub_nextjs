import { CategoryBadge } from '@/types/database'
import { cleanupName } from './text-formatters'

// Map of special stylized text to their badge configurations
const STYLIZED_BADGES: Array<{
  pattern: RegExp
  type: CategoryBadge['type']
  value: string
}> = [
  { pattern: /ᴴᴰ/g, type: 'quality', value: 'HD' },
  { pattern: /ᴳᴼᴸᴰ/g, type: 'provider', value: 'GOLD' },
  { pattern: /ᴿᴬᵂ/g, type: 'content', value: 'RAW' },
  { pattern: /ᵃᵐᶻ/g, type: 'provider', value: 'AMAZON' }
]

export function extractBadges(name: string): {
  cleanName: string
  badges: CategoryBadge[]
} {
  let workingName = name
  const badges: CategoryBadge[] = []

  // Extract stylized badges
  STYLIZED_BADGES.forEach(({ pattern, type, value }) => {
    if (pattern.test(workingName)) {
      badges.push({ type, value })
      workingName = workingName.replace(pattern, '')
    }
  })

  // Clean up the name using the consolidated cleanup utility
  const cleanedName = cleanupName(workingName)

  return {
    cleanName: cleanedName.trim() || name, // Fallback to original if cleaned version is empty
    badges
  }
}