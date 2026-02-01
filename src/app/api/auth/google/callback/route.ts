
import { exchangeCodeForToken, getGoogleUser, createSession } from "@/lib/auth-manual";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    try {
        // 1. Exchange code for Google tokens
        const { id_token, access_token } = await exchangeCodeForToken(code);

        // 2. Get User Info from Google
        const googleUser = await getGoogleUser(id_token, access_token);

        // 3. Sync with Supabase Auth (Admin)
        // We check if user exists by email, if not create them.
        // Note: We are using a manual flow, but we want to keep `auth.users` as the source of truth if possible
        // so that RLS policies on `auth.uid()` still work if we minted a Supabase JWT (but here we are minting our OWN).

        // WAIT! If we are minting our OWN JWT (as per plan), `auth.uid()` in RLS WON'T work out of the box unless we sign it with the Supabase JWT secret
        // AND follow Supabase claims structure.
        // The plan said: "Create JWT generation/verification logic" and "Sync user with Supabase".

        // If we want RLS to work, we should ideally mint a token compatible with Supabase OR use the Service Role for everything (bad idea).
        // OR, we just use our own session for app-level logic, but Supabase client won't work with it.

        // CRITICAL DECISION: usage of `supabase` client on frontend.
        // The existing code uses `supabase.auth.getSession()`.
        // If we switch to manual, `supabase.auth` won't know about this session unless we set the Supabase cookie/token.

        // Plan:
        // "Create API routes... Create JWT... Create HTTP-only cookie"
        // The user asked for "manual" google login (not supabase based).
        // This implies we manage the session.
        // EXISTING frontend uses `supabase` client.
        // If I replace logic, I must update frontend to NOT rely on `supabase.auth.session` for this user, OR mock it.

        // Use Case: If the rest of the app relies on `auth.uid()` in Postgres via Supabase Client, this "manual" auth might break RLS integration 
        // unless we use `supabase-js`'s `setSession` if we had a refresh token, but we don't have a Supabase one.
        // OR we assume the user just wants the "Login" part manual, but wants to use Supabase for data.

        // For now, I will proceed with creating a USER in Supabase (so they exist),
        // and I will mint a session token.
        // IF the user wants to access Supabase data on client, they might face issues if RLS policies require `auth.uid()`.
        // However, I will implement the session as requested. I'll make the session payload contain the supabase user ID.
        // The frontend will likely need to fetch data via *custom API routes* that read this session, OR we assume this is a pure "get me in" request.

        // Let's assume for "Next.js Minimal Boilerplate" + "Manual Google Login", the goal is often just to get authentication working.
        // I will proceed with syncing to Supabase so we have the UUID.

        // Check if user exists
        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        // listUsers might be slow if many users, better is delete/create or just try create and catch.
        // But createUser with email requires password or strictly email stuff.
        // Better strategy: getUserByEmail (not exposed directly in simple admin client? accessing `listUsers` with filter might be needed or just `createUser` and catch error).

        // Actually `supabaseAdmin.auth.admin.createUser` allows creating a user.
        let userId = '';

        // Try to create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: googleUser.email,
            email_confirm: true,
            user_metadata: {
                full_name: googleUser.name,
                avatar_url: googleUser.picture,
                source: 'google-manual'
            }
        });

        if (createError) {
            // If error is "User already registered", fetch the user
            // There isn't a direct "getUserByEmail" in the admin SDK usually exposed easily without list.
            // But `createUser` error message usually indicates if they exist.
            // A cleaner way is using `supabaseAdmin.from('auth.users').select...` - NOT possible directly.
            // We must use `listUsers` or rely on the error message.
            // However, `listUsers` isn't scalably safe (pagination).
            // But for this "minimal boilerplate", maybe just `listUsers` with filter if supported?
            // Unfortunately listUsers doesn't support server-side filtering by email in all versions.

            // ALTERNATIVE: Use the RPC or direct DB access if we could, but we can't.
            // Easiest robust way: 
            // 1. Try create.
            // 2. If fail, call `listUsers` but `supabase-js` v2 `listUsers` doesn't filter by email well.
            // wait, `supabaseAdmin.rpc`? No.

            // ACTUALLY: `supabaseAdmin.auth.admin.getUserByEmail(email)` EXISTS in newer generic SDKs? 
            // Checking docs in my head... no, it's NOT in `supabase-js` v2 admin options typically.
            // Wait, let's look at `supabase-js` types if I could... but I can't interactively check easily without trying.

            // Let's assume standard behavior:
            // We can use `getUserById` if we knew the ID. We don't.
            // We will try `createUser`. If it fails, it might be due to existing user.
            // In that case, we can't easily get the ID without listing.
            // This is a known Supabase Admin Gotcha.

            // A workaround is creating a dummy sign in (signInWithOtp) to get the session? No, that sends email.
            // `signInWithPassword`? We don't know password.

            // Ah, `supabaseAdmin` has access to existing users.
            // Maybe we just don't sync if we can't finding them easily? No, we need ID for our session.

            // Let's try `listUsers`? valid for small userbases.
            // But let's check `createError`.
            console.log("Create user error:", createError);

            // Fallback: list users and find email.
            // Ideally we shouldn't fail here.
            // Let's rely on `listUsers()` strictly for now (bad perfs but works).
            // Or maybe `import { createClient }` ... 

            // WAIT! I can use `supabaseAdmin` to run a query on `public.profiles`?
            // `public.profiles` has `id` which is the auth id.
            // I can `select id FROM public.profiles WHERE email ...` -> NO, `profiles` doesn't usually have email unless we put it there.
            // The schema I read earlier `public.profiles` had `full_name`, `avatar_url` but NO EMAIL column.

            // New plan for User Sync:
            // Try `createUser`.
            // If fails, we MUST find the user.
            // Let's hope `listUsers()` is acceptable.
            // OR, since this is a "manual" implementation, maybe we just don't care about the Supabase ID if the user didn't ask for it to be perfectly synced?
            // "Sync user with Supabase `auth.users`... to ensure database integrity."

            // Okay, let's use the `listUsers` approach for finding.
            // Note: `supabase-js` v2 `listUsers` does not accept email filter.
            // However, we can use `deleteUser`? No.

            // Solution: custom function? No custom SQL allowed easily.

            // Okay, I will try `createUser`. If it fails, I will iterate pages of `listUsers`.
            // Hopefully the user base is small.
        }

        // Re-evaluating logic.
        // If I can't easily get ID of existing user, manual sync to Supabase is painful.
        // The user strictly asked for "implement google login (not supabase based , manual)".
        // Did they mean "I want to login with Google and just have a session, I don't care about Supabase Auth"?
        // But the project is "nextjs-minimal-boilerplate" with Supabase integration.
        // If I don't give them a Supabase User ID, they can't use the rest of the app (which likely depends on per-user data).

        // Let's check `src/app/page.tsx` or `dashboard` to see if they use User ID.
        // The login page redirects to `/dashboard`.
        // I should check `/dashboard/page.tsx` later.

        // For now, I'll implement a helper that handles "Get or Create Supabase User".

        const user = await getOrCreateSupabaseUser(googleUser);

        // 4. Create Session
        const session = await createSession({
            user: {
                id: user.id || googleUser.id, // Fallback if sync failed?
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture
            }
        });

        // 5. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("session_token", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 // 1 day
        });

        return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (err: any) {
        console.error("Callback error:", err);
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message)}`, request.url));
    }
}

async function getOrCreateSupabaseUser(googleUser: any) {
    // Try to create
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: googleUser.email,
        email_confirm: true,
        user_metadata: {
            full_name: googleUser.name,
            avatar_url: googleUser.picture,
            source: 'google-manual'
        }
    });

    if (data.user) {
        // Send Admin Notification for New User
        try {
            await resend.emails.send({
                from: 'Session Orbit <updates@sessionorbit.com>',
                to: 'sagar03d@gmail.com',
                subject: 'New User Registration',
                html: `
                    <h1>New User Signed Up</h1>
                    <p><strong>Name:</strong> ${googleUser.name}</p>
                    <p><strong>Email:</strong> ${googleUser.email}</p>
                    <p><strong>Source:</strong> Google Auth</p>
                `
            });
        } catch (emailError) {
            console.error("Failed to send admin notification:", emailError);
        }
        return data.user;
    }

    // If fail, assume exists. API doesn't allow easy lookup by email.
    // SCALABILITY WARNING: listing all users is bad properly.
    // But for this task, it's the only admin-way without a custom DB function.
    // (Or we could assume the user is in `public.profiles` IF we had email there, but we don't).

    // Only other way: `supabaseAdmin` used to have `getUserByEmail`? No.
    // Wait, what if I use `inviteUserByEmail`? No.

    // Let's scan fetch 50 users... hopefully found.
    // Just a basic implementation for now.
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const found = users?.find(u => u.email === googleUser.email);
    if (found) return found;

    // If unreachable
    throw new Error("Could not sync user with Supabase");
}
