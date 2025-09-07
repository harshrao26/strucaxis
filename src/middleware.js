import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt-edge'; // ✅ use edge-compatible version

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = await verifyToken(token);

  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};