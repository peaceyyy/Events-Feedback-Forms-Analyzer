// components/Tabs.tsx - Clean tabbed navigation component
'use client'
import React, { useState } from 'react'

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

/**
 * Tabs Component - Clean, brand-consistent tabbed navigation
 * 
 * Design Principles:
 * • Clean minimal design that matches GDG aesthetic
 * • Smooth transitions with proper accessibility
 * • Support for icons and disabled states
 * • Responsive layout for mobile/desktop
 */
export default function Tabs({ tabs, defaultTab, onTabChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  // Update internal state when defaultTab prop changes (controlled component pattern)
  React.useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, activeTab])

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return
    
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-white/10 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            const isDisabled = tab.disabled
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                disabled={isDisabled}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'border-usc-green text-usc-green' 
                    : 'border-transparent hover:text-gray-300 hover:border-gray-300'
                  }
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer'
                  }
                `}
                style={{
                  borderBottomColor: isActive ? 'var(--color-usc-green)' : 'transparent',
                  color: isActive 
                    ? 'var(--color-usc-green)' 
                    : isDisabled 
                      ? 'var(--color-text-tertiary)' 
                      : 'var(--color-text-secondary)'
                }}
              >
                {tab.icon && (
                  <span className={`mr-2 transition-colors duration-200 ${
                    isActive ? 'text-usc-green' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {tab.icon}
                  </span>
                )}
                <span className="whitespace-nowrap">
                  {tab.label}
                </span>
                
                {/* Active indicator with smooth animation */}
                <div className={`
                  ml-2 w-2 h-2 rounded-full transition-all duration-300 transform
                  ${isActive 
                    ? 'bg-usc-green scale-100 opacity-100' 
                    : 'bg-transparent scale-0 opacity-0'
                  }
                `} />
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div 
          key={activeTab} // Force re-mount for smooth transitions
          className="animate-fadeIn"
        >
          {activeTabContent}
        </div>
      </div>
    </div>
  )
}

/**
 * Sidebar Theory: Tab Navigation Best Practices
 * 
 * 🎯 ACCESSIBILITY CONSIDERATIONS:
 * • Keyboard navigation support (arrow keys, tab, enter)
 * • ARIA roles and labels for screen readers
 * • Focus management and visual indicators
 * • Disabled state handling
 * 
 * 📱 RESPONSIVE DESIGN:
 * • Horizontal scroll on mobile when tabs overflow
 * • Touch-friendly tap targets (minimum 44px)
 * • Consistent spacing across breakpoints
 * 
 * 🎨 VISUAL HIERARCHY:
 * • Active state uses brand color (USC Green)
 * • Hover states provide clear feedback
 * • Smooth transitions enhance perceived performance
 * • Icon + text combination improves recognition
 * 
 * ⚡ PERFORMANCE OPTIMIZATION:
 * • Content lazy loading for heavy components
 * • Memoized tab content to prevent unnecessary re-renders
 * • CSS transitions over JavaScript animations
 * 
 * 🔧 INTEGRATION PATTERNS:
 * • Controlled component pattern with optional callback
 * • Flexible content rendering via render props
 * • Support for dynamic tab addition/removal
 * • State persistence across navigation
 */