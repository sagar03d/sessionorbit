
import { SignJWT, jwtVerify } from 'jose';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim();
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL?.trim();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');

export function getGoogleAuthURL() {
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is undefined in environment variables.");
    }
    if (!NEXT_PUBLIC_APP_URL) {
        throw new Error("NEXT_PUBLIC_APP_URL is undefined in environment variables.");
    }

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const qs = new URLSearchParams(options).toString();
    const fullUrl = `${rootUrl}?${qs}`;
    console.log("Generated Google Auth URL:", fullUrl); // Debugging
    return fullUrl;
}

interface GoogleTokensResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

export async function exchangeCodeForToken(code: string): Promise<GoogleTokensResult> {
    if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is missing");
    if (!GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is missing");
    if (!NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL is missing");

    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values).toString(),
    });

    if (!response.ok) {
        throw new Error(`Failed to exchange code: ${await response.text()}`);
    }

    return response.json();
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export async function getGoogleUser(id_token: string, access_token: string): Promise<GoogleUserResult> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get user info');
    }

    return response.json();
}

export interface SessionPayload {
    user: {
        id: string;
        email: string;
        name: string;
        picture: string;
    };
    [key: string]: any;
}

export async function createSession(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // 1 day session
        .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}
