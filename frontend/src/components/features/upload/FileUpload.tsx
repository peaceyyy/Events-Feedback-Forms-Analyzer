// components/FileUpload.tsx 
'use client'
import { useState } from 'react'
import { 
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Analytics as AnalyticsIcon,
  Description as DescriptionIcon,
  Science as ScienceIcon
} from '@mui/icons-material'
import type { UploadResponse, UploadError } from '@/types/upload'

interface FileUploadProps {
  onUploadSuccess?: (results: UploadResponse, filename?: string) => void
  onUploadError?: (error: string) => void
  onReset?: () => void
  isMinimized?: boolean
}

/**
 * FileUpload Component - Handles file selection and upload to backend
 */
export default function FileUpload({ onUploadSuccess, onUploadError, onReset, isMinimized = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    // Clear any previous results when new file is selected
    if (onUploadError) onUploadError('')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      if (onUploadError) onUploadError('Please select a CSV file first')
      return
    }

    setIsUploading(true)
    // Clear any previous errors
    if (onUploadError) onUploadError('')

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Send to Next.js API route proxy (server-side validation + security)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Type-safe response parsing
      const result: UploadResponse | { success: false; error: UploadError } = await response.json()

      if (result.success && 'summary' in result) {
        // Conditional log for debugging the full API response
        if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
          console.log('FileUpload API Response:', result)
        }
        if (onUploadSuccess) onUploadSuccess(result, selectedFile?.name)
      } else if (!result.success && 'error' in result) {
        // Structured error with suggestion (type-safe access)
        const error = result.error
        const errorMsg = typeof error === 'object' && error.suggestion
          ? `${error.message}. ${error.suggestion}`
          : typeof error === 'object' 
            ? error.message 
            : error || 'Upload failed'
        if (onUploadError) onUploadError(errorMsg)
      } else {
        if (onUploadError) onUploadError('Upload failed')
      }
    } catch (err) {
      const errorMsg = 'Connection failed. Is the Flask server running?'
      console.error('Upload error:', err)
      if (onUploadError) onUploadError(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleQuickTest = async () => {
    setIsLoadingTest(true)
    // Clear any previous errors
    if (onUploadError) onUploadError('')

    try {
      // Call test endpoint via Next.js API proxy
      const response = await fetch('/api/test', {
        method: 'GET',
      })

      // Type-safe response parsing
      const result: UploadResponse | { success: false; error: UploadError } = await response.json()

      if (result.success && 'summary' in result) {
        // Conditional log for debugging
        if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
          console.log('Quick Test API Response:', result)
        }
        if (onUploadSuccess) onUploadSuccess(result, 'Test Data (feedback_forms-1.csv)')
      } else if (!result.success && 'error' in result) {
        const error = result.error
        const errorMsg = typeof error === 'object' && error.message
          ? error.message
          : typeof error === 'string' 
            ? error 
            : 'Quick test failed'
        if (onUploadError) onUploadError(errorMsg)
      } else {
        if (onUploadError) onUploadError('Quick test failed')
      }
    } catch (err) {
      const errorMsg = 'Connection failed. Is the Flask server running?'
      console.error('Quick test error:', err)
      if (onUploadError) onUploadError(errorMsg)
    } finally {
      setIsLoadingTest(false)
    }
  }

  return (
  
    <div className="w-full">
      {/* Main Upload Card with Minimize Animation */}
      <div className={`glass-card-dark rounded-3xl elevation-3 mb-8 transition-all duration-500 ease-out overflow-hidden ${
        isMinimized 
          ? 'p-4 h-20' 
          : 'p-9.5 h-auto mt-1' 
      }`}>
        
        {/* Header Section - Conditionally rendered based on state */}
        <div className={`text-center mb-6 transition-all duration-500 ease-out ${
          isMinimized 
            ? 'opacity-0 scale-95 transform -translate-y-4 pointer-events-none absolute inset-0' 
            : 'opacity-100 scale-100 transform translate-y-0 relative'
        }`}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
               style={{background: 'linear-gradient(135deg, var(--color-usc-green), var(--color-google-blue))'}}>
            <CloudUploadIcon sx={{ fontSize: 32, color: 'white' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{color: 'var(--color-text-primary)'}}>
            Upload Feedback Data
          </h2>
          <p className="text-sm mb-3" style={{color: 'var(--color-text-secondary)'}}>
            Upload your event feedback CSV to generate insights
          </p>
          
          {/* Quick Test Button - Prominent position */}
          <button
            onClick={handleQuickTest}
            disabled={isLoadingTest || isUploading}
            className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(63, 81, 181, 0.1))',
              border: '1.5px solid rgba(103, 58, 183, 0.3)',
            }}
          >
            {isLoadingTest ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                <span>Loading Test Data...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ScienceIcon sx={{ fontSize: 16 }} />
                <span>Quick Test with Sample Data</span>
              </div>
            )}
          </button>
        </div>

        {/* Minimized State Content */}
        <div className={`transition-all duration-700 ease-out delay-200 ${  
          isMinimized 
            ? 'opacity-100 scale-100 transform translate-y-0 flex items-center justify-between relative' 
            : 'opacity-0 scale-95 transform translate-y-4 pointer-events-none absolute inset-0'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircleIcon sx={{ fontSize: 24, color: 'var(--color-usc-green)' }} />
            <span className="font-medium text-lg" style={{color: 'var(--color-text-primary)'}}>
              Analysis Complete
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null) 
              onReset && onReset() 
            }}
            className="btn-google text-sm py-2 px-4 flex items-center gap-2"
          >
            <CloudUploadIcon sx={{ fontSize: 18 }} />
            Upload Another CSV
          </button>
        </div>

        {/* File Upload Area - Hidden when minimized */}
        <div className={`mb-6 transition-all duration-300 ease-out ${
          isMinimized 
            ? 'opacity-0 scale-95 transform -translate-y-4 pointer-events-none absolute inset-0' 
            : 'opacity-100 scale-100 transform translate-y-0 relative'
        }`}>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="block">
              <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                   style={{
                     borderColor: selectedFile ? 'var(--color-usc-green)' : 'var(--color-border-light)',
                     backgroundColor: selectedFile ? 'rgba(76, 175, 80, 0.05)' : 'transparent'
                   }}>
                <div className="mb-4">
                  {selectedFile ? (
                    <CheckCircleIcon sx={{ fontSize: 48, color: 'var(--color-usc-green)' }} />
                  ) : (
                    <DescriptionIcon sx={{ 
                      fontSize: 48, 
                      color: 'var(--color-text-tertiary)',
                      transition: 'color 0.3s'
                    }} className="group-hover:text-usc-green" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2" 
                    style={{color: selectedFile ? 'var(--color-usc-green)' : 'var(--color-text-primary)'}}>
                  {selectedFile ? 'File Ready for Analysis!' : 'Choose Your CSV File'}
                </h3>
                <p className="text-sm mb-3" style={{color: 'var(--color-text-secondary)'}}>
                  {selectedFile ? 'Click to select a different file' : 'Drag & drop your feedback CSV here or click to browse'}
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Supported: .csv files • Max size: 10MB
                </div>
              </div>
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-6 glass-card-dark p-6 rounded-xl flex items-center gap-4 elevation-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                   style={{background: 'var(--color-usc-green)'}}>
                <DescriptionIcon sx={{ fontSize: 24, color: 'white' }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg" style={{color: 'var(--color-text-primary)'}}>
                  {selectedFile.name}
                </p>
                <p className="text-base" style={{color: 'var(--color-text-secondary)'}}>
                  {(selectedFile.size / 1024).toFixed(1)} KB • CSV Format • Ready to process
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button - Hidden when minimized */}
        <div className={`transition-all duration-300 ease-out ${
          isMinimized 
            ? 'opacity-0 scale-95 transform -translate-y-4 pointer-events-none absolute inset-0' 
            : 'opacity-100 scale-100 transform translate-y-0 relative'
        }`}>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="btn-google w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Analyzing Data...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <AnalyticsIcon sx={{ fontSize: 24 }} />
                <span>Generate Insights</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}