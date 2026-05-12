// scripts/create-tables.ts — Buat tabel users & laporan_pdf langsung ke DB
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log('Creating tables...');

    await sql`
        CREATE TABLE IF NOT EXISTS "users" (
            "id" serial PRIMARY KEY NOT NULL,
            "username" varchar(100) NOT NULL UNIQUE,
            "email" varchar(200) NOT NULL UNIQUE,
            "password_hash" text NOT NULL,
            "created_at" timestamp DEFAULT now()
        )
    `;
    console.log('✓ users table created/exists');

    await sql`
        CREATE TABLE IF NOT EXISTS "laporan_pdf" (
            "id" serial PRIMARY KEY NOT NULL,
            "username" varchar(100) NOT NULL,
            "email" varchar(200) NOT NULL,
            "judul_laporan" text NOT NULL,
            "nama_file" text NOT NULL,
            "path_file" text NOT NULL,
            "tanggal_upload" timestamp DEFAULT now()
        )
    `;
    console.log('✓ laporan_pdf table created/exists');

    console.log('Done!');
}

main().catch((e) => { console.error(e); process.exit(1); });
