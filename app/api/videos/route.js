import { NextResponse } from 'next/server';
import { listVideos } from '@/lib/video-service';

export async function GET() {
  try {
    const videos = listVideos();
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
