'use client'

import Image from 'next/image'
import type { FC } from 'react'

interface HeaderProps {
  darkMode: boolean
}

// Presentational header moved out of page.tsx to reduce noise and improve readability.
const Header: FC<HeaderProps> = ({ darkMode }) => {
  return (
    <header className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
        <span
          className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}
        >
          Event Insights
        </span>
        <br />
        <span
          className="bg-clip-text text-transparent font-extrabold"
          style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Generator
        </span>
      </h1>

      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 backdrop-blur-md border transition-all duration-300 ${
          darkMode ? 'bg-white/10 border-white/20' : 'bg-white/60 border-white/40'
        }`}
      >
        <Image src="/assets/GDG-logo.png" alt="Google Developer Groups Logo" width={24} height={24} />
        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Powered by Google Developer Groups - USC
        </span>
      </div>

      <p className={`text-xl max-w-3xl mx-auto mb-8 leading-relaxed transition-colors duration-500 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Transform your event feedback into actionable insights with
        AI-powered analysis
        <br />
        <span className={`text-base opacity-80 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Statistical analysis • NPS scoring • Clean visualizations!
        </span>
      </p>
    </header>
  )
}

export default Header
