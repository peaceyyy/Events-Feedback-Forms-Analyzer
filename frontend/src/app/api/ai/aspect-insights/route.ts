// API route for aspect performance insights generation
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate aspect data payload
    if (!body.aspect_data) {
      return NextResponse.json(
        { success: false, error: 'No aspect data provided' },
        { status: 400 }
      );
    }

    // Forward request to Flask backend
    const response = await fetch(`${BACKEND_URL}/api/ai/aspect-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || 'Failed to generate aspect insights' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Aspect insights API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
