import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { laporanPdf } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const data = await db.select().from(laporanPdf).orderBy(desc(laporanPdf.tanggalUpload));
        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Gagal mengambil data laporan.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Auth check
        const token = req.cookies.get(SESSION_COOKIE)?.value;
        const session = token ? await verifySessionToken(token) : null;
        if (!session) return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });

        const formData = await req.formData();
        const judulLaporan = formData.get('judulLaporan') as string;
        const file = formData.get('file') as File | null;

        if (!judulLaporan || !file)
            return NextResponse.json({ error: 'Judul dan file wajib diisi.' }, { status: 400 });

        if (!file.name.toLowerCase().endsWith('.pdf'))
            return NextResponse.json({ error: 'Hanya file PDF yang diizinkan.' }, { status: 400 });

        // Save file to public/uploads/
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `${timestamp}_${safeName}`;
        const filePath = path.join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, new Uint8Array(bytes));

        const [record] = await db.insert(laporanPdf).values({
            username: session.username,
            email: session.email,
            judulLaporan,
            namaFile: file.name,
            pathFile: `/uploads/${fileName}`,
        }).returning();

        return NextResponse.json(record, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Gagal mengupload laporan.' }, { status: 500 });
    }
}
