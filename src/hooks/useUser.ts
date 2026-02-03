
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [usage, setUsage] = useState({ hours: 0, reports: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initUser = async () => {
            try {
                // 1. Try Supabase Auth
                const { data: { user: sbUser } } = await supabase.auth.getUser()

                if (sbUser) {
                    setUser(sbUser)
                    await fetchSupabaseData(sbUser)
                } else {
                    // 2. Try Manual Auth API
                    const res = await fetch('/api/auth/me')
                    const data = await res.json()

                    if (data.user) {
                        setUser(data.user)
                        // Fetch profile/stats via API proxy
                        const statsRes = await fetch('/api/dashboard/stats')
                        if (statsRes.ok) {
                            const stats = await statsRes.json()
                            setProfile(stats.profile)
                            setUsage(stats.usage || { hours: 0, reports: 0 })
                        }
                    } else {
                        // No user found
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error("Auth check failed", error)
            } finally {
                setIsLoading(false)
            }
        }

        initUser()
    }, [])

    const fetchSupabaseData = async (user: any) => {
        // Fetch profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        // Fetch subscription
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

        // Fetch usage
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        // 1. Get Meetings for Hours
        const { data: meetings } = await supabase
            .from('meetings')
            .select('id, duration_minutes')
            .eq('host_id', user.id)
            .gte('created_at', startOfMonth.toISOString())

        const totalMinutes = meetings?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) || 0
        const hoursUsed = totalMinutes / 60

        // 2. Get Reports Count
        // We need to count summaries for these meetings.
        // If we can't join easily with RLS, we map IDs.
        const meetingIds = meetings?.map(m => m.id) || []

        let reportsCount = 0
        if (meetingIds.length > 0) {
            const { count } = await supabase
                .from('meeting_summaries')
                .select('*', { count: 'exact', head: true })
                .in('meeting_id', meetingIds)

            reportsCount = count || 0
        }

        setUsage({ hours: hoursUsed, reports: reportsCount })
    }

    const signOut = async () => {
        setIsLoading(true)
        await supabase.auth.signOut()
        await fetch('/api/auth/signout', { method: 'POST' });
        router.push('/login')
        router.refresh()
    }

    return { user, profile, usage, isLoading, signOut }
}
