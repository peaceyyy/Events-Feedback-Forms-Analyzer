// components/ScrollToTopButton.tsx - A reusable, performant scroll-to-top button
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'

/**
 * A button that appears after scrolling down the page and smoothly scrolls
 * the user back to the top.
 *
 * Best Practices Implemented:
 * 1.  **State Management:** Uses `useState` to track visibility based on scroll position.
 * 2.  **Lifecycle Management:** Uses `useEffect` to safely add and remove the window
 *     scroll event listener, preventing memory leaks.
 * 3.  **Performance (Throttling):** A simple `requestAnimationFrame` based throttle
 *     is used to prevent the scroll handler from firing too often and hurting performance.
 *     In a larger app, a library like `lodash.throttle` might be used.
 * 4.  **Accessibility:** The button has an `aria-label` for screen readers.
 * 5.  **Smooth Transitions:** Uses CSS transitions for a fade-in/out effect.
 */
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)

  const handleScroll = useCallback(() => {
    if (isThrottled) return

    setIsThrottled(true)
    requestAnimationFrame(() => {
      // Show button if scrolled more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      setIsThrottled(false)
    })
  }, [isThrottled])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    })
  }

  return (
    <button
      aria-label="Scroll to top"
      onClick={scrollToTop}
  
      className={`group fixed bottom-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        right: 'max(2rem, calc(50vw - 48rem - 4rem))',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-on-primary)'
      }}
    >
      <KeyboardArrowUpIcon />
    </button>
  )
}