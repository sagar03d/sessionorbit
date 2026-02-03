"use client"

import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Gift, CheckCircle, Users, TrendingUp } from "lucide-react"

export default function ReferralPage() {
    const { profile, isLoading } = useUser()
    const [copied, setCopied] = useState(false)

    // In a real app, this would be the actual domain
    // const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sessionorbit.com'
    const baseUrl = 'https://sessionorbit.com'
    const referralLink = profile?.id ? `${baseUrl}/signup?ref=${profile.id}` : 'Loading...'

    const handleCopy = () => {
        if (!profile?.id) return
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) {
        return <div className="p-8 text-neutral-400">Loading referral data...</div>
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Refer & Earn</h1>
                <p className="text-neutral-400">Invite friends and colleagues to SessionOrbit and unlock exclusive rewards.</p>
            </div>

            {/* Main Referral Card */}
            <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border-indigo-500/20">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Gift className="w-6 h-6 text-indigo-400" />
                        </div>
                        <CardTitle className="text-xl text-white">Your Unique Referral Link</CardTitle>
                    </div>
                    <CardDescription className="text-neutral-400">
                        Share this link with your network. When they sign up, you'll both get 1 month of Pro features for free!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-black/40 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-300 font-mono text-sm truncate">
                            {referralLink}
                        </div>
                        <Button
                            onClick={handleCopy}
                            className={copied ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900/50 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-2xl font-bold text-white">0</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">People joined via your link</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/50 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-2xl font-bold text-white">0</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Signups in progress</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900/50 border-neutral-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Rewards Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-2xl font-bold text-white">$0</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Total credit earned</p>
                    </CardContent>
                </Card>
            </div>

            {/* How it works */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-4">1</div>
                        <h4 className="text-white font-medium mb-2">Share your link</h4>
                        <p className="text-sm text-neutral-400">Copy your unique referral link and share it with friends via email or social media.</p>
                    </div>
                    <div className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-4">2</div>
                        <h4 className="text-white font-medium mb-2">They sign up</h4>
                        <p className="text-sm text-neutral-400">When your friends sign up using your link, they instantly get a 14-day free trial of Pro.</p>
                    </div>
                    <div className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-4">3</div>
                        <h4 className="text-white font-medium mb-2">You earn rewards</h4>
                        <p className="text-sm text-neutral-400">For every active user you refer, you get 1 month of free Pro access.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
