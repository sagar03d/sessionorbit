"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"
import { nanoid } from "nanoid"
import MeetingHistory from "./MeetingHistory"

export default function DashboardPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isStartingClass, setIsStartingClass] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
            } else {
                setUser(user)
                // Fetch profile data
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setProfile(profile)
                setIsLoading(false)
            }
        }
        checkUser()
    }, [router])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

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

        router.push(`/${hostCode}`)
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-neutral-400">{user?.email}</span>
                        <button
                            onClick={handleSignOut}
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold mb-2">Welcome, {profile?.full_name || 'User'}!</h2>
                        <p className="text-neutral-400 mb-6">Successfully signed in to your account.</p>
                        <Button
                            onClick={startClass}
                            disabled={isStartingClass}
                            className="w-full bg-white text-black hover:bg-neutral-200 gap-2"
                        >
                            {isStartingClass ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            ) : (
                                <Video className="w-4 h-4" />
                            )}
                            {isStartingClass ? 'Starting...' : 'Start Online Class'}
                        </Button>
                    </div>

                    <MeetingHistory userId={user.id} />
                </div>
            </div>
        </div>
    )
}
