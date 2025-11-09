// components/TabNavigationBar.tsx - Clean tabbed navigation component
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
      <div className="border-b border-theme-light mb-6">
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
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : `cursor-pointer ${
                        isActive 
                          ? 'border-usc-green' 
                          : 'border-transparent hover:border-usc-orange'
                      }`
                  }
                `}
                style={{
                  color: isDisabled 
                    ? 'var(--color-text-tertiary)' 
                    : isActive 
                      ? 'var(--color-usc-green)' 
                      : 'var(--color-text-secondary)'
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon && (
                  <span className={`mr-2 transition-colors duration-200 ${
                    isActive ? 'text-usc-green' : 'group-hover:text-usc-orange'
                  }`}
                  style={{
                    color: isActive ? 'var(--color-usc-green)' : 'var(--color-text-tertiary)'
                  }}>
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
          key={activeTab} 
          className="animate-fadeIn"
        >
          {activeTabContent}
        </div>
      </div>
    </div>
  )
}
