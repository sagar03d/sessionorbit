"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ArrowRight, Calendar, User } from "lucide-react"
import { format } from "date-fns"

interface BlogPost {
    slug: string
    title: string
    excerpt: string
    author: string
    published_at: string
    category: string
    gradient: string
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("published_at", { ascending: false })

        if (error) {
            console.error("Error fetching posts:", error)
        } else {
            setPosts(data || [])
        }
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                        Latest from <span className="text-indigo-400">Orbit</span>
                    </h1>
                    <p className="text-lg text-slate-400">
                        Insights, updates, and guides for the modern educator.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <article
                            key={index}
                            className="group flex flex-col bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all hover:-translate-y-1"
                        >
                            {/* Image Placeholder */}
                            <div className={`h-48 w-full bg-gradient-to-br ${post.gradient || 'from-indigo-900/20 to-purple-900/20'} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                                        {post.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                                            <User className="w-3 h-3" />
                                        </div>
                                        {post.author}
                                    </div>
                                    <Link href={`/blog/${post.slug}`} className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Read <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}

                    {posts.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
                            <p className="text-slate-400 text-lg">No posts published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
