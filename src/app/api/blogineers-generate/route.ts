import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// Generates a URL-friendly slug from a title
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '');        // Remove leading and trailing hyphens
}

// Generates a plain text excerpt from HTML content
function generateExcerpt(htmlContent: string) {
    // Basic HTML tag removal
    const text = htmlContent.replace(/<[^>]*>?/gm, '');
    if (text.length > 200) {
        return text.substring(0, 197) + '...';
    }
    return text;
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        const secret = process.env.BLOGINEERS_SECRET;

        // Verify server configuration
        if (!secret) {
            console.error("BLOGINEERS_SECRET is not set in environment variables");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        // Verify incoming request authorization
        if (authHeader !== `Bearer ${secret}`) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        let payload;
        try {
            payload = await req.json();
        } catch (e) {
            return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
        }

        // Validate required fields
        if (!payload.title || !payload.content) {
            return NextResponse.json({ success: false, error: "Missing required fields (title, content)" }, { status: 400 });
        }

        let slug = generateSlug(payload.title);
        const supabase = getSupabaseAdmin();

        // Check for existing slug to ensure uniqueness
        const { data: existingPost } = await supabase
            .from("posts")
            .select("id")
            .eq("slug", slug)
            .single();

        if (existingPost) {
            // Append a random 4-character string to make it unique
            slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
        }

        const excerpt = generateExcerpt(payload.content);
        const gradient = 'from-indigo-900/20 to-purple-900/20';

        // Map category ID to a string if necessary, default to "Article"
        let categoryName = "Article";
        if (payload.category_id === 3) {
            categoryName = "Architecture";
        } else if (payload.category_id) {
            categoryName = `Category ${payload.category_id}`;
        }

        const postData = {
            title: payload.title,
            slug: slug,
            content: payload.content,
            excerpt: excerpt,
            author: "Orbit Team", // default author
            category: categoryName,
            published_at: payload.created_at || new Date().toISOString(),
            gradient: gradient,
        };

        // Insert bypassing RLS using the admin client
        const { data, error } = await supabase
            .from("posts")
            .insert([postData])
            .select("id, slug")
            .single();

        if (error) {
            console.error("Error inserting post:", error);
            return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            slug: data.slug
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error processing Blogineers webhook:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
