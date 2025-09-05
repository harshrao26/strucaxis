import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_secret_change_me');

export async function POST(req) {
  const { email, password } = await req.json();

  // TODO: Replace with DB/user lookup
  const validEmail = process.env.ADMIN_EMAIL || 'admin@trygvestudio.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await new SignJWT({ sub: 'admin', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const res = NextResponse.json({ success: true });
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,  
  });
  return res;
}