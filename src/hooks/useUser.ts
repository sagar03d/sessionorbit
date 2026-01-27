
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [usage, setUsage] = useState(0)
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
                            setUsage(stats.usage)
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
        // ... (Existing logic moved here or kept in component? 
        // Better to keep simple: This hook just returns user/profile/usage)

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

        const { count } = await supabase
            .from('meetings')
            .select('*', { count: 'exact', head: true })
            .eq('host_id', user.id)
            .gte('created_at', startOfMonth.toISOString())

        setUsage(count || 0)
    }

    const signOut = async () => {
        setIsLoading(true)
        // Try global sign out
        await supabase.auth.signOut()
        // Also clear manual cookie (requires API endpoint or simple cookie deletion?)
        // Since cookie is HttpOnly, we need an API endpoint to delete it.
        // We haven't created one yet!
        // I will assume for now we just redirect to login and let the next auth check fail? 
        // NO, cookie persists.
        // I NEED `/api/auth/signout`.
        await fetch('/api/auth/signout', { method: 'POST' });

        router.push('/login')
        router.refresh()
    }

    return { user, profile, usage, isLoading, signOut }
}
