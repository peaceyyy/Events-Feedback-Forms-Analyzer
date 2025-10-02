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
  onUploadSuccess?: (results: any) => void
  onUploadError?: (error: string) => void
}

/**
 * FileUpload Component - Handles file selection and upload to backend
 * Follows single responsibility principle - only manages file upload logic
 */
export default function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
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

      // Send to Flask backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        console.log('Processing successful:', result)
        if (onUploadSuccess) onUploadSuccess(result)
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
    <div className="max-w-4xl mx-auto">
      {/* Main Upload Card */}
      <div className="glass-card-dark p-10 rounded-3xl elevation-3 mb-8">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{background: 'linear-gradient(135deg, var(--color-usc-green), var(--color-google-blue))'}}>
            <CloudUploadIcon sx={{ fontSize: 40, color: 'white' }} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{color: 'var(--color-text-primary)'}}>
            Upload Feedback Data
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color: 'var(--color-text-secondary)'}}>
            Transform your event feedback CSV into comprehensive insights with AI-powered analysis
          </p>
        </div>

        {/* File Upload Area */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="block">
              <div className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                   style={{
                     borderColor: selectedFile ? 'var(--color-usc-green)' : 'var(--color-border-light)',
                     backgroundColor: selectedFile ? 'rgba(76, 175, 80, 0.05)' : 'transparent'
                   }}>
                <div className="mb-6">
                  {selectedFile ? (
                    <CheckCircleIcon sx={{ fontSize: 64, color: 'var(--color-usc-green)' }} />
                  ) : (
                    <DescriptionIcon sx={{ 
                      fontSize: 64, 
                      color: 'var(--color-text-tertiary)',
                      transition: 'color 0.3s'
                    }} className="group-hover:text-usc-green" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3" 
                    style={{color: selectedFile ? 'var(--color-usc-green)' : 'var(--color-text-primary)'}}>
                  {selectedFile ? 'File Ready for Analysis!' : 'Choose Your CSV File'}
                </h3>
                <p className="text-base mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  {selectedFile ? 'Click to select a different file' : 'Drag & drop your feedback CSV here or click to browse'}
                </p>
                <div className="text-sm" style={{color: 'var(--color-text-tertiary)'}}>
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

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="btn-google w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Processing Analytics...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <AnalyticsIcon sx={{ fontSize: 24 }} />
              <span>Generate AI Insights</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}