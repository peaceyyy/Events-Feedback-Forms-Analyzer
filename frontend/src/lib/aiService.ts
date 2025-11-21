/**
 * AI Service Layer for Gemini-powered insights
 */

import type { 
  MarketingAIInsights, 
  AspectAIInsights,
  DiscoveryChannelsData 
} from '@/types/api'
import logger from '@/lib/logger'

/**
 * Generate AI insights for marketing channel performance
 * 
 * Analyzes discovery channel effectiveness, conversion rates,
 * and provides marketing budget allocation recommendations.
 * 
 * @param channelImpactData - Discovery channel performance data
 * @returns AI-generated marketing insights or error object
 */
export async function generateMarketingInsights(
  channelImpactData: DiscoveryChannelsData['data']
): Promise<MarketingAIInsights> {
  try {
    const response = await fetch('/api/ai/marketing-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel_data: channelImpactData.channels,
        stats: (channelImpactData as any).stats,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate marketing insights')
    }

    return result.insights
  } catch (error) {
    logger.error('Marketing insights generation error:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generate AI insights for event aspect performance
 * 
 * Analyzes venue, speaker, and content ratings to identify
 * quick wins and strategic improvement priorities.
 * 
 * @param ratingsData - Aspect ratings data (handles multiple backend formats)
 * @returns AI-generated aspect insights or error object
 */
export async function generateAspectInsights(
  ratingsData: any
): Promise<AspectAIInsights> {
  try {
    console.log('=== generateAspectInsights called ===');
    console.log('Full ratingsData:', JSON.stringify(ratingsData, null, 2));
    
    if (!ratingsData) {
      throw new Error('No aspect data available')
    }

    // Transform data for backend (normalize different data shapes)
    let aspects = []
    let overallSatisfaction = 4.0

    if (ratingsData.baseline_data && Array.isArray(ratingsData.baseline_data)) {
      console.log('Using baseline_data path');
      aspects = ratingsData.baseline_data.map((item: any) => ({
        aspect: item.aspect || item.name,
        value: item.value || item.average || 0,
        difference: (item.value || item.average || 0) - (ratingsData.overall_satisfaction || 4.0),
        performance: item.performance || item.performance_category || 'adequate',
      }))
      overallSatisfaction = ratingsData.overall_satisfaction || 4.0
    } else if (ratingsData.detailed_comparison && Array.isArray(ratingsData.detailed_comparison)) {
      console.log('Using detailed_comparison path');
      aspects = ratingsData.detailed_comparison.map((item: any) => ({
        aspect: item.aspect || item.name,
        value: item.value || item.average || 0,
        difference: (item.value || item.average || 0) - (ratingsData.overall_satisfaction || 4.0),
        performance: item.performance || item.performance_category || 'adequate',
      }))
      overallSatisfaction = ratingsData.overall_satisfaction || 4.0
    } else {
      console.error('Data structure not recognized!');;
      throw new Error('Unrecognized aspect data structure. Expected baseline_data or detailed_comparison array.');
    }
    
    if (aspects.length === 0) {
      throw new Error('No aspects found in data');
    }
    
    console.log('Making API request to /api/ai/aspect-insights');

    const response = await fetch('/api/ai/aspect-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aspect_data: {
          aspects,
          overall_satisfaction: overallSatisfaction,
        },
      }),
    })

    console.log('API response status:', response.status);
    const result = await response.json()
    console.log('API response data:', result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate aspect insights')
    }

    return result.insights
  } catch (error) {
    logger.error('Aspect insights generation error:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
