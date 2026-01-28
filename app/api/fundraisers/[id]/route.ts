import connectToDatabase from '@/lib/mongodb';
import Fundraiser from '@/lib/models/Fundraiser';
import PlatformWallet from '@/lib/models/PlatformWallet';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const fundraiser = await Fundraiser.findById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { amount, tipPercentage, tipAmount, totalAmount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
    }

    const { id } = await params;
    const fundraiser = await Fundraiser.findById(id);

    if (!fundraiser) {
      return NextResponse.json({ error: 'Fundraiser not found' }, { status: 404 });
    }

    // Update raised amount (only the base donation goes to fundraiser)
    fundraiser.raised += amount;

    // Check if goal is reached
    if (fundraiser.raised >= fundraiser.goal) {
      fundraiser.status = 'completed';
    }

    await fundraiser.save();

    // Add tip to platform wallet if there's a tip
    if (tipAmount && tipAmount > 0) {
      let platformWallet = await PlatformWallet.findOne();
      if (!platformWallet) {
        platformWallet = new PlatformWallet();
      }
      platformWallet.totalTips += tipAmount;
      platformWallet.totalDonations += amount;
      platformWallet.lastUpdated = new Date();
      await platformWallet.save();
    }

    return NextResponse.json({
      message: 'Donation successful',
      fundraiser,
      donation: {
        amount,
        tipPercentage: tipPercentage || 0,
        tipAmount: tipAmount || 0,
        totalAmount: totalAmount || amount,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error processing donation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}