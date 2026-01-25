"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Star, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeedbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const meetingId = searchParams.get('meeting_id')
    const participantId = searchParams.get('participant_id')

    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [feedbackText, setFeedbackText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [meetingName, setMeetingName] = useState("")

    useEffect(() => {
        if (meetingId) {
            supabase
                .from('meetings')
                .select('name')
                .eq('id', meetingId)
                .single()
                .then(({ data }) => {
                    if (data) setMeetingName(data.name)
                })
        }
    }, [meetingId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!meetingId || rating === 0) {
            return
        }

        setIsSubmitting(true)

        const { error } = await supabase
            .from('meeting_feedback')
            .insert({
                meeting_id: meetingId,
                participant_id: participantId || null,
                rating,
                feedback_text: feedbackText || null
            })

        if (error) {
            console.error("Failed to submit feedback:", error)
            alert("Failed to submit feedback. Please try again.")
            setIsSubmitting(false)
            return
        }

        // Redirect to dashboard or home
        router.push('/dashboard')
    }

    const handleSkip = () => {
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">How was your experience?</h1>
                    {meetingName && (
                        <p className="text-neutral-400 text-lg">{meetingName}</p>
                    )}
                </div>

                {/* Feedback Form */}
                <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                    {/* Rating */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-300">
                            Rate your experience
                        </label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-12 h-12 transition-colors ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-neutral-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback Text */}
                    <div className="space-y-2">
                        <label htmlFor="feedback" className="block text-sm font-medium text-neutral-300">
                            Tell us more (optional)
                        </label>
                        <textarea
                            id="feedback"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What did you like? What could be improved?"
                            rows={5}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </div>
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSkip}
                            variant="outline"
                            className="px-6 rounded-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        >
                            Skip
                        </Button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-neutral-500 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
