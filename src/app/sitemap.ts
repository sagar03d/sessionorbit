import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.sessionorbit.com'

    // Static routes
    const routes = [
        '',
        '/about',
        '/features',
        '/pricing',
        '/blog',
        '/terms',
        '/privacy',
        '/security',
        '/developers',
        '/documentation',
        '/help',
        '/free-whiteboard',
        '/automate-tutoring-lesson-reports',
        '/lessonspace-vs-pencil-spaces-vs-sessionorbit',
        '/student-engagement-tracking-whiteboard',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic Blog Routes
    let blogRoutes: MetadataRoute.Sitemap = []

    try {
        const { data: posts } = await supabase
            .from('posts')
            .select('slug, published_at')
            .not('published_at', 'is', null)

        if (posts) {
            blogRoutes = posts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.published_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch (error) {
        console.error("Error fetching posts for sitemap:", error)
    }

    return [...routes, ...blogRoutes]
}
