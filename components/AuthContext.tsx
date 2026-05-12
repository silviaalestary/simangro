'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User { userId: number; username: string; email: string; }
interface AuthCtx {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<string | null>;
    register: (username: string, email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
    user: null, loading: true,
    login: async () => null,
    register: async () => null,
    logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/session')
            .then((r) => r.json())
            .then((d) => { setUser(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const login = async (username: string, password: string): Promise<string | null> => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.error || 'Login gagal.';
        setUser(data);
        return null;
    };

    const register = async (username: string, email: string, password: string): Promise<string | null> => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) return data.error || 'Registrasi gagal.';
        setUser(data);
        return null;
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
