import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ApprovalRequest from '@/lib/models/ApprovalRequest';
import Fundraiser from '@/lib/models/Fundraiser';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    const requests = await ApprovalRequest.find()
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { type, userId, userEmail, fundraiserId, amount, reason } = body;

    if (!type || !userId || !userEmail || !reason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'fundraiser' && !fundraiserId) {
      return NextResponse.json(
        { success: false, message: 'Fundraiser ID is required for fundraiser requests' },
        { status: 400 }
      );
    }

    if (type === 'wallet_topup' && (!amount || amount <= 0)) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required for wallet top-up requests' },
        { status: 400 }
      );
    }

    const requestDoc = new ApprovalRequest({
      type,
      userId,
      userEmail,
      fundraiserId,
      amount,
      reason
    });

    await requestDoc.save();

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      request: requestDoc
    });

  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
