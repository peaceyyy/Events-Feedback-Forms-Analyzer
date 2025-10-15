// utils/wordCloudUtils.ts
// Utilities for transforming AI analysis data into WordCloud format

export interface WordCloudData {
  word: string
  value: number
  group?: string
}

/**
 * Transform one-word descriptions from AI analysis into WordCloud data format
 * @param aiData - Raw AI analysis data containing one-word descriptions
 * @returns Formatted data for WordCloud component
 */
export function transformAIDataToWordCloud(aiData: any): WordCloudData[] {
  if (!aiData || !aiData.one_word_descriptions) {
    return []
  }

  // Expected AI data structure:
  // {
  //   one_word_descriptions: {
  //     positive: { word: frequency, ... },
  //     negative: { word: frequency, ... },
  //     neutral: { word: frequency, ... }
  //   }
  // }

  const wordCloudData: WordCloudData[] = []
  
  const { one_word_descriptions } = aiData

  // Process positive words
  if (one_word_descriptions.positive) {
    Object.entries(one_word_descriptions.positive).forEach(([word, frequency]) => {
      wordCloudData.push({
        word: word,
        value: frequency as number,
        group: 'Positive'
      })
    })
  }

  // Process negative words  
  if (one_word_descriptions.negative) {
    Object.entries(one_word_descriptions.negative).forEach(([word, frequency]) => {
      wordCloudData.push({
        word: word,
        value: frequency as number,
        group: 'Negative'
      })
    })
  }

  // Process neutral words
  if (one_word_descriptions.neutral) {
    Object.entries(one_word_descriptions.neutral).forEach(([word, frequency]) => {
      wordCloudData.push({
        word: word,
        value: frequency as number,
        group: 'Neutral'
      })
    })
  }

  // Sort by frequency (highest first)
  return wordCloudData.sort((a, b) => b.value - a.value)
}

/**
 * Transform simple word frequency data into WordCloud format
 * @param wordFrequencies - Object with word: frequency pairs
 * @param defaultGroup - Default group for all words
 * @returns Formatted data for WordCloud component
 */
export function transformWordFrequenciesToWordCloud(
  wordFrequencies: Record<string, number>,
  defaultGroup: string = 'Default'
): WordCloudData[] {
  return Object.entries(wordFrequencies)
    .map(([word, frequency]) => ({
      word,
      value: frequency,
      group: defaultGroup
    }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Get sample data for testing WordCloud component
 * @returns Sample WordCloud data
 */
export function getSampleWordCloudData(): WordCloudData[] {
  return [
    { word: 'Engaging', value: 52, group: 'Positive' },
    { word: 'Informative', value: 45, group: 'Positive' },
    { word: 'Inspiring', value: 38, group: 'Positive' },
    { word: 'Professional', value: 42, group: 'Positive' },
    { word: 'Networking', value: 35, group: 'Neutral' },
    { word: 'Interactive', value: 29, group: 'Positive' },
    { word: 'Crowded', value: 22, group: 'Negative' },
    { word: 'Rushed', value: 18, group: 'Negative' },
    { word: 'Educational', value: 33, group: 'Positive' },
    { word: 'Organized', value: 40, group: 'Positive' },
    { word: 'Innovative', value: 27, group: 'Positive' },
    { word: 'Collaborative', value: 25, group: 'Positive' },
    { word: 'Technical', value: 31, group: 'Neutral' },
    { word: 'Helpful', value: 28, group: 'Positive' },
    { word: 'Lengthy', value: 19, group: 'Negative' },
    { word: 'Valuable', value: 36, group: 'Positive' },
    { word: 'Creative', value: 24, group: 'Positive' },
    { word: 'Practical', value: 32, group: 'Positive' },
    { word: 'Confusing', value: 16, group: 'Negative' },
    { word: 'Memorable', value: 26, group: 'Positive' }
  ]
}