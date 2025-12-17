// Next.js API route proxy for quick test data loading
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

export async function GET() {
  // Fail fast if backend URL is not configured
  if (!BACKEND_URL) {
    return NextResponse.json(
      { success: false, error: 'BACKEND_API_URL not configured on server' },
      { status: 500 }
    );
  }

  try {
    // Forward request to Flask backend test endpoint
    const response = await fetch(`${BACKEND_URL}/api/test`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Test data loading failed',
          message: errorData.message || 'Could not load sample CSV from test_data folder',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Test API route error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Network error',
        message: error instanceof Error ? error.message : 'Failed to connect to backend',
      },
      { status: 500 }
    );
  }
}
