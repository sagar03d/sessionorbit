"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Comments from "@/components/blog/Comments"
import { format } from "date-fns"

interface BlogPost {
    id: string
    title: string
    content: string
    author: string
    category: string
    published_at: string
    gradient: string
}

export default function BlogDetailsPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [post, setPost] = useState<BlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchPost()
        }
    }, [slug])

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("slug", slug)
                .single()

            if (error) throw error
            setPost(data)
        } catch (error) {
            console.error("Error fetching post:", error)
            // router.push("/blog") // Optional: redirect to blog index on error
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0B0C15] flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                <Link href="/blog">
                    <Button variant="outline">Back to Blog</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-12">
            {/* Hero Header */}
            <div className={`relative py-20 mb-12 overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient || 'from-indigo-900/20 to-purple-900/20'} opacity-30`} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Articles
                    </Link>

                    <div className="flex gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-slate-300">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            5 min read
                        </div>
                    </div>
                </div>
            </div>

            {/* Content & Comments */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <article className="prose prose-invert prose-lg max-w-none mb-16">
                    {/* 
                      Note: In a real app we'd use a markdown parser like 'react-markdown'.
                      For now, we'll just display the raw text content with whitespace preserved.
                    */}
                    <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
                        {post.content}
                    </div>
                </article>

                <Comments postId={post.id} />
            </div>
        </div>
    )
}
