import { cookies } from 'next/headers';
import { db } from './database';
import type { User } from './database';

// Simple session management
const SESSION_COOKIE = 'ideastream-session';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Get current user from session
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (!sessionId) return null;
    
    const user = db.users.findById(sessionId);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Set session cookie
export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear session
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Authentication functions
export async function signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
  // Check if user already exists
  const existingUser = db.users.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user (in a real app, you'd hash the password)
  const user = db.users.create({
    email,
    displayName,
    password, // store password
    photoURL: undefined,
  });
  
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const user = db.users.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  // Check password
  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export async function signOut(): Promise<void> {
  await clearSession();
}

export async function deleteAccount(userId: string): Promise<void> {
  // Delete user's ideas first
  db.ideas.deleteByUserId(userId);
  
  // Delete user
  const success = db.users.delete(userId);
  if (!success) {
    throw new Error('Failed to delete account');
  }
  
  await clearSession();
} 