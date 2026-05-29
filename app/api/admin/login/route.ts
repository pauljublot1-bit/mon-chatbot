import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password: string };

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set('admin-session', 'authenticated', {
      httpOnly: true,
      path:     '/',
      maxAge:   60 * 60 * 24, // 24h
      sameSite: 'lax',
    });
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
