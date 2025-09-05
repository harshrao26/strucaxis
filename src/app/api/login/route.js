import { NextResponse } from 'next/server';
 import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signToken(user);

  const response = NextResponse.json({ message: 'Logged in' });
  response.cookies.set('token', token, { httpOnly: true, path: '/' });

  return response;
}