"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/app/components/Header"
import { supabase } from "@/lib/supabase"

function PaymentStatusContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

    // Dodo Payments usually passes status in params or redirects to specific URLs
    // For this implementation, we check the 'status' or 'checkout_status' param
    const checkoutStatus = searchParams.get("status") || searchParams.get("checkout_status")
    const paymentId = searchParams.get("payment_id") || searchParams.get("checkout_id")

    useEffect(() => {
        const activatePlan = async () => {
            const intendedPlan = localStorage.getItem('intended_plan')
            if (!intendedPlan) return

            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) return

            console.log(`Requesting secure activation for: ${intendedPlan}`)

            try {
                const response = await fetch('/api/activate-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        paymentId: paymentId || 'manual_return',
                        planName: intendedPlan
                    })
                })

                if (!response.ok) {
                    const err = await response.text()
                    throw new Error(err)
                }

                console.log('Plan activated successfully via backend')
            } catch (error) {
                console.error("Backend activation error:", error)
            } finally {
                localStorage.removeItem('intended_plan')
            }
        }

        if (checkoutStatus === "succeeded" || checkoutStatus === "success") {
            setStatus("success")
            activatePlan()
        } else if (checkoutStatus === "failed") {
            setStatus("failed")
            localStorage.removeItem('intended_plan')
        } else if (!checkoutStatus) {
            // Default to success if we reach here from a return URL and it's not explicitly failed
            const timer = setTimeout(() => {
                if (status === "loading") {
                    setStatus("success")
                    activatePlan()
                }
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [checkoutStatus, status, router])

    return (
        <div className="max-w-md w-full mx-auto">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    {status === "loading" && (
                        <>
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Verifying Transaction</h1>
                            <p className="text-neutral-400">Please wait while we confirm your orbital activation...</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-white">Orbit Activated!</h1>
                                <p className="text-neutral-400">Your plan has been successfully upgraded. Welcome to the next level of teaching.</p>
                            </div>
                            <div className="w-full pt-4 space-y-3">
                                <Button
                                    className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-6 rounded-xl"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Go to Mission Control <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-white">Transmission Interrupted</h1>
                                <p className="text-neutral-400">We couldn't process your payment. Your credits remain untouched in your original galaxy.</p>
                                {paymentId && (
                                    <p className="text-[10px] text-neutral-600 font-mono mt-2">ID: {paymentId}</p>
                                )}
                            </div>
                            <div className="w-full pt-4 space-y-3">
                                <Button
                                    className="w-full bg-neutral-800 text-white hover:bg-neutral-700 font-bold py-6 rounded-xl border border-neutral-700"
                                    onClick={() => router.push('/pricing')}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-neutral-400 hover:text-white"
                                    onClick={() => router.push('/')}
                                >
                                    <Home className="mr-2 w-4 h-4" /> Return Home
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-neutral-500 uppercase tracking-widest font-medium">
                Secure encryption enabled via SessionOrbit Node-7
            </p>
        </div>
    )
}

export default function PaymentStatusPage() {
    return (
        <div className="min-h-screen bg-[#0B0C15] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Header />

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px]" />
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="text-neutral-500 text-sm font-medium animate-pulse">Initializing Orbit...</p>
                </div>
            }>
                <PaymentStatusContent />
            </Suspense>
        </div>
    )
}
