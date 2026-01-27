
import { getGoogleAuthURL } from "@/lib/auth-manual";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const url = getGoogleAuthURL();
        return NextResponse.redirect(url);
    } catch (error: any) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
