
import { useState, useCallback } from 'react'
import type { UploadResponse, UploadError, UploadProgress } from '@/types/upload'

/**
 * Configuration options for the upload hook
 */
interface UseFileUploadOptions {
  onSuccess?: (result: UploadResponse, filename: string) => void
  onError?: (error: UploadError) => void
  onProgress?: (progress: UploadProgress) => void
}

/**
 * Return type for useFileUpload hook
 */
interface UseFileUploadReturn {
  upload: (file: File) => Promise<void>
  isUploading: boolean
  progress: UploadProgress | null
  error: UploadError | null
  reset: () => void
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { onSuccess, onError, onProgress } = options

  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<UploadError | null>(null)

  /**
   * Reset all state (errors, progress, loading state)
   */
  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(null)
    setError(null)
  }, [])


  const upload = useCallback(
    async (file: File) => {
      // Reset previous state
      setIsUploading(true)
      setError(null)
      setProgress({
        loaded: 0,
        total: file.size,
        percentage: 0,
        stage: 'uploading',
      })

      try {
        const formData = new FormData()
        formData.append('file', file)

    
        const xhr = new XMLHttpRequest()

        /**
         * Track upload progress (file being sent to server)
         * This event fires continuously as data is sent
         */
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progressData: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
              stage: 'uploading',
            }
            setProgress(progressData)
            onProgress?.(progressData)
          }
        })

        /**
         * Upload promise wrapper for async/await syntax
         * XMLHttpRequest is callback-based, so we wrap it in a Promise
         */
        const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
          /**
           * Handle successful response from server
           */
          xhr.addEventListener('load', () => {
            // Check HTTP status code
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                // Parse JSON response
                const response = JSON.parse(xhr.responseText)
                resolve(response)
              } catch (e) {
                // If JSON parsing fails, it's a validation error
                reject({
                  code: 'VALIDATION_ERROR',
                  message: 'Invalid response from server',
                  suggestion: 'The server returned malformed data. Please try again.',
                })
              }
            } else {
              // HTTP error status (4xx, 5xx)
              try {
                const errorResponse = JSON.parse(xhr.responseText)
                // Error response should have our structured error format
                reject(
                  errorResponse.error || {
                    code: 'SERVER_ERROR',
                    message: `Server error: ${xhr.status}`,
                  }
                )
              } catch (e) {
                // Fallback if error response isn't JSON
                reject({
                  code: 'SERVER_ERROR',
                  message: `Upload failed with status ${xhr.status}`,
                })
              }
            }
          })

          /**
           * Handle network errors
           * Fires when request can't complete (no network, CORS issue, etc.)
           */
          xhr.addEventListener('error', () => {
            reject({
              code: 'NETWORK_ERROR',
              message: 'Network error occurred during upload',
              suggestion: 'Please check your internet connection and try again.',
            })
          })

          /**
           * Handle user cancellation
           */
          xhr.addEventListener('abort', () => {
            reject({
              code: 'NETWORK_ERROR',
              message: 'Upload was cancelled',
            })
          })

          // Send the request
          xhr.open('POST', '/api/upload')
          xhr.send(formData)
        })

        // Transition to processing stage while server handles it
        setProgress({
          loaded: file.size,
          total: file.size,
          percentage: 100,
          stage: 'processing',
        })

        // Wait for server response
        const result = await uploadPromise

        // Mark as complete
        setProgress({
          loaded: file.size,
          total: file.size,
          percentage: 100,
          stage: 'complete',
        })

        // Callback on success
        onSuccess?.(result, file.name)
      } catch (err) {
        // Handle errors and convert to UploadError type
        const uploadError = err as UploadError
        setError(uploadError)
        onError?.(uploadError)
      } finally {
        // Always stop loading indicator
        setIsUploading(false)
      }
    },
    [onSuccess, onError, onProgress]
  )

  return {
    upload,
    isUploading,
    progress,
    error,
    reset,
  }
}
