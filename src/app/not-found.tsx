"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* 404 Animation */}
                <div className="relative">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10" />
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
                    <p className="text-neutral-400 text-lg max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Button>
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-full px-8 py-6 text-base font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-12 border-t border-neutral-800">
                    <p className="text-neutral-500 text-sm mb-4">Looking for something specific?</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/dashboard"
                            className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-4"
                        >
                            Dashboard
                        </Link>
                        <span className="text-neutral-700">•</span>
                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-4"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-20" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-20" />
            </div>
        </div>
    )
}
