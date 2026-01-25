"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock, ArrowRight } from "lucide-react"
import { nanoid } from "nanoid"
import MeetingHistory from "./MeetingHistory"
import SubscriptionCard from "./components/SubscriptionCard"

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isStartingClass, setIsStartingClass] = useState(false)
    const [usage, setUsage] = useState(0)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
            } else {
                setUser(user)
                // Fetch profile data
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                // Fetch subscription data as primary source for plan info
                const { data: subData } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .maybeSingle()

                const activeProfile = {
                    ...profileData,
                    plan: subData?.plan_name || profileData?.plan || 'Free',
                    plan_expiry: subData?.expiry_date || profileData?.plan_expiry
                }

                setProfile(activeProfile)

                // Fetch usage (meetings count this month)
                const startOfMonth = new Date()
                startOfMonth.setDate(1)
                startOfMonth.setHours(0, 0, 0, 0)

                const { count } = await supabase
                    .from('meetings')
                    .select('*', { count: 'exact', head: true })
                    .eq('host_id', user.id)
                    .gte('created_at', startOfMonth.toISOString())

                setUsage(count || 0)
                setIsLoading(false)
            }
        }
        checkUser()
    }, [router])

    const startClass = async () => {
        if (!user || isStartingClass) return
        setIsStartingClass(true)

        const hostCode = nanoid(12)
        const moderatorCode = nanoid(12)
        const participantCode = nanoid(12)

        const { data: meeting, error } = await supabase
            .from('meetings')
            .insert([
                {
                    host_id: user.id,
                    name: `${profile?.full_name || 'Guest'}'s Class`,
                    host_code: hostCode,
                    moderator_code: moderatorCode,
                    participant_code: participantCode,
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Error creating meeting:', error)
            alert('Failed to start class. Please try again.')
            setIsStartingClass(false)
            return
        }

        router.push(`/room/${hostCode}`)
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {greeting}, {profile?.full_name?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Ready to share your knowledge today?
                    </p>
                </div>

                {/* Hero / Action Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Action Card */}
                    <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-900/50 p-8 flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                System Operational
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-white">Start a New Live Session</h2>
                                <p className="text-neutral-400 max-w-md">
                                    Create a secure, high-quality video classroom instantly. Invite students and start teaching in seconds.
                                </p>
                            </div>

                            <Button
                                onClick={startClass}
                                disabled={isStartingClass}
                                size="lg"
                                className="bg-white text-black hover:bg-neutral-200 transition-all duration-200 rounded-full px-8 font-medium text-base shadow-lg shadow-white/5"
                            >
                                {isStartingClass ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent mr-2" />
                                ) : (
                                    <Video className="w-5 h-5 mr-2" />
                                )}
                                {isStartingClass ? 'Creating Room...' : 'Start Class Now'}
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats / Info Card */}
                    <div className="flex flex-col gap-8">
                        <SubscriptionCard
                            plan={profile?.plan || 'Free'}
                            expiry={profile?.plan_expiry}
                            usage={usage}
                            maxUsage={profile?.plan === 'Pro' ? 30 : profile?.plan === 'Squad' ? 150 : 3}
                        />

                        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 flex flex-col justify-center space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-400">Next Scheduled</p>
                                        <p className="font-medium text-white">No classes scheduled</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-neutral-800/50"></div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-400">Average Duration</p>
                                        <p className="font-medium text-white">45 minutes</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full rounded-xl border-neutral-700 hover:bg-neutral-800 hover:text-white group"
                                onClick={() => router.push('/dashboard/calendar')}
                            >
                                View Calendar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Recent Class History</h2>
                        <Button variant="link" className="text-neutral-400 hover:text-white">View all history</Button>
                    </div>
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 overflow-hidden">
                        <MeetingHistory userId={user?.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
