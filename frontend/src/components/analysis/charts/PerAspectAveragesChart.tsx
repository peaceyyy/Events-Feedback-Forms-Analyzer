// frontend/src/components/features/analysis/charts/PerAspectAveragesChart.tsx
"use client";
import React from "react";

interface PerAspectAveragesChartProps {
  data: any;
  className?: string;
}

/**
 * A specialized chart to display the average scores for different event aspects.
 * Styled to match the Satisfaction Distribution chart with horizontal gradient bars.
 */
export default function PerAspectAveragesChart({
  data,
  className = "",
}: PerAspectAveragesChartProps) {
  // Memoize the transformed data to prevent recalculations on every render
  const chartData = React.useMemo(() => {
    let aspectData: { aspect: string; value: number }[] = [];

    // Data handling logic to ensure component compatibility
    if (data && data.baseline_data && Array.isArray(data.baseline_data)) {
      aspectData = data.baseline_data;
    } else if (
      data &&
      data.detailed_comparison &&
      Array.isArray(data.detailed_comparison)
    ) {
      aspectData = data.detailed_comparison;
    } else if (
      data &&
      data.aspects &&
      data.averages &&
      Array.isArray(data.aspects)
    ) {
      aspectData = data.aspects.map((aspect: string, index: number) => ({
        aspect: aspect,
        value: data.averages[index] || 0,
      }));
    }

    // Sort from lowest to highest for better visual hierarchy (highest at bottom)
    return [...aspectData].sort((a, b) => (a.value || 0) - (b.value || 0));
  }, [data]);

  // Color gradient based on rating value
  const getBarColor = (value: number) => {
    if (value >= 4.0) return "linear-gradient(90deg, #42be65 0%, #24a148 100%)"; // Green
    if (value >= 3.5) return "linear-gradient(90deg, #78a9ff 0%, #4589ff 100%)"; // Blue
    if (value >= 3.0) return "linear-gradient(90deg, #ffab00 0%, #f1c21b 100%)"; // Yellow
    if (value >= 2.5) return "linear-gradient(90deg, #ff832b 0%, #ff6b35 100%)"; // Orange
    return "linear-gradient(90deg, #ff8389 0%, #fa4d56 100%)"; // Red
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div
        className={`glass-card-dark p-6 rounded-2xl border border-white/10 flex items-center justify-center ${className}`}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>
          No aspect data available to display.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`glass-card-dark p-6 rounded-2xl border border-white/10 ${className}`}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Per Aspect Averages
      </h3>

      {/* Stylized Horizontal Bars */}
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Aspect Label */}
            <div
              className="w-20 text-left text-sm font-medium flex-shrink-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.aspect}
            </div>

            {/* Bar Container */}
            <div className="flex-1 relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
              {/* Filled Bar with Gradient */}
              <div
                className="h-full rounded-lg transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / 5) * 100}%`,
                  background: getBarColor(item.value),
                }}
              />
              {/* Value Label */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.value.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scale Reference */}
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs" style={{ color: "var(--color-text-secondary)" }}>
        <span>0</span>
        <span>2.5</span>
        <span>5.0</span>
      </div>
    </div>
  );
}
