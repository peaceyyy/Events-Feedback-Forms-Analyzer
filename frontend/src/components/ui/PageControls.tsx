'use client'

import type { FC } from 'react'
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material'

interface PageControlsProps {
  darkMode: boolean
  toggleDarkMode: () => void
  enableSpaceBackground: boolean
  toggleSpaceBackground: () => void
}


const PageControls: FC<PageControlsProps> = ({
  darkMode,
  toggleDarkMode,
  enableSpaceBackground,
  toggleSpaceBackground,
}) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        onClick={toggleDarkMode}
        aria-pressed={darkMode}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className="glass-card-dark p-3 rounded-full border-theme-light hover-theme-surface transition-all duration-300 backdrop-blur-md"
      >
        {darkMode ? (
          <Brightness7Icon sx={{ fontSize: 24, color: '#FFB74D' }} />
        ) : (
          <Brightness4Icon sx={{ fontSize: 24, color: '#4A5568' }} />
        )}
      </button>

      <button
        onClick={toggleSpaceBackground}
        aria-pressed={enableSpaceBackground}
        title={enableSpaceBackground ? 'Disable animated background' : 'Enable animated background'}
        className="glass-card-dark p-3 rounded-full border-theme-light hover-theme-surface transition-all duration-300 backdrop-blur-md"
      >
        <AutoAwesomeIcon sx={{ fontSize: 20, color: enableSpaceBackground ? '#FFB74D' : '#9CA3AF' }} />
      </button>
    </div>
  )
}

export default PageControls
