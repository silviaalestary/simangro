import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { species } from '@/lib/schema';

function normalizeImagePaths(images: Record<string, string | null> | null) {
    if (!images) return images;
    const normalized: Record<string, string | null> = {};
    for (const [key, val] of Object.entries(images)) {
        normalized[key] = val ? val.replace(/\.(JPG|PNG|JPEG)$/i, (m) => m.toLowerCase()) : val;
    }
    return normalized;
}

export async function GET() {
    try {
        const data = await db.select().from(species).orderBy(species.name);
        const normalized = data.map(s => ({
            ...s,
            images: normalizeImagePaths(s.images as Record<string, string | null> | null),
        }));
        return NextResponse.json(normalized);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch species' }, { status: 500 });
    }
}

