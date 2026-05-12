import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSessionToken, setCookieHeader } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        if (!username || !password)
            return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });

        const [user] = await db.select().from(users).where(eq(users.username, username));
        if (!user)
            return NextResponse.json({ error: 'Username tidak ditemukan.' }, { status: 401 });

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid)
            return NextResponse.json({ error: 'Password salah.' }, { status: 401 });

        const token = await createSessionToken({ userId: user.id, username: user.username, email: user.email });
        const res = NextResponse.json({ id: user.id, username: user.username, email: user.email });
        res.headers.set('Set-Cookie', setCookieHeader(token));
        return res;
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}
