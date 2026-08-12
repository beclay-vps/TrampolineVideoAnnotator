import { NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/video-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const filename = decodeURIComponent(params.filename);
    const info = getVideoInfo(filename);
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
