
import { getGoogleAuthURL } from "@/lib/auth-manual";
import { NextResponse } from "next/server";

export async function GET() {
    const url = getGoogleAuthURL();
    return NextResponse.redirect(url);
}
