import { NextRequest, NextResponse } from 'next/server';
// Assuming your types are correctly defined in this path
import type { RelayControlRequest, RelayControlResponse } from '~/app/types/device'; 

/**
 * API route to control a specific relay for a device.
 * @param req The incoming Next.js request object.
 * @param params The dynamic route parameters, containing deviceId and relayId.
 * @returns A NextResponse object with the result of the relay control action.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { deviceId: string, relayId: string } }
): Promise<NextResponse<RelayControlResponse>> {
  const { deviceId, relayId } = params;

  // Validate that the relayId is one of the expected values
  if (relayId !== '1' && relayId !== '2') {
    return NextResponse.json(
      {
        success: false,
        deviceId,
        relay: relayId,
        newState: false, // Default state on error
        message: `Invalid relay ID '${relayId}'. Must be '1' or '2'.`,
      },
      { status: 400 } // Bad Request
    );
  }

  try {
    // Extract the desired state (true for ON, false for OFF) from the request body.
    const { state }: RelayControlRequest = await req.json();

    // Log the intended action for debugging purposes.
    console.log(`Control request for device '${deviceId}', relay '${relayId}': Set state to ${state ? 'ON' : 'OFF'}`);

    // --- Placeholder for Real Hardware Control Logic ---
    // In a real application, you would implement the logic to send this command
    // to the ESP32 here. This could be done via:
    // 1.  MQTT: Publish a message to a topic like `devices/${deviceId}/relay/${relayId}/set`.
    // 2.  Database Flag: Update a 'desired_state' field in a database that the ESP32 polls.
    // 3.  Direct HTTP Request (less common for ESP32 control from a server).
    // For now, we will just simulate a successful action.
    // ----------------------------------------------------

    // Return a success response confirming the action.
    return NextResponse.json({
      success: true,
      deviceId,
      relay: relayId,
      newState: state,
      message: `Relay ${relayId} on device ${deviceId} successfully set to ${state ? 'ON' : 'OFF'}.`,
    });

  } catch (error) {
    // Log the error for server-side debugging.
    console.error(`Error controlling relay ${relayId} for device ${deviceId}:`, error);

    // Return a generic 500 Internal Server Error response.
    return NextResponse.json(
      {
        success: false,
        deviceId: deviceId,
        relay: relayId,
        newState: false, // The state remains unchanged on error.
        message: `An internal error occurred while trying to control relay ${relayId}.`,
      },
      { status: 500 }
    );
  }
}
