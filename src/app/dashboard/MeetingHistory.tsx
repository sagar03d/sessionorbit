"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ExternalLink, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface Meeting {
    id: string
    name: string
    host_code: string
    created_at: string
    ended_at?: string | null
}

export default function MeetingHistory({ userId }: { userId: string }) {
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMeetings = async () => {
            const { data, error } = await supabase
                .from('meetings')
                .select('*')
                .eq('host_id', userId)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setMeetings(data)
            }
            setIsLoading(false)
        }

        fetchMeetings()
    }, [userId])

    if (isLoading) {
        return <div className="animate-pulse h-48 bg-neutral-900/50 rounded-xl" />
    }

    if (meetings.length === 0) {
        return (
            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-2 text-white">Meeting History</h2>
                <p className="text-neutral-400">No meetings found.</p>
            </div>
        )
    }

    return (
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-neutral-400" /> Meeting History
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {meetings.map((meeting) => {
                    // Logic for "Ended":
                    // 1. If explicit 'ended_at' column exists and is not null (DB driven)
                    // 2. OR if created more than 24 hours ago (Heuristic, since we might not have ended_at logic yet)
                    const isEnded = meeting.ended_at || (new Date(meeting.created_at).getTime() < Date.now() - 24 * 60 * 60 * 1000)

                    return (
                        <div key={meeting.id} className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-neutral-200">{meeting.name}</span>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(meeting.created_at).toLocaleDateString()} at {new Date(meeting.created_at).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div>
                                {isEnded ? (
                                    <Link
                                        href={`/dashboard/meeting/${meeting.id}`}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-800/80 hover:text-white transition-colors"
                                    >
                                        View Details
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/room/${meeting.host_code}`} // Fixed link to use /dashboard/room if that's the path, wait, previous was `/${meeting.host_code}`? Let's check context.
                                        // The original code had `/${meeting.host_code}`. But the file structure is `src/app/room/[roomCode]`.
                                        // So it should be `/room/${meeting.host_code}`.
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
                                    >
                                        Join <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
