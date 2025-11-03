  // UnifiedWordCloud.tsx - Single component handling both Carbon Charts and fallback
'use client';
import React, { useEffect, useState } from 'react';
import { WordCloudChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

interface WordCloudData {
  word: string;
  value: number;
  group?: string;
}

interface WordCloudStats {
  total_responses: number;
  unique_words: number;
  most_common?: [string, number];
  response_rate: number;
}

interface UnifiedWordCloudProps {
  data?: WordCloudData[];
  stats?: WordCloudStats;
  title?: string;
  className?: string;
  height?: number;
  showStats?: boolean;
}

export default function UnifiedWordCloud({
  data = [],
  stats,
  title = 'One Word Descriptions',
  className = '',
  height = 450,
  showStats = false,
}: UnifiedWordCloudProps) {
  const [useFallback, setUseFallback] = useState(false);


  const options = {
    title: title,
    resizable: true,
    theme: 'dark',
    height: `${height}px`,
    wordCloud: {
      fontFamily: 'IBM Plex Sans, sans-serif',
      fontSizeRange: () => [20, 80], // Larger font range for better visibility

      padding: 18, // More generous spacing between words
    },
    color: {
      scale: {
        descriptions: '#78a9ff',
      },
    },
    tooltip: { enabled: false },
    legend: { enabled: false },
    grid: { x: { show: false }, y: { show: false } },
    toolbar: { enabled: false },
    animations: { enabled: true },
  };

  // Fallback word cloud implementation with generous spacing
  const renderFallbackWordCloud = () => {
    if (!data.length) return null;

    const maxValue = Math.max(...data.map((item) => item.value));

    const getWordSize = (value: number) => {
      const ratio = value / maxValue;
      return Math.max(1.2, ratio * 4.5); // Min 1.2rem, max 4.5rem - bigger range
    };

    const getWordColor = (value: number) => {
      const intensity = value / maxValue;
    if (intensity > 0.8) return '#78a9ff'; // High frequency - bright blue
      if (intensity > 0.5) return '#82cfff'; // Medium frequency - cyan
      if (intensity > 0.3) return '#42be65'; // Lower frequency - green
      return '#ffab00'; // Low frequency - yellow
    };

    return (
      <div
        className="flex flex-wrap items-center justify-center gap-4 p-8"
        style={{
          height: `${height}px`,
          overflowY: 'auto',
          background:
            'linear-gradient(135deg, rgba(38, 38, 38, 0.9), rgba(57, 57, 57, 0.5))',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {data.map((item, index) => (
          <span
            key={`${item.word}-${index}`}
            className="font-bold transition-all duration-300 hover:scale-110 cursor-default select-none"
            style={{
              fontSize: `${getWordSize(item.value)}rem`,
              color: getWordColor(item.value),
              opacity: 0.9 + (item.value / maxValue) * 0.1,
              lineHeight: 1.3,
              margin: '0.5rem', 
                            padding: '0.25rem 0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              fontWeight: Math.min(900, 500 + (item.value / maxValue) * 400),
            }}
            title={`"${item.word}" - mentioned ${item.value} times`}
          >
            {item.word}
          </span>
        ))}
      </div>
    );
  };


  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Word Cloud */}
      <div className="glass-card-dark p-6 rounded-xl">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>

        {useFallback ? (
          renderFallbackWordCloud()
        ) : (
          <WordCloudChart data={data} options={options as any} />
        )}

        {/* Attribution */}
        <div
          className="text-xs mt-4 text-center"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {useFallback
            ? 'Custom Word Cloud Implementation'
            : 'Powered by IBM Carbon Charts'}
        </div>
      </div>

      {/* Statistics Panel (optional) */}
      {showStats && stats && (
        <div className="glass-card-dark p-4 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: '#42be65' }}
              >
                {stats.total_responses}
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Total Descriptions
              </div>
            </div>

            <div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: '#78a9ff' }}
              >
                {stats.unique_words}
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Unique Words
              </div>
            </div>

            <div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: '#ffab00' }}
              >
                {stats.response_rate}%
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Response Rate
              </div>
            </div>

            {stats.most_common && (
              <div>
                <div
                  className="text-xl font-bold mb-1"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  "{stats.most_common[0]}"
                </div>
                <div
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Most Common ({stats.most_common[1]}x)
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
