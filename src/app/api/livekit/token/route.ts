import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");
    const identity = req.nextUrl.searchParams.get("identity");
    const avatarUrl = req.nextUrl.searchParams.get("avatarUrl");
    const role = req.nextUrl.searchParams.get("role") || "participant";

    if (!room) {
        return NextResponse.json(
            { error: 'Missing "room" query parameter' },
            { status: 400 }
        );
    } else if (!username) {
        return NextResponse.json(
            { error: 'Missing "username" query parameter' },
            { status: 400 }
        );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        return NextResponse.json(
            { error: "Server misconfigured" },
            { status: 500 }
        );
    }

    const at = new AccessToken(apiKey, apiSecret, {
        identity: identity || username,
        name: username,
        metadata: JSON.stringify({ role, avatarUrl: avatarUrl || undefined }),
    });

    const grants = {
        roomJoin: true,
        room: room,
        canPublish: true,
        canSubscribe: true,
    };

    // Role-based logic can be expanded here if needed
    // e.g., restricting participants from screen sharing or similar

    at.addGrant(grants);

    return NextResponse.json({ token: await at.toJwt() });
}
