// components/UploadPill.tsx - Upload status with re-upload option
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

