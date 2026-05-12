import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { monitoringLapangan } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const [updated] = await db.update(monitoringLapangan)
            .set({
                lokasi: body.lokasi,
                kabupaten: body.kabupaten ?? null,
                provinsi: body.provinsi ?? null,
                tahun: body.tahun ? Number(body.tahun) : null,
                survivalRate: body.survivalRate ? Number(body.survivalRate) : null,
                kerapatan: body.kerapatan ? Number(body.kerapatan) : null,
                tinggiTanaman: body.tinggiTanaman ? Number(body.tinggiTanaman) : null,
                fotoUrl: body.fotoUrl ?? null,
                status: body.status ?? null,
                catatan: body.catatan ?? null,
            })
            .where(eq(monitoringLapangan.id, Number(id)))
            .returning();
        if (!updated) return NextResponse.json({ error: 'Data tidak ditemukan.' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Gagal mengupdate data.' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.delete(monitoringLapangan).where(eq(monitoringLapangan.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Gagal menghapus data.' }, { status: 500 });
    }
}
