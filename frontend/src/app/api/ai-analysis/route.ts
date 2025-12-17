import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for generating comprehensive AI-powered insights.
 * Proxies requests to Python backend's Gemini service for sentiment,
 * theme extraction, and strategic insights generation.
 *
 * @param {NextRequest} request - Incoming request with feedback data and analysis
 * @returns {NextResponse} - AI-generated comprehensive insights or error response
 */
export async function POST(request: NextRequest) {
  // Get backend URL from environment (server-side only)
  const backendUrl = process.env.BACKEND_API_URL;
  
  // Fail fast if backend URL is not configured
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, error: 'BACKEND_API_URL not configured on server' },
      { status: 500 }
    );
  }

  try {
    // Parse the incoming data
    const body = await request.json();

    // Validate required fields
    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: data array required' },
        { status: 400 }
      );
    }

    const aiEndpoint = `${backendUrl}/api/ai-analysis`;

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
    console.error('AI Analysis API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while generating insights' },
      { status: 500 }
    );
  }
}
