import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ApprovalRequest from '@/lib/models/ApprovalRequest';
import Fundraiser from '@/lib/models/Fundraiser';
import User from '@/lib/models/User';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const body = await request.json();
    const { action, adminEmail, rejectionReason } = body;

    if (!action || !adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Action and admin email are required' },
        { status: 400 }
      );
    }

    const requestDoc = await ApprovalRequest.findById(id);
    if (!requestDoc) {
      return NextResponse.json(
        { success: false, message: 'Request not found' },
        { status: 404 }
      );
    }

    if (requestDoc.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Request has already been processed' },
        { status: 400 }
      );
    }

    const now = new Date();

    if (action === 'approve') {
      requestDoc.status = 'approved';
      requestDoc.approvedAt = now;
      requestDoc.approvedBy = adminEmail;

      // Process the approval
      if (requestDoc.type === 'fundraiser') {
        const fundraiser = await Fundraiser.findById(requestDoc.fundraiserId);
        if (fundraiser) {
          fundraiser.status = 'active';
          await fundraiser.save();
        }
      } else if (requestDoc.type === 'wallet_topup') {
        const user = await User.findOne({ clerkId: requestDoc.userId });
        if (user) {
          user.walletBalance += requestDoc.amount;
          await user.save();
        }
      }

    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { success: false, message: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      requestDoc.status = 'rejected';
      requestDoc.rejectedAt = now;
      requestDoc.rejectedBy = adminEmail;
      requestDoc.rejectionReason = rejectionReason;

      // Handle rejected fundraisers
      if (requestDoc.type === 'fundraiser') {
        const fundraiser = await Fundraiser.findById(requestDoc.fundraiserId);
        if (fundraiser) {
          fundraiser.status = 'rejected';
          await fundraiser.save();
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    await requestDoc.save();

    return NextResponse.json({
      success: true,
      message: `Request ${action}ed successfully`,
      request: requestDoc
    });

  } catch (error) {
    console.error('Process request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
