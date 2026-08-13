import { NextResponse } from 'next/server';
import { getAllAnnotations } from '@/lib/video-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = getAllAnnotations();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
