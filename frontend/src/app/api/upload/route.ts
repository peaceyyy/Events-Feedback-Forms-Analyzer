import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for handling file uploads.
 * This route acts as a proxy to the Python backend, providing a secure and scalable interface.
 *
 * @param {NextRequest} request The incoming request object from the client.
 * @returns {NextResponse} The response from the backend, or an error response.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get the form data from the incoming request
    const formData = await request.formData();
    const file = formData.get('file');

    // 2. Validate that a file was actually uploaded
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found in request' }, { status: 400 });
    }

    // 3. Securely get the backend URL from environment variables
    // This prevents hardcoding URLs and keeps sensitive information out of the source code.
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000/api/upload';

    // 4. Reconstruct the FormData to forward it to the backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // 5. Make the request to the Python backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
    });

    // 6. Parse the JSON response from the backend
    const result = await response.json();

    // 7. Check if the backend request was successful
    if (!response.ok) {
      // If the backend returned an error, forward it to the client
      return NextResponse.json({ success: false, error: result.error || 'Backend API error' }, { status: response.status });
    }

    // 8. If successful, return the backend's response to the client
    return NextResponse.json(result);

  } catch (error) {
    // 9. Catch any unexpected errors during the proxy process
    console.error('API Proxy Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}