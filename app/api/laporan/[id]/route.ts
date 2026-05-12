import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { laporanPdf } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get(SESSION_COOKIE)?.value;
        const session = token ? await verifySessionToken(token) : null;
        if (!session) return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });

        const { id } = await params;
        const [record] = await db.select().from(laporanPdf).where(eq(laporanPdf.id, Number(id)));
        if (!record) return NextResponse.json({ error: 'Data tidak ditemukan.' }, { status: 404 });

        // Hapus file dari disk
        try {
            const filePath = path.join(process.cwd(), 'public', record.pathFile);
            await unlink(filePath);
        } catch {
            // File mungkin sudah tidak ada, lanjut saja
        }

        await db.delete(laporanPdf).where(eq(laporanPdf.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Gagal menghapus laporan.' }, { status: 500 });
    }
}
