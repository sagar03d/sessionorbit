"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { ExternalLink, Calendar, Clock, Loader2, Filter, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Meeting {
    id: string
    name: string
    host_code: string
    created_at: string
    ended_at?: string | null
}

const ITEMS_PER_PAGE = 10

export default function MeetingHistory({ userId }: { userId: string }) {
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    // Observer for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null)
    const lastMeetingElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [isLoading, hasMore])

    const fetchMeetings = useCallback(async (isNewSearch: boolean = false) => {
        setIsLoading(true)
        const currentPage = isNewSearch ? 0 : page
        const from = currentPage * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1

        let query = supabase
            .from('meetings')
            .select('*', { count: 'exact' })
            .eq('host_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (startDate) {
            query = query.gte('created_at', new Date(startDate).toISOString())
        }
        if (endDate) {
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            query = query.lte('created_at', end.toISOString())
        }

        const { data, error, count } = await query

        if (!error && data) {
            const currentTotal = isNewSearch ? data.length : meetings.length + data.length
            setHasMore(count ? currentTotal < count : data.length === ITEMS_PER_PAGE)
            setMeetings(prev => isNewSearch ? data : [...prev, ...data])
        }
        setIsLoading(false)
    }, [userId, page, startDate, endDate, meetings.length])

    // Handle filter/user resets
    useEffect(() => {
        setMeetings([])
        if (page !== 0) {
            setPage(0)
        } else {
            fetchMeetings(true)
        }
    }, [userId, startDate, endDate])

    // Handle page changes (infinite scroll)
    useEffect(() => {
        if (page > 0) {
            fetchMeetings(false)
        } else if (meetings.length === 0) {
            // Initial load case if page is 0
            fetchMeetings(true)
        }
    }, [page])

    const clearFilters = () => {
        setStartDate("")
        setEndDate("")
    }

    if (meetings.length === 0 && !isLoading && !startDate && !endDate) {
        return (
            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-2 text-white text-center">Meeting History</h2>
                <p className="text-neutral-400 text-center">No meetings found.</p>
            </div>
        )
    }

    return (
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-neutral-400" /> Meeting History
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-xs text-neutral-300 outline-none p-1"
                            placeholder="Start Date"
                        />
                        <span className="text-neutral-600">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-xs text-neutral-300 outline-none p-1"
                            placeholder="End Date"
                        />
                        {(startDate || endDate) && (
                            <button
                                onClick={clearFilters}
                                className="p-1 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 thin-scrollbar">
                {meetings.map((meeting, index) => {
                    const isLastElement = meetings.length === index + 1

                    // Logic for "Ended":
                    const isEnded = meeting.ended_at || (new Date(meeting.created_at).getTime() < Date.now() - 24 * 60 * 60 * 1000)

                    return (
                        <div
                            key={meeting.id}
                            ref={isLastElement ? lastMeetingElementRef : null}
                            className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-neutral-200">{meeting.name}</span>
                                <div className="flex flex-col gap-1 text-xs text-neutral-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>Started: {new Date(meeting.created_at).toLocaleDateString()} at {new Date(meeting.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    {meeting.ended_at && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            <span>Ended: {new Date(meeting.ended_at).toLocaleDateString()} at {new Date(meeting.ended_at).toLocaleTimeString()}</span>
                                        </div>
                                    )}
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
                                        href={`/room/${meeting.host_code}`}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
                                    >
                                        Join <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )
                })}

                {meetings.length === 0 && !isLoading && (
                    <p className="text-center text-neutral-500 py-8">No meetings found for the selected range.</p>
                )}

                {isLoading && (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                    </div>
                )}
            </div>
        </div>
    )
}
