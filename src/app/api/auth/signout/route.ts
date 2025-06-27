import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 