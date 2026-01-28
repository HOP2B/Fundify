import connectToDatabase from '@/lib/mongodb';
import Fundraiser from '@/lib/models/Fundraiser';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const fundraiser = await Fundraiser.findById(params.id);

    if (!fundraiser) {
      return NextResponse.json({ error: 'Fundraiser not found' }, { status: 404 });
    }

    return NextResponse.json({ fundraiser });
  } catch (error) {
    console.error('Error fetching fundraiser:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
    }

    const fundraiser = await Fundraiser.findById(params.id);

    if (!fundraiser) {
      return NextResponse.json({ error: 'Fundraiser not found' }, { status: 404 });
    }

    // Update raised amount
    fundraiser.raised += amount;

    // Check if goal is reached
    if (fundraiser.raised >= fundraiser.goal) {
      fundraiser.status = 'completed';
    }

    await fundraiser.save();

    return NextResponse.json({
      message: 'Donation successful',
      fundraiser,
      donation: { amount, timestamp: new Date() }
    });
  } catch (error) {
    console.error('Error processing donation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}