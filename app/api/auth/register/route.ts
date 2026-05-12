import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, or } from 'drizzle-orm';
import { hashPassword, createSessionToken, setCookieHeader } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();
        if (!username || !email || !password)
            return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 });

        // Cek duplikat
        const existing = await db.select().from(users)
            .where(or(eq(users.username, username), eq(users.email, email)));
        if (existing.length > 0)
            return NextResponse.json({ error: 'Username atau email sudah terdaftar.' }, { status: 409 });

        const passwordHash = await hashPassword(password);
        const [newUser] = await db.insert(users).values({ username, email, passwordHash }).returning();

        const token = await createSessionToken({ userId: newUser.id, username: newUser.username, email: newUser.email });
        const res = NextResponse.json({ id: newUser.id, username: newUser.username, email: newUser.email }, { status: 201 });
        res.headers.set('Set-Cookie', setCookieHeader(token));
        return res;
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}
