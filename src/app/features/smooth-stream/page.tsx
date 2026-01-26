"use client"

import { Check, Wifi, Signal, Zap, TrendingUp, Globe, Gauge, Shield } from "lucide-react"
import Link from "next/link"

export default function SmoothStream() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300 font-medium mb-6">
                            <Signal className="w-4 h-4" />
                            <span>Adaptive Streaming Technology</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                            Smooth-Stream
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Teach flawlessly on any connection. No more laggy video calls, frozen screens, or cancelled lessons due to poor internet. Our adaptive technology ensures crystal-clear teaching every time.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Auto-adjusts to bandwidth</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Low-data mode</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>99.9% uptime</span>
                            </div>
                        </div>

                        <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                            Start Teaching Smoothly
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-3xl bg-neutral-900 border border-white/10 p-1 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full h-full bg-black rounded-2xl flex flex-col items-center justify-center gap-6 relative">
                                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/30 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Optimized
                                </div>

                                {/* Signal Strength Visualization */}
                                <div className="flex items-end gap-2">
                                    <div className="w-3 h-8 bg-emerald-500 rounded-sm" />
                                    <div className="w-3 h-12 bg-emerald-500 rounded-sm" />
                                    <div className="w-3 h-16 bg-emerald-500 rounded-sm" />
                                    <div className="w-3 h-20 bg-emerald-500 rounded-sm" />
                                    <div className="w-3 h-24 bg-emerald-500 rounded-sm animate-pulse" />
                                </div>

                                <Wifi className="w-24 h-24 text-emerald-500 opacity-50" />
                                <p className="text-emerald-400 text-lg font-semibold">Connection Stabilized</p>
                                <p className="text-slate-500 text-sm">Adaptive quality: HD → SD → Audio-only</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Gauge className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Tutors
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Focus on teaching, not waiting for the video to buffer or apologizing for connection issues."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Teach confidently from anywhere—home, cafe, or while traveling</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Automatic quality adjustment prevents freezing and lag</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Low-bandwidth mode keeps lessons running even on weak connections</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Never cancel a lesson due to internet issues again</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-teal-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Parents & Agencies
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "No wasted money on blurry, frozen, or cancelled lessons due to bad internet. Every minute counts."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Consistent lesson quality regardless of internet conditions</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Fewer cancelled or rescheduled sessions</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Students can learn from anywhere without connectivity worries</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Get full value from every paid session</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Adaptive Technology */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Intelligent Adaptation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Signal className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold">Strong Connection</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Full HD video + crystal clear audio</p>
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                                <Check className="w-4 h-4" />
                                <span>1080p quality</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Gauge className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h3 className="text-lg font-semibold">Medium Connection</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Standard video + clear audio</p>
                            <div className="flex items-center gap-2 text-xs text-yellow-400">
                                <Check className="w-4 h-4" />
                                <span>480p quality</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Wifi className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold">Weak Connection</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Audio-only mode + whiteboard</p>
                            <div className="flex items-center gap-2 text-xs text-blue-400">
                                <Check className="w-4 h-4" />
                                <span>Lesson continues</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-emerald-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Monitor Connection</h3>
                            <p className="text-slate-400">Real-time bandwidth detection and quality monitoring</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-teal-500/10 border-2 border-teal-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-teal-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Auto-Adjust Quality</h3>
                            <p className="text-slate-400">Seamlessly switch between HD, SD, and audio-only modes</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-cyan-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Uninterrupted Teaching</h3>
                            <p className="text-slate-400">Lessons continue smoothly regardless of connection changes</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
                        <div className="text-slate-400">Session Completion Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-teal-400 mb-2">50%</div>
                        <div className="text-slate-400">Less Bandwidth Required</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-400 mb-2">0</div>
                        <div className="text-slate-400">Cancelled Lessons</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
