import { NextResponse } from 'next/server';
import { POOJA_SERVICES } from '@/data/poojas';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: POOJA_SERVICES.length,
    data: POOJA_SERVICES
  });
}
