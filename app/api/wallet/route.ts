import connectToDatabase from '@/lib/mongodb';
import PlatformWallet from '@/lib/models/PlatformWallet';
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