import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';

const SESSION_COOKIE = 'ideastream-session';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();
    
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }
    
    const user = await signUp(email, password, displayName);
    // Set session cookie in the response
    const response = NextResponse.json(user);
    response.cookies.set(SESSION_COOKIE, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error: any) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: error.message || 'Sign up failed' },
      { status: 400 }
    );
  }
} 