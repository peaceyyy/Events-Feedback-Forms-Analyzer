import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for generating AI-powered session performance insights.
 * Proxies requests to Python backend's Gemini service.
 *
 * @param {NextRequest} request - Incoming request with session data
 * @returns {NextResponse} - AI-generated insights or error response
 */
export async function POST(request: NextRequest) {
  // Get backend URL from environment
  const backendUrl = process.env.BACKEND_API_URL?.replace('/upload', '');
  
  // Fail fast if backend URL is not configured
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, error: 'BACKEND_API_URL not configured on server' },
      { status: 500 }
    );
  }

  try {
    // Parse the incoming session data
    const body = await request.json();

    // Validate required fields
    if (!body.session_data || !Array.isArray(body.session_data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: session_data array required' },
        { status: 400 }
      );
    }

    const aiEndpoint = `${backendUrl}/api/ai/session-insights`;

    // Forward request to Python backend
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    // Handle backend errors
    if (!response.ok) {
      console.error('Backend AI Error:', result);
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate AI insights' },
        { status: response.status }
      );
    }

    // Return AI-generated insights
    return NextResponse.json(result);

  } catch (error) {
    console.error('Session Insights API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while generating insights' },
      { status: 500 }
    );
  }
}
