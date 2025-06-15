import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  try {
    const { deviceId } = params;
    const { state } = await req.json();

    console.log(`Relay 2 control for ${deviceId}: ${state ? 'ON' : 'OFF'}`);

    // For now, just return success
    // In a real implementation, you'd need to communicate back to the ESP32
    return NextResponse.json({
      message: `Relay 2 ${state ? 'activated' : 'deactivated'}`,
      deviceId,
      relay: 2,
      state
    });

  } catch (error) {
    console.error('Relay 2 control error:', error);
    return NextResponse.json(
      { message: 'Failed to control relay 2' },
      { status: 500 }
    );
  }
}