"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"

function JoinPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const [status, setStatus] = useState<'validating' | 'joining' | 'success' | 'error'>('validating')
    const [error, setError] = useState("")

    const handleJoin = async () => {
        setStatus('joining')
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: any = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch('/api/organizations/join', {
                method: 'POST',
                headers,
                body: JSON.stringify({ token })
            })

            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            } else {
                setStatus('error')
                setError(data.error || 'Failed to join organization')
            }
        } catch (err) {
            setStatus('error')
            setError('An error occurred. Please try again.')
        }
    }

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setError("No invite token provided.")
        } else {
            // Optional: Validate token validity before showing "Join" button?
            // For now, we just let them click Join.
            setStatus('validating') // Actually just 'ready'
        }
    }, [token])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-6">

                {status === 'validating' && (
                    <>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Join Organization</h1>
                        <p className="text-neutral-400">You have been invited to join a team on SessionOrbit.</p>
                        <Button
                            onClick={handleJoin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Accept & Join
                        </Button>
                    </>
                )}

                {status === 'joining' && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
                        <h2 className="text-xl font-bold text-white">Joining...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Success!</h2>
                        <p className="text-neutral-400">You are now a member of the organization.</p>
                        <p className="text-sm text-neutral-500">Redirecting to dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Unable to Join</h2>
                        <p className="text-red-400">{error}</p>
                        <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                            Go to Dashboard
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        }>
            <JoinPageContent />
        </Suspense>
    )
}
