import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Fundraiser from '@/lib/models/Fundraiser';
import User from '@/lib/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;
    const body = await request.json();
    const { amount, tip, donorId, donorEmail } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }

    if (!donorId || !donorEmail) {
      return NextResponse.json(
        { error: 'Donor information is required' },
        { status: 400 }
      );
    }

    // Find fundraiser
    const fundraiser = await Fundraiser.findById(id);
    if (!fundraiser) {
      return NextResponse.json(
        { error: 'Fundraiser not found' },
        { status: 404 }
      );
    }

    // Check if fundraiser is active
    if (fundraiser.status !== 'active') {
      return NextResponse.json(
        { error: 'Fundraiser is not active' },
        { status: 400 }
      );
    }

    // Update fundraiser raised amount
    fundraiser.raised += amount;
    await fundraiser.save();

    // Update donor's total donations
    const donor = await User.findOne({ clerkId: donorId });
    if (donor) {
      donor.totalDonations += amount;
      await donor.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Donation processed successfully',
      donation: {
        amount,
        tip,
        total: amount + tip,
        fundraiserId: id,
        donorEmail,
      },
      fundraiser: {
        id: fundraiser._id,
        title: fundraiser.title,
        raised: fundraiser.raised,
        goal: fundraiser.goal,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
