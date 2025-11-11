
import { 
  Insights as InsightsIcon,
  Assessment as AssessmentIcon 
} from "@mui/icons-material"
import {
  SiNextdotjs,
  SiFlask,
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
                  InSight
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
                <SiFlask size={18} className="text-gray-400" />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Flask
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
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Project Context
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              This analyzer is one part of a larger project for our Web
              Development II course: the <strong>Student Org Suite (SOS)</strong>
              , a set of tools for Google Developer Group (GDG) chapters.
              <br />
              <br />
              Designed to complement tools like Bevy, it processes CSV files from
              post-event feedback forms. While it accepts any CSV, it is
              optimized for the GDG-USC post-event sensing form template.
            </p>
          </div>
          {/* Developer's Note & Acknowledgements */}
          <div className="glass-card-dark p-6 rounded-2xl">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              A Note from the Developer
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Though it took more than a month of development, I consider this as more a prototype/proof-of-concept project and is more to display familiarity with Web Development frameworks and tools and overall, improve my versatility in Web Dev Technologies as somebody who leans towards more AI/ML technologies. 

              <br />
              <br />
              Along with my group mates, Avyrl Joie Arranguez, Dustin Balansag,
              and Matt Cabarrubias, I, Homer Adriel Dorin (GDG on Campus USC
              Organizer '25-'26), humbly thank you for visiting. We wish you a
              great day and a far greater life ahead.
            </p>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="Red Heart">
                ❤️
              </span>
              <span role="img" aria-label="Blue Heart">
                💙
              </span>
              <span role="img" aria-label="Green Heart">
                💚
              </span>
              <span role="img" aria-label="Yellow Heart">
                💛
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
