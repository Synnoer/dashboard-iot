import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// We keep the imports commented out to easily switch back later
// import { Reading } from '~/lib/models/reading';
// import { DeviceControl } from '~/lib/models/control';
// import { connectDB } from '~/lib/mongo';

const VALID_API_KEY = process.env.DEVICE_SECRET || 'your_device_secret_key_here';

const readingPayloadSchema = z.object({
  sensor_id: z.string().min(1, 'sensor_id cannot be empty.'),
  timestamp: z.number(),
  pir1_status: z.number().min(0).max(1),
  pir2_status: z.number().min(0).max(1),
  relay1_status: z.number().min(0).max(1),
  relay2_status: z.number().min(0).max(1),
  voltage: z.number().nullable(),
  current: z.number().nullable(),
  power: z.number().nullable(),
  energy: z.number().nullable(),
});

/**
 * @description Handles POST requests. In this test version, it validates the data
 * but does NOT save it to the database. It always returns a success response.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (still good practice)
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== VALID_API_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // <<< DATABASE CONNECTION DISABLED FOR TESTING >>>
    // await connectDB();

    // 2. Parse and Validate
    const body = await req.json();
    const validation = readingPayloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Bad Request', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // <<< SAVING TO DATABASE DISABLED FOR TESTING >>>
    // const newReading = new Reading(validation.data);
    // await newReading.save();
    console.log('TEST MODE: Received reading from:', validation.data.sensor_id, '(not saved)');

    // <<< HALT CHECK DISABLED, ALWAYS RETURN `halt: false` >>>
    // const control = await DeviceControl.findOne({ deviceId: validation.data.sensor_id });
    // const shouldHalt = control ? control.halt : false;
    const shouldHalt = false;

    // 3. Respond to the device
    return NextResponse.json(
      { 
        message: 'Data received (test mode)',
        deviceId: validation.data.sensor_id,
        halt: shouldHalt, 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error in POST /devices/status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}

/**
 * @description Handles GET requests. In this test version, it does NOT query the database.
 * It returns a static, hardcoded JSON object for the frontend to display.
 */
export async function GET() {
  console.log("GET /api/devices/status endpoint hit (DATABASE DISABLED).");
  try {
    // <<< DATABASE CONNECTION DISABLED FOR TESTING >>>
    // await connectDB();
    
    // <<< DATABASE QUERY DISABLED, USING MOCK DATA INSTEAD >>>
    /*
    const latestReadings = await Reading.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$sensor_id', latestReading: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$latestReading' } }
    ]);
    */

    // Create a hardcoded data object that looks like a real database response.
    const mockLatestReadings = [
      {
        _id: "mock_id_12345",
        sensor_id: "ESP32 Selasar",
        timestamp: Date.now() - 5000, // 5 seconds ago
        pir1_status: 1,
        pir2_status: 0,
        relay1_status: 1,
        relay2_status: 0,
        voltage: 225.5,
        current: 0.48,
        power: 58.2,
        energy: 12.34,
        createdAt: new Date().toISOString(),
      }
    ];
    
    console.log(`Returning mock data for ${mockLatestReadings.length} device(s).`);
    return NextResponse.json({ success: true, data: mockLatestReadings }, { status: 200 });

  } catch (error) {
    console.error('API Error in GET /devices/status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}