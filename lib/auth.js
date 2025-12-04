import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function checkPassword(password) {
  return password === process.env.ADMIN_PASSWORD;
}

export async function createSession() {
  const session = {
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION
  };
  
  const sessionString = Buffer.from(JSON.stringify(session)).toString('base64');
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000
  });
  
  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    
    if (Date.now() > session.expiresAt) {
      await destroySession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    return { authenticated: false };
  }
  
  return { authenticated: true, session };
}