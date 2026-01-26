import connectToDatabase from '@/lib/mongodb';
import Fundraiser from '@/lib/models/Fundraiser';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const creator = searchParams.get('creator');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    let query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (creator) {
      query.creator = creator;
    }

    const fundraisers = await Fundraiser.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Fundraiser.countDocuments(query);

    return NextResponse.json({ fundraisers, total });
  } catch (error) {
    console.error('Error fetching fundraisers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, description, goal, category, image, forWhom, creator } = body;

    // Validate required fields
    if (!title || !description || !goal || !category || !forWhom || !creator) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new fundraiser
    const fundraiser = new Fundraiser({
      title,
      description,
      goal,
      category,
      image,
      forWhom,
      creator,
    });

    await fundraiser.save();

    return NextResponse.json({ message: 'Fundraiser created successfully', fundraiser }, { status: 201 });
  } catch (error) {
    console.error('Error creating fundraiser:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}