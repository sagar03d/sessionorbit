
import { verifySession } from "@/lib/auth-manual";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ user: null });
    }

    const session = await verifySession(token);

    if (!session) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
}
