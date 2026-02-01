"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, User } from "lucide-react"

interface Comment {
    id: string
    name: string
    content: string
    created_at: string
}

export default function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching comments:", error)
        } else {
            setComments(data || [])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (!name || !email || !content) {
            setError("All fields are required")
            setIsLoading(false)
            return
        }

        const { error } = await supabase
            .from("comments")
            .insert([
                {
                    post_id: postId,
                    name,
                    email,
                    content,
                },
            ])

        if (error) {
            console.error("Error submitting comment:", error)
            setError("Failed to submit comment. Please try again.")
        } else {
            setContent("")
            fetchComments() // Refresh comments
        }

        setIsLoading(false)
    }

    return (
        <div className="mt-16 border-t border-white/10 pt-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold mb-4">Leave a comment</h4>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-slate-900 border-white/10"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Email (will not be published)</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900 border-white/10"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <label className="text-sm text-slate-400">Comment</label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-slate-900 border-white/10 min-h-[100px]"
                        placeholder="Share your thoughts..."
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isLoading ? "Posting..." : "Post Comment"}
                </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.name}</span>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-slate-300">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    )
}
