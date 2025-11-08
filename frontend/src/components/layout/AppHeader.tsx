/**
 * AppHeader - Static hero section
 */

import Image from 'next/image'

export default function AppHeader() {
  return (
    <header className="text-center mb-1">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
        <span className="text-text-primary transition-colors duration-500">
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

      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 glass-card-dark border border-white/20">
        <Image 
          src="/assets/GDG-logo.png" 
          alt="Google Developer Groups Logo" 
          width={24} 
          height={24} 
        />
        <span className="font-medium text-text-secondary">
          Powered by Google Developer Groups - USC
        </span>
      </div>

      <p className="text-xl max-w-3xl mx-auto leading-relaxed text-text-secondary">
        Transform your event feedback into actionable insights with AI-powered analysis
        <br />
        <span className="text-base opacity-80 text-text-tertiary">
          Statistical analysis • NPS scoring • Clean visualizations!
        </span>
      </p>
    </header>
  )
}
