// lib/auth.ts — Session & Password utilities (Web Crypto API, works in Edge + Node)

const DEFAULT_SECRET = 'simangro-kkp-secret-2025-change-me';

function getSecret(): string {
    return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

// ── Base64url helpers ────────────────────────────────────────────────────────
function b64uEncode(data: Uint8Array | string): string {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    let bin = '';
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64uDecode(str: string): Uint8Array {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
}

// ── Session Token ────────────────────────────────────────────────────────────
export interface SessionPayload {
    userId: number;
    username: string;
    email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
    const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    const encoded = b64uEncode(data);
    const key = await getHmacKey(getSecret());
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded) as any);
    const sig = b64uEncode(new Uint8Array(sigBuf));
    return `${encoded}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const [encoded, sig] = token.split('.');
        if (!encoded || !sig) return null;
        const key = await getHmacKey(getSecret());
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            b64uDecode(sig) as any,
            new TextEncoder().encode(encoded) as any,
        );
        if (!valid) return null;
        const parsed = JSON.parse(new TextDecoder().decode(b64uDecode(encoded)));
        if (parsed.exp < Date.now()) return null;
        return { userId: parsed.userId, username: parsed.username, email: parsed.email };
    } catch {
        return null;
    }
}

// ── Password Hashing (PBKDF2 via Web Crypto) ────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
    );
    const hashBuf = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        256,
    );
    const hashHex = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    try {
        const [saltHex, storedHash] = stored.split(':');
        if (!saltHex || !storedHash) return false;
        const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveBits'],
        );
        const hashBuf = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            256,
        );
        const hashHex = Array.from(new Uint8Array(hashBuf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return hashHex === storedHash;
    } catch {
        return false;
    }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
export const SESSION_COOKIE = 'simangro_session';

export function setCookieHeader(token: string): string {
    return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearCookieHeader(): string {
    return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
