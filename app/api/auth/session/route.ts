import { NextResponse, NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json(null);
    const session = await verifySessionToken(token);
    return NextResponse.json(session);
}
