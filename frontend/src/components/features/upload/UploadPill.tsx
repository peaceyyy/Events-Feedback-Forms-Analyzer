// components/UploadPill.tsx - Minimized upload status with re-upload option
'use client'
import React from 'react'
import { 
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

interface UploadPillProps {
  filename?: string
  onReUpload: () => void
  className?: string
}

/**
 * UploadPill - Compact upload status indicator with re-upload functionality
 * 
 * Design Philosophy:
 * • Minimal visual footprint to preserve dashboard space
 * • Clear success indicator with filename
 * • One-click re-upload for easy workflow
 * • Glass card aesthetic matching the overall design
 */
export default function UploadPill({ filename, onReUpload, className = '' }: UploadPillProps) {
  return (
    <div className={`glass-card-dark rounded-full p-3 flex items-center justify-between gap-4 border border-white/20 backdrop-blur-md ${className}`}>
      {/* Success Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckCircleIcon 
            sx={{ fontSize: 20, color: 'var(--color-usc-green)' }} 
          />
          <span className="text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>
            Analysis Complete
          </span>
        </div>
        
        {filename && (
          <>
            <div className="w-px h-4 bg-white/20" /> {/* Divider */}
            <span className="text-xs truncate max-w-32" style={{color: 'var(--color-text-secondary)'}}>
              {filename}
            </span>
          </>
        )}
      </div>

      {/* Re-upload Button */}
      <button
        onClick={onReUpload}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10 border border-white/20"
        style={{color: 'var(--color-text-secondary)'}}
      >
        <CloudUploadIcon sx={{ fontSize: 16 }} />
        <span>New Upload</span>
      </button>
    </div>
  )
}

/**
 * Sidebar Theory: Minimized Status Components
 * 
 * UX PRINCIPLES:
 * • Progressive disclosure: Show essential info, hide details
 * • Contextual actions: Keep primary action (re-upload) visible
 * • Visual hierarchy: Success state is prominent, actions are secondary
 * • Spatial efficiency: Horizontal layout maximizes space utilization
 * 
 * 📱 RESPONSIVE CONSIDERATIONS:
 * • Text truncation for long filenames on mobile
 * • Touch-friendly button sizing (minimum 44px target)
 * • Flexible layout that adapts to container width
 * 
 * 🎨 VISUAL DESIGN:
 * • Glass morphism for modern, lightweight appearance
 * • Consistent with overall brand aesthetic
 * • Subtle borders and backdrop blur for depth
 * • Smooth hover transitions for interactive feedback
 * 
 * ⚡ PERFORMANCE:
 * • Lightweight component with minimal re-renders
 * • CSS transitions over JavaScript animations
 * • Optimized for frequent visibility toggles
 */