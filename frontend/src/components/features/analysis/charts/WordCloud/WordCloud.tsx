
// Attribution: Powered by Carbon Charts (https://github.com/carbon-design-system/carbon-charts)
'use client'
import React, { useEffect, useRef, useState } from 'react'
import SimpleWordCloud from './SimpleWordCloud'

interface WordCloudData {
  word: string
  value: number
  group?: string
}

interface WordCloudProps {
  data?: WordCloudData[]
  title?: string
  className?: string
  height?: number
}

export default function WordCloudComponent({ 
  data = [], 
  title = "One Word Descriptions", 
  className = "",
  height = 400 
}: WordCloudProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  // DEBUG: Force fallback to SimpleWordCloud to test if data flows correctly
  const [useFallback, setUseFallback] = useState(true) // Changed from false to true for testing

  // DEBUG: Log received data
  console.log('🚨🚨🚨 WORDCLOUD COMPONENT RECEIVED 🚨🚨🚨');
  console.log('WordCloud data prop:', data);
  console.log('WordCloud data length:', data?.length);
  console.log('WordCloud data sample:', data?.[0]);
  console.log('🚨🚨🚨 END WORDCLOUD COMPONENT 🚨🚨🚨');
  
  // Force an alert to make sure this component is loading
  if (typeof window !== 'undefined') {
    console.log('🔥 WORDCLOUD: This should appear in browser console!');
  }

  // Load Carbon Charts CSS dynamically
  useEffect(() => {
    // Load Carbon Design System fonts and styles
    const loadCarbonStyles = () => {
      // Check if styles are already loaded
      if (document.querySelector('#carbon-charts-styles')) return

      // Create link elements for Carbon fonts
      const plexSans = document.createElement('link')
      plexSans.rel = 'stylesheet'
      plexSans.href = 'https://1.www.s81c.com/common/carbon/plex/sans.css'
      plexSans.id = 'carbon-plex-sans'

      const plexSansCondensed = document.createElement('link')
      plexSansCondensed.rel = 'stylesheet'
      plexSansCondensed.href = 'https://1.www.s81c.com/common/carbon/plex/sans-condensed.css'
      plexSansCondensed.id = 'carbon-plex-sans-condensed'

      // Add a marker to avoid duplicate loading
      const marker = document.createElement('style')
      marker.id = 'carbon-charts-styles'
      marker.textContent = '/* Carbon Charts styles loaded */'

      document.head.appendChild(plexSans)
      document.head.appendChild(plexSansCondensed)
      document.head.appendChild(marker)
    }

    loadCarbonStyles()
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return

    // Dynamically import and render the chart to avoid SSR issues
    const initChart = async () => {
      try {
        const { WordCloudChart } = await import('@carbon/charts-react')
        const React = await import('react')
        const ReactDOM = await import('react-dom/client')
        
        const chartOptions = {
          title: '',
          resizable: true,
          color: {
            pairing: {
              option: 3
            }
          },
          height: `${height}px`,
          theme: 'dark',
          toolbar: {
            enabled: false
          },
          legend: {
            enabled: false
          }
        }

        // Clear previous content
        if (chartRef.current) {
          chartRef.current.innerHTML = ''
          
          // Create chart element
          const chartElement = React.createElement(WordCloudChart as any, {
            data: data,
            options: chartOptions
          })
          
          // Render using React 18 createRoot API
          const root = ReactDOM.createRoot(chartRef.current)
          root.render(chartElement)
        }
      } catch (error) {
        console.error('Failed to load Carbon Charts, using fallback:', error)
        setUseFallback(true)
      }
    }

      initChart()
  }, [data, height])

  // Use simple fallback if Carbon Charts fails to load
  if (useFallback) {
    return (
      <SimpleWordCloud 
        data={data}
        title={title}
        className={className}
        height={height}
      />
    )
  }

  // If no data provided, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Upload a CSV file with "One-Word Description" column to see word cloud visualization
          </p>
        </div>
        <div className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
          Powered by IBM Carbon Charts
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      
      <div 
        ref={chartRef} 
        className="word-cloud-container"
        style={{ 
          width: '100%', 
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
      />
      
      {/* Attribution */}
      <div className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
        Powered by IBM Carbon Charts
      </div>
      
      {/* Internal styles for Carbon Charts */}
      <style jsx>{`
        .word-cloud-container :global(.bx--cc--word-cloud) {
          background: transparent !important;
        }
        .word-cloud-container :global(.bx--cc--chart-wrapper) {
          background: transparent !important;
        }
        .word-cloud-container :global(svg) {
          background: transparent !important;
        }
      `}</style>
    </div>
  )
}
