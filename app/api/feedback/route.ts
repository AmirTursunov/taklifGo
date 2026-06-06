import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, userEmail, userName, rating, text } = data;

    if (!userId || !userEmail || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await DbService.createFeedback({
      userId,
      userEmail,
      userName: userName || 'Foydalanuvchi',
      rating,
      text: text || '',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
