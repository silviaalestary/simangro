import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { species } from '@/lib/schema';
import { eq } from 'drizzle-orm';

function normalizeImagePaths(images: Record<string, string | null> | null) {
    if (!images) return images;
    const normalized: Record<string, string | null> = {};
    for (const [key, val] of Object.entries(images)) {
        normalized[key] = val ? val.replace(/\.(JPG|PNG|JPEG)$/i, (m) => m.toLowerCase()) : val;
    }
    return normalized;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const data = await db.select().from(species).where(eq(species.slug, slug));
        if (!data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const sp = data[0];
        return NextResponse.json({
            ...sp,
            images: normalizeImagePaths(sp.images as Record<string, string | null> | null),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch species' }, { status: 500 });
    }
}

