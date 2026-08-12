import { NextResponse } from 'next/server';
import { getAnnotations, saveAnnotations } from '@/lib/video-service';

export async function GET(request, { params }) {
  try {
    const filename = decodeURIComponent(params.filename);
    const data = getAnnotations(filename);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const filename = decodeURIComponent(params.filename);
    const body = await request.json();
    const result = saveAnnotations(filename, body);
    return NextResponse.json({ success: true, status: 'ok', data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}
