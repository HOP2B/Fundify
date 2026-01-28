import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { email, assignedBy } = await request.json();

    if (!email || !assignedBy) {
      return NextResponse.json(
        { success: false, message: 'Email and assignedBy are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Generate a unique admin code
    const adminCode = generateAdminCode();
    
    // Create new admin
    const admin = new Admin({
      email,
      adminCode,
      assignedBy
    });

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin code generated successfully',
      adminCode,
      admin: {
        email: admin.email,
        assignedBy: admin.assignedBy,
        assignedAt: admin.assignedAt
      }
    });

  } catch (error) {
    console.error('Generate admin code error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateAdminCode(): string {
  // Generate a 8-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
