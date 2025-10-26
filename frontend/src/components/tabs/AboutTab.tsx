/**
 * About Tab Component
 * 
 * Static informational tab displaying:
 * - Project branding and description
 * - Tech stack visualization
 * - Mission and core features (placeholders)
 * 
 * This is a pure presentational component with no dependencies or state.
 */

import { 
  Insights as InsightsIcon,
  Assessment as AssessmentIcon 
} from "@mui/icons-material"
import {
  SiNextdotjs,
  SiFastapi,
  SiPython,
  SiTypescript,
  SiMui,
  SiVercel,
} from "react-icons/si"

export default function AboutTab() {
  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-1 space-y-8">
          {/* Main Branding Card (sticky) */}
          <div className="glass-card-dark p-6 rounded-2xl sticky top-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-usc-green), var(--color-google-blue))",
                }}
              >
                <InsightsIcon sx={{ fontSize: 32, color: "white" }} />
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Insight Forge
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Event Feedback Analyzer
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              An intelligent tool designed to transform raw event feedback
              into clear, actionable insights for data-driven decision
              making.
            </p>
            <div
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Developed by Google Developer Groups USC
            </div>
          </div>

          {/* --- Tech Stack Card (sticky) --- */}
          <div className="glass-card-dark p-6 rounded-2xl sticky top-56">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiNextdotjs size={18} className="text-white" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Next.js
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiFastapi size={18} className="text-green-400" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  FastAPI
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiPython size={18} className="text-yellow-400" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Python
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <AssessmentIcon
                  sx={{ fontSize: 18, color: "var(--color-chart-primary)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Recharts
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiTypescript size={18} className="text-blue-500" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  TypeScript
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiMui size={18} className="text-blue-600" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Material-UI
                </span>
              </div>
              {/* Tech Item */}
              <div className="flex items-center gap-2">
                <SiVercel size={18} className="text-white" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Vercel
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mission/Purpose Section */}
          <div className="glass-card-dark p-6 rounded-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Provident, adipisci. Culpa impedit placeat quos vitae ea minima
            quod iure autem ipsam nemo, earum nesciunt, beatae debitis
            incidunt perspiciatis rem saepe!
          </div>
          {/* Core Features Section */}
          <div className="glass-card-dark p-6 rounded-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            tempora id atque distinctio eligendi minima a, nemo aperiam eos
            vitae fuga nisi quisquam facilis, sequi, consequuntur libero.
            Optio, omnis eum!{" "}
          </div>
        </div>
      </div>
    </div>
  )
}
