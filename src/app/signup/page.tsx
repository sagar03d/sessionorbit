"use client"

import Link from "next/link"
import Image from "next/image"
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

export default function SignupPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/dashboard")
            }
        }
        checkSession()
    }, [router])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
                // Optionally redirect after a delay
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
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

    return (
        <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-black">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0">
                    <Image
                        src="/auth-bg.png"
                        alt="Authentication background"
                        fill
                        className="object-cover brightness-[0.4]"
                    />
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    SessionOrbit
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
                        </p>
                        <footer className="text-sm">B.B. King</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center min-h-screen lg:min-h-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <div className="flex flex-col space-y-2 text-center lg:hidden">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Create an account
                        </h1>
                        <p className="text-sm text-neutral-400">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <Card className="border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-white shadow-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                            <CardDescription className="text-neutral-400">
                                Enter your details below to create your account
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSignUp}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-900/50 border-red-900 text-red-200">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert className="bg-green-900/50 border-green-900 text-green-200">
                                        <AlertDescription>Registration successful! Please check your email for verification. Redirecting to login...</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-neutral-300">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        disabled={isLoading || success || isGoogleLoading}
                                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-neutral-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading || success || isGoogleLoading}
                                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-neutral-300">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading || success || isGoogleLoading}
                                        placeholder="••••••••"
                                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-white text-black hover:bg-neutral-200"
                                    size="lg"
                                    disabled={isLoading || success || isGoogleLoading}
                                >
                                    {isLoading ? "Creating Account..." : "Sign Up"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-neutral-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    type="button"
                                    disabled={isLoading || success || isGoogleLoading}
                                    onClick={() => handleOAuthSignIn('google')}
                                    className="w-full bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 hover:text-white"
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

                                <div className="text-center text-sm text-neutral-400">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-white hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                    <p className="px-8 text-center text-sm text-neutral-400">
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-white"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-white"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
