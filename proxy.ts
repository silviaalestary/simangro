import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

const PROTECTED_PATHS = ['/laporan-analisis', '/monitoring-lapangan'];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (token) {
        const session = await verifySessionToken(token);
        if (session) return NextResponse.next();
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/laporan-analisis/:path*', '/monitoring-lapangan/:path*'],
};
