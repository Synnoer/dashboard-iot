import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '~/lib/mongo';
import { Reading } from '~/lib/models/reading';

const VALID_API_KEY = process.env.DEVICE_SECRET || 'your_device_secret_key_here';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!apiKey || apiKey !== VALID_API_KEY) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid API key' }, 
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const body = await req.json();
    
    // Basic validation
    if (!body.deviceId) {
      return NextResponse.json(
        { message: 'Bad Request - deviceId is required' },
        { status: 400 }
      );
    }

    // Add timestamp if not provided
    const readingData = {
      ...body,
      receivedAt: new Date(),
      timestamp: body.timestamp || Date.now()
    };

    // Save to database
    const newReading = new Reading(readingData);
    await newReading.save();

    console.log('Reading saved:', readingData.deviceId, 'at', readingData.receivedAt);

    return NextResponse.json(
      { 
        message: 'Data saved successfully',
        deviceId: readingData.deviceId,
        timestamp: readingData.receivedAt
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Device API is running',
    timestamp: new Date().toISOString()
  });
}