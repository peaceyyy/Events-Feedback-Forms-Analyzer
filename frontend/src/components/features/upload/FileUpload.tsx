// components/FileUpload.tsx - Modular file upload component
'use client'
import { useState } from 'react'
import { 
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Analytics as AnalyticsIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'

interface FileUploadProps {
  onUploadSuccess?: (results: any, filename?: string) => void
  onUploadError?: (error: string) => void
  onReset?: () => void
  isMinimized?: boolean
}

/**
 * FileUpload Component - Handles file selection and upload to backend
 * Follows single responsibility principle - only manages file upload logic
 */
export default function FileUpload({ onUploadSuccess, onUploadError, onReset, isMinimized = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

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

      console.log('Starting file upload process...')
      console.log('Selected file:', selectedFile.name, selectedFile.size, 'bytes')

      // Send to Flask backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('=== FETCH RESPONSE ===')
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      console.log('Response ok:', response.ok)

      const result = await response.json()
      console.log('=== RAW RESULT ===')
      console.log('Raw result:', result)

      if (result.success) {
        console.log('=== FLASK RESPONSE SUCCESS ===')
        console.log('Full result:', result)
        console.log('Result keys:', Object.keys(result))
        console.log('NPS data:', result.nps)
        console.log('Sessions data:', result.sessions) 
        console.log('Ratings data:', result.ratings)
        console.log('Summary data:', result.summary)
        console.log('=== END FLASK RESPONSE ===')
        if (onUploadSuccess) onUploadSuccess(result, selectedFile?.name)
      } else {
        const errorMsg = result.error || 'Upload failed'
        if (onUploadError) onUploadError(errorMsg)
      }
    } catch (err) {
      const errorMsg = 'Connection failed. Is the Flask server running?'
      console.error('Upload error:', err)
      if (onUploadError) onUploadError(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    // THE FIX: Re-introduce a max-width and center the component to make it more compact.
    // UPDATE: Removing max-width and mx-auto to allow the component to fill its grid container naturally.
    <div className="w-full">
      {/* Main Upload Card with Minimize Animation */}
      <div className={`glass-card-dark rounded-3xl elevation-3 mb-8 transition-all duration-500 ease-out overflow-hidden ${
        isMinimized 
          ? 'p-4 h-20' 
          : 'p-9.5 h-auto mt-1' // Full state with auto height - reduced padding for compact layout
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
          <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
            Upload your event feedback CSV to generate insights
          </p>
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
              setSelectedFile(null) // Clear file selection
              onReset && onReset() // Call parent reset function
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