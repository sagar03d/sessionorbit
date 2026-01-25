"use client"

import { useEffect, useState, use } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Users, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MeetingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [meeting, setMeeting] = useState<any>(null)
    const [participants, setParticipants] = useState<any[]>([])
    const [transcriptions, setTranscriptions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Meeting
            const { data: meetingData, error: meetingError } = await supabase
                .from('meetings')
                .select('*')
                .eq('id', id)
                .single()

            if (meetingError) {
                console.error("Error fetching meeting:", meetingError)
                return
            }
            setMeeting(meetingData)

            // Fetch Participants
            const { data: partData } = await supabase
                .from('meeting_participants')
                .select('*')
                .eq('meeting_id', id)
                .order('joined_at', { ascending: true })

            setParticipants(partData || [])

            // Fetch Transcriptions
            const { data: transData } = await supabase
                .from('meeting_transcriptions')
                .select('*')
                .eq('meeting_id', id)
                .order('timestamp', { ascending: true })

            setTranscriptions(transData || [])

            setIsLoading(false)
        }

        fetchData()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!meeting) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
                <p>Meeting not found.</p>
            </div>
        )
    }

    // Calculate generic stats
    const totalDurationSeconds = meeting.ended_at
        ? (new Date(meeting.ended_at).getTime() - new Date(meeting.created_at).getTime()) / 1000
        : 0

    // Format helpers
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Button
                        variant="ghost"
                        className="pl-0 text-neutral-400 hover:text-white mb-4"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold">{meeting.name}</h1>
                            <div className="flex items-center gap-4 text-neutral-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(meeting.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date(meeting.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                        {meeting.ended_at && (
                            <div className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400">
                                Duration: {formatDuration(totalDurationSeconds)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Participants Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5" /> Participants
                            </h2>
                            <span className="text-sm text-neutral-400">{participants.length} total</span>
                        </div>

                        <div className="space-y-4">
                            {participants.map((p) => (
                                <div key={p.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-white">{p.name}</span>
                                        <span className="text-xs uppercase font-bold text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">{p.role}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-neutral-400">
                                            <span>Talk Time</span>
                                            <span>{formatDuration(p.talk_time_seconds || 0)}</span>
                                        </div>
                                        {/* Simple visualization of talk time contribution (relative to meeting duration approx) */}
                                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${Math.min(100, Math.max(2, ((p.talk_time_seconds || 0) / (totalDurationSeconds || 3600)) * 100))}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-neutral-800/50 flex justify-between text-xs text-neutral-500">
                                        <span>Joined: {new Date(p.joined_at).toLocaleTimeString()}</span>
                                        {p.left_at ? (
                                            <span>Left: {new Date(p.left_at).toLocaleTimeString()}</span>
                                        ) : (
                                            <span className="text-green-500">Active</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transcription Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Transcript
                            </h2>
                            <Button variant="outline" size="sm" className="h-8 text-xs">Download</Button>
                        </div>

                        <div className="min-h-[500px] max-h-[800px] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-6">
                            {transcriptions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-2 min-h-[200px]">
                                    <FileText className="w-8 h-8 opacity-20" />
                                    <p>No transcription available for this session.</p>
                                </div>
                            ) : (
                                transcriptions.map((t) => (
                                    <div key={t.id} className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                            {t.speaker_name[0]}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold text-sm text-neutral-300">{t.speaker_name}</span>
                                                <span className="text-xs text-neutral-600">{new Date(t.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-neutral-300 leading-relaxed text-sm">
                                                {t.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
