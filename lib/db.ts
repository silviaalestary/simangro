import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

function createDb(): DbInstance {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    const sql = neon(url);
    return drizzle(sql, { schema });
}

// Lazy proxy — only creates real DB connection when actually used at runtime
let _instance: DbInstance | null = null;
export const db: DbInstance = new Proxy({} as DbInstance, {
    get(_target, prop) {
        if (!_instance) _instance = createDb();
        return (_instance as any)[prop];
    },
});

