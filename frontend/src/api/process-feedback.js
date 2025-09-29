// Next.js API route for processing uploaded CSV files
// Place this in: pages/api/process-feedback.js or app/api/process-feedback/route.js (App Router)

import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { writeFile } from 'fs/promises'

// Configuration for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Limit file size to 10MB
    },
  },
}

// Handle file upload and processing
export async function POST(request: NextRequest) {
  try {
    // Parse the uploaded file
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to temporary location
    const tempPath = path.join(process.cwd(), 'temp', `upload_${Date.now()}.csv`)
    
    // Ensure temp directory exists
    const tempDir = path.dirname(tempPath)
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    await writeFile(tempPath, buffer)

    try {
      // Call Python processing script
      const result = await processCsvWithPython(tempPath)
      
      // Clean up temporary file
      fs.unlinkSync(tempPath)
      
      return NextResponse.json(result)
      
    } catch (processingError) {
      // Clean up file even if processing fails
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Processing failed',
          details: processingError.message 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// Function to call Python processing script
function processCsvWithPython(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Path to your Python script
    const pythonScript = path.join(process.cwd(), 'backend', 'processing', 'web_api.py')
    
    // Spawn Python process
    const python = spawn('python', [pythonScript, filePath])
    
    let output = ''
    let errorOutput = ''
    
    python.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output)
          resolve(result)
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`))
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${errorOutput}`))
      }
    })
    
    python.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`))
    })
  })
}

// Alternative: Direct HTTP endpoint for external calls
export async function GET() {
  return NextResponse.json({
    message: 'Feedback processing API',
    endpoints: {
      POST: '/api/process-feedback - Upload and process CSV file',
    },
    requirements: {
      fileType: 'CSV',
      maxSize: '10MB',
      contentType: 'multipart/form-data'
    }
  })
}