import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/lib/models/Admin';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, adminCode } = await request.json();

    if (!email || !adminCode) {
      return NextResponse.json(
        { success: false, message: 'Email and admin code are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ 
      email, 
      adminCode, 
      isActive: true 
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      admin: {
        email: admin.email,
        assignedBy: admin.assignedBy,
        assignedAt: admin.assignedAt
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
