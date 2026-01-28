import connectToDatabase from '@/lib/mongodb';
import PlatformWallet from '@/lib/models/PlatformWallet';
import ApprovalRequest from '@/lib/models/ApprovalRequest';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    let wallet = await PlatformWallet.findOne();
    if (!wallet) {
      wallet = new PlatformWallet();
      await wallet.save();
    }

    return NextResponse.json({ wallet });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { userId, userEmail, amount, reason } = body;

    // Validate required fields
    if (!userId || !userEmail || !amount || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    // Get user details
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create approval request for wallet top-up
    const approvalRequest = new ApprovalRequest({
      type: 'wallet_topup',
      userId,
      userEmail,
      amount,
      reason,
    });

    await approvalRequest.save();

    return NextResponse.json({ 
      message: 'Wallet top-up request submitted for approval', 
      approvalRequest 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating wallet top-up request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}