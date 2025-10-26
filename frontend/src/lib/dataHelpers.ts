/**
 * Data transformation and calculation utilities for the Event Insights Generator
 * 
 * This module centralizes data processing logic that was previously duplicated
 * across components, improving maintainability and type safety.
 */

import type { RatingsData } from '@/types/api'

export interface AspectHighlight {
  aspect: string
  value: number
}

/**
 * Internal type representing the various shapes of rating data
 * the backend can return (for backward compatibility)
 */
type RawRatingItem = {
  aspect?: string
  name?: string
  value?: number
  average?: number
  performance?: string
  performance_category?: string
}

type RatingsRaw = {
  baseline_data?: RawRatingItem[]
  detailed_comparison?: RawRatingItem[]
  aspects?: string[]
  averages?: number[]
  overall_satisfaction?: number
}

/**
 * Extracts top and lowest performing aspects from ratings data
 * 
 * Handles multiple backend data shapes for backward compatibility:
 * - baseline_data (newer format)
 * - detailed_comparison (alternate format)
 * - aspects + averages arrays (legacy format)
 * 
 * @param ratingsData - The ratings data from the analysis response
 * @returns Object containing top and lowest aspect highlights, or nulls if no data
 * 
 * @example
 * ```ts
 * const highlights = calculateAspectHighlights(analysisResults.ratings.data)
 * if (highlights.top) {
 *   console.log(`Best aspect: ${highlights.top.aspect} (${highlights.top.value}/5)`)
 * }
 * ```
 */
export function calculateAspectHighlights(ratingsData: any): {
  top: AspectHighlight | null
  lowest: AspectHighlight | null
} {
  const rawData = ratingsData as unknown as RatingsRaw
  let baselineData: RawRatingItem[] = []

  // Handle different backend response shapes
  if (rawData.baseline_data && Array.isArray(rawData.baseline_data)) {
    baselineData = rawData.baseline_data
  } else if (rawData.detailed_comparison && Array.isArray(rawData.detailed_comparison)) {
    baselineData = rawData.detailed_comparison
  } else if (rawData.aspects && Array.isArray(rawData.aspects)) {
    baselineData = rawData.aspects.map((aspect, index) => ({
      aspect,
      value: rawData.averages?.[index] || 0,
    }))
  }

  if (baselineData.length === 0) {
    return { top: null, lowest: null }
  }

  // Sort by value descending
  const sorted = [...baselineData].sort((a, b) => 
    (b.value ?? b.average ?? 0) - (a.value ?? a.average ?? 0)
  )

  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  return {
    top: {
      aspect: first.aspect ?? first.name ?? 'unknown',
      value: first.value ?? first.average ?? 0,
    },
    lowest: {
      aspect: last.aspect ?? last.name ?? 'unknown',
      value: last.value ?? last.average ?? 0,
    },
  }
}
