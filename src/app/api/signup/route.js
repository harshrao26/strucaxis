import { NextResponse } from 'next/server';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Assumes your User model hashes password on save (pre('save') hook).
    const user = await User.create({ name, email, password });

    const token = signToken(user);

    const res = NextResponse.json(
      {
        message: 'Signed up',
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
      { status: 201 }
    );

    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}