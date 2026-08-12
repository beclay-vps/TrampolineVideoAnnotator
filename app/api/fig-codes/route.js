import { NextResponse } from 'next/server';
import { searchFigCodes } from '@/lib/fig-codes';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const codes = searchFigCodes(q);
  return NextResponse.json({ fig_codes: codes });
}
