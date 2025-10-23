import { NextRequest, NextResponse } from 'next/server';
import type { UploadResponse, UploadError } from '@/types/upload';

/**
 * API Route for handling file uploads with comprehensive validation.
 * Acts as a secure proxy to the Flask backend with:
 * - Server-side file validation (type, size, content)
 * - Structured error responses with recovery suggestions
 * - Backend URL hiding (security)
 * 
 * @param {NextRequest} request The incoming request object from the client.
 * @returns {NextResponse} Typed response with analysis data or structured error.
 */

// Configuration constants
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['text/csv', 'application/vnd.ms-excel'];

export async function POST(request: NextRequest) {
  try {
    // Step 1: Extract and validate form data
    const formData = await request.formData();
    const file = formData.get('file');

    // Step 2: Server-side validation - File existence
    if (!file || !(file instanceof File)) {
      const error: UploadError = {
        code: 'INVALID_FILE_TYPE',
        message: 'No file uploaded',
        suggestion: 'Please select a .csv file to upload',
      };
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: 400 }
      );
    }

    // Step 3: Server-side validation - File type
    const isCSV = file.name.toLowerCase().endsWith('.csv') || 
                  ALLOWED_MIME_TYPES.includes(file.type);
    
    if (!isCSV) {
      const error: UploadError = {
        code: 'INVALID_FILE_TYPE',
        message: 'Invalid file type',
        suggestion: 'Only .csv files are supported. Please convert your data to CSV format.',
        details: `Received: ${file.type || 'unknown type'}`,
      };
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: 400 }
      );
    }

    // Step 4: Server-side validation - File size
    if (file.size > MAX_FILE_SIZE) {
      const error: UploadError = {
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        suggestion: 'Please reduce your dataset size or split it into multiple files.',
        details: `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: 400 }
      );
    }

    // Step 5: Server-side validation - Empty file check
    if (file.size === 0) {
      const error: UploadError = {
        code: 'EMPTY_FILE',
        message: 'Uploaded file is empty',
        suggestion: 'Please check your CSV file contains data.',
      };
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: 400 }
      );
    }

    // Step 6: Forward validated file to Flask backend (server-side only)
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendResponse = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    // Step 7: Handle backend errors with structured responses
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      
      const error: UploadError = {
        code: 'SERVER_ERROR',
        message: errorData.message || errorData.error || 'Backend processing failed',
        suggestion: 'Please check your CSV format and try again. Ensure headers match the expected format (satisfaction, recommendation_score, sessions_attended).',
        details: `Status: ${backendResponse.status}`,
      };
      
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: backendResponse.status }
      );
    }

    // Step 8: Parse and validate backend response structure
    const data: UploadResponse = await backendResponse.json();
    
    // Additional response validation
    if (!data.summary || typeof data.summary.total_responses !== 'number') {
      const error: UploadError = {
        code: 'VALIDATION_ERROR',
        message: 'Invalid response from backend',
        suggestion: 'The uploaded file may not contain valid feedback data. Please verify your CSV structure.',
      };
      return NextResponse.json<{ success: false; error: UploadError }>(
        { success: false, error },
        { status: 500 }
      );
    }

    // Step 9: Return typed success response
    return NextResponse.json<UploadResponse>(data, { status: 200 });

  } catch (error) {
    // Step 10: Catch network/unexpected errors
    console.error('Upload API route error:', error);
    
    const uploadError: UploadError = {
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Network error occurred',
      suggestion: 'Please check your internet connection and verify the backend server is running.',
    };
    
    return NextResponse.json<{ success: false; error: UploadError }>(
      { success: false, error: uploadError },
      { status: 500 }
    );
  }
}