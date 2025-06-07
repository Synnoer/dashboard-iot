import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '~/lib/jwt';
import { connectDB } from '~/lib/mongo';
import { Reading } from '~/lib/models/reading';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
    // Check if token is provided
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await verifyToken(token);
    await connectDB();

    const body = await req.json();

    const newReading = new Reading(body);
    await newReading.save();

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Invalid data or token' }, { status: 400 });
  }
}
