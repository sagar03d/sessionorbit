"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Sparkles, Mic, Wifi, Eye, Clock, Zap, BarChart, Users, Calendar, BookOpen } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [magicLinkSent, setMagicLinkSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/dashboard")
            }
        }
        checkSession()
    }, [router])

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setMagicLinkSent(false)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleMagicLinkSignIn = async () => {
        if (!email) {
            setError("Please enter your email first.")
            return
        }
        setIsMagicLinkLoading(true)
        setError(null)
        setMagicLinkSent(false)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                setError(error.message)
            } else {
                setMagicLinkSent(true)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsMagicLinkLoading(false)
        }
    }

    const handleOAuthSignIn = async (provider: 'google') => {
        setIsGoogleLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
            setIsGoogleLoading(false)
        }
    }

    const features = [
        {
            icon: BarChart,
            title: "Advanced Analytics",
            description: "Deep dive into student performance metrics",
            bgClass: "bg-purple-500/10",
            iconClass: "text-purple-400"
        },
        {
            icon: Users,
            title: "Class Management",
            description: "Effortless attendance and grouping tools",
            bgClass: "bg-pink-500/10",
            iconClass: "text-pink-400"
        },
        {
            icon: Calendar,
            title: "Smart Scheduling",
            description: "Automated conflict resolution & reminders",
            bgClass: "bg-cyan-500/10",
            iconClass: "text-cyan-400"
        },
        {
            icon: BookOpen,
            title: "Resource Library",
            description: "Share and discover lesson materials",
            bgClass: "bg-orange-500/10",
            iconClass: "text-orange-400"
        }
    ]

    const benefits = [
        "Automated grading assistance",
        "Parent-teacher communication tools",
        "Customizable curriculum builder",
        "Secure document storage"
    ]

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Features Showcase */}
                    <div className="hidden lg:block space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Teaching Reimagined</h2>
                            <p className="text-xl text-slate-400">Powerful tools to enhance your virtual classroom</p>
                        </div>

                        <div className="grid gap-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
                                        <div className={`w-12 h-12 rounded-xl ${feature.bgClass} flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-6 h-6 ${feature.iconClass}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                                            <p className="text-sm text-slate-400">{feature.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-purple-400" />
                                <h3 className="font-semibold">Pro Features Included</h3>
                            </div>
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-pink-400 shrink-0" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-center gap-8 mb-4">
                                <div>
                                    <div className="text-3xl font-bold text-purple-400">Active</div>
                                    <div className="text-sm text-slate-400">Community</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-pink-400">24/7</div>
                                    <div className="text-sm text-slate-400">Support</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-cyan-400">Global</div>
                                    <div className="text-sm text-slate-400">Reach</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md space-y-6">
                            <div className="text-center lg:text-left">
                                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                                <p className="text-slate-400">Sign in to continue teaching</p>
                            </div>

                            <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl text-white shadow-2xl">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Enter your credentials to access your account
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={handleSignIn}>
                                    <CardContent className="space-y-4">
                                        {error && (
                                            <Alert variant="destructive" className="bg-red-900/50 border-red-900 text-red-200">
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}
                                        {magicLinkSent && (
                                            <Alert className="bg-green-900/50 border-green-900 text-green-200">
                                                <AlertDescription>Magic link sent! Check your email to sign in.</AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={isLoading || isMagicLinkLoading || isGoogleLoading}
                                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-sm font-medium text-slate-400 hover:text-white hover:underline transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={isLoading || isMagicLinkLoading || isGoogleLoading}
                                                placeholder="••••••••"
                                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                            size="lg"
                                            disabled={isLoading || isMagicLinkLoading || isGoogleLoading}
                                        >
                                            {isLoading ? "Signing In..." : "Sign In"}
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-slate-700" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                variant="outline"
                                                type="button"
                                                disabled={isLoading || isMagicLinkLoading || isGoogleLoading}
                                                onClick={() => handleOAuthSignIn('google')}
                                                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
                                            >
                                                {isGoogleLoading ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                                ) : (
                                                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                                    </svg>
                                                )}
                                                Google
                                            </Button>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                disabled={isLoading || isMagicLinkLoading || isGoogleLoading}
                                                onClick={handleMagicLinkSignIn}
                                                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
                                            >
                                                {isMagicLinkLoading ? "Sending..." : "Magic Link"}
                                            </Button>
                                        </div>

                                        <div className="text-center text-sm text-slate-400">
                                            Don&apos;t have an account?{" "}
                                            <Link
                                                href="/signup"
                                                className="font-medium text-white hover:underline"
                                            >
                                                Sign up
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </form>
                            </Card>
                            <p className="text-center text-xs text-slate-500">
                                By signing in, you agree to our{" "}
                                <Link href="/terms" className="underline hover:text-white">Terms</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
