// frontend/src/components/features/analysis/charts/PerAspectAveragesChart.tsx
"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface PerAspectAveragesChartProps {
  data: any;
  className?: string;
}

/**
 * A specialized chart to display the average scores for different event aspects.
 * It presents the data as a horizontal bar chart for clear, direct comparison.
 *
 * @param {PerAspectAveragesChartProps} props The component props.
 * @param {any} props.data The raw data object, expected to contain aspect ratings.
 * @param {string} [props.className] Optional CSS classes for custom styling.
 * @returns {JSX.Element} The rendered chart component.
 */
export default function PerAspectAveragesChart({
  data,
  className = "",
}: PerAspectAveragesChartProps) {
  // Memoize the transformed data to prevent recalculations on every render.
  // This is a performance optimization.
  const chartData = React.useMemo(() => {
    let aspectData: { aspect: string; value: number }[] = [];

    // This logic mirrors the data handling in other charts to ensure component compatibility.
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

    // Sort data to have the highest value on top for better visual hierarchy.
    // Create a shallow copy before sorting to avoid mutating the original prop array
    return [...aspectData].sort((a, b) => (a.value || 0) - (b.value || 0));
  }, [data]);

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            type="number"
            domain={[0, 5]}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
          />
          <YAxis
            type="category"
            dataKey="aspect"
            width={80}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            contentStyle={{
              background: "rgba(30, 41, 59, 0.8)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
            formatter={(value: number) => [
              `${value.toFixed(2)} / 5.0`,
              "Average Rating",
            ]}
          />
          <Bar dataKey="value" fill="var(--color-google-blue)" barSize={20}>
            <LabelList
              dataKey="value"
              position="right"
              formatter={(label: any) =>
                typeof label === "number" ? label.toFixed(1) : ""
              }
              style={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
