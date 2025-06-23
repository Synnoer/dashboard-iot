import { NextRequest, NextResponse } from 'next/server';
import type { RelayControlRequest, RelayControlResponse } from '~/app/types/device'; 

export async function POST(
  req: NextRequest,
  { params }: { params: { deviceId: string } }
): Promise<NextResponse<RelayControlResponse>> {
  try {
    const { deviceId } = params;
    const { state }: RelayControlRequest = await req.json();

    // Logging
    console.log(`Relay 1 control for ${deviceId}: ${state ? 'ON' : 'OFF'}`);

    // Dummy response - replace with real control logic
    return NextResponse.json({
      success: true,
      deviceId,
      relay: '1',
      newState: state,
      message: `Relay 1 ${state ? 'activated' : 'deactivated'}`,
    });
  } catch (error) {
    console.error('Relay 1 control error:', error);

    return NextResponse.json(
      {
        success: false,
        deviceId: params.deviceId,
        relay: '1',
        newState: false,
        message: 'Failed to control relay 1',
      },
      { status: 500 }
    );
  }
}
