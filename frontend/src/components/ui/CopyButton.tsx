// components/ui/CopyButton.tsx
'use client'
import { useState } from 'react'
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'small' | 'medium'
  onCopy?: () => void
}

export default function CopyButton({ 
  text, 
  label = 'Copy', 
  size = 'medium',
  onCopy 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const iconSize = size === 'small' ? 14 : 16
  const padding = size === 'small' ? 'px-2 py-1' : 'px-3 py-1.5'
  const fontSize = size === 'small' ? 'text-xs' : 'text-sm'

  return (
    <button
      onClick={handleCopy}
      className={`${padding} ${fontSize} rounded-lg transition-all inline-flex items-center gap-1.5 font-medium`}
      style={{
        backgroundColor: copied 
          ? 'rgba(76, 175, 80, 0.15)' 
          : 'rgba(66, 133, 244, 0.12)',
        color: copied 
          ? 'var(--color-usc-green)' 
          : 'var(--color-google-blue)',
        border: `1px solid ${copied ? 'rgba(76, 175, 80, 0.3)' : 'rgba(66, 133, 244, 0.2)'}`
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.12)'
        }
      }}
    >
      {copied ? (
        <>
          <CheckIcon sx={{ fontSize: iconSize }} />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon sx={{ fontSize: iconSize }} />
          {label}
        </>
      )}
    </button>
  )
}
