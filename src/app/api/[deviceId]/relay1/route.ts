import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  try {
    const { deviceId } = params;
    const { state } = await req.json();

    // Here you would typically:
    // 1. Validate the deviceId
    // 2. Send command to ESP32 via MQTT, WebSocket, or HTTP
    // 3. Update database with the command/state

    console.log(`Relay 1 control for ${deviceId}: ${state ? 'ON' : 'OFF'}`);

    // For now, just return success
    // In a real implementation, you'd need to communicate back to the ESP32
    return NextResponse.json({
      message: `Relay 1 ${state ? 'activated' : 'deactivated'}`,
      deviceId,
      relay: 1,
      state
    });

  } catch (error) {
    console.error('Relay 1 control error:', error);
    return NextResponse.json(
      { message: 'Failed to control relay 1' },
      { status: 500 }
    );
  }
}
