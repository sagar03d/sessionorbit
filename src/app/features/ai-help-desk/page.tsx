"use client"

import { Check, Mic, Headphones, Volume2, Settings, Zap, Clock, Shield } from "lucide-react"
import Link from "next/link"

export default function AIHelpDesk() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
                            <div className="relative z-10 w-56 h-56 rounded-full bg-black/50 border-2 border-blue-500/30 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                <Mic className="w-20 h-20 text-blue-400" />
                                <div className="absolute -right-6 -top-6 bg-emerald-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                    Active
                                </div>
                                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-full animate-ping" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 font-medium mb-6">
                            <Zap className="w-4 h-4" />
                            <span>Instant Tech Support</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                            AI Help Desk
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            No more "Can you hear me?" stress. Our AI assistant speaks directly to students to diagnose and fix audio/video issues instantly—so you can start teaching on time.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Voice-guided troubleshooting</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Real-time diagnostics</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Zero tutor intervention</span>
                            </div>
                        </div>

                        <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                            Try It Free
                        </Link>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Tutors
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Start class on time. Don't waste the first 10 minutes debugging audio settings."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Eliminate technical delays at the start of every session</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Focus on teaching, not troubleshooting microphones and cameras</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Reduce stress and frustration from technical issues</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Maximize billable teaching time</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Parents & Students
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Children can solve their own tech issues without interrupting the lesson or calling for help."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Students gain independence and confidence with technology</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>No more parent interruptions during work meetings</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Lessons start promptly without technical delays</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Get full value from every paid minute</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Common Issues Solved */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Issues We Solve Instantly</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl">
                            <Mic className="w-10 h-10 text-blue-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Microphone Issues</h3>
                            <p className="text-sm text-slate-400">Muted mics, wrong input device, permission errors</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20 rounded-xl">
                            <Volume2 className="w-10 h-10 text-indigo-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Audio Problems</h3>
                            <p className="text-sm text-slate-400">No sound, echo, feedback, volume too low</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl">
                            <Headphones className="w-10 h-10 text-purple-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Device Selection</h3>
                            <p className="text-sm text-slate-400">Wrong speakers, headphones not detected</p>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Issue Detected</h3>
                            <p className="text-sm text-slate-400">AI identifies audio/video problems automatically</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Voice Guidance</h3>
                            <p className="text-sm text-slate-400">AI speaks to student with step-by-step instructions</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Real-Time Fix</h3>
                            <p className="text-sm text-slate-400">Student follows prompts to resolve the issue</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-emerald-400">4</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Class Starts</h3>
                            <p className="text-sm text-slate-400">Everything working, lesson begins on time</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">10 min</div>
                        <div className="text-slate-400">Average Time Saved Per Session</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">95%</div>
                        <div className="text-slate-400">Issues Resolved Without Tutor</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">&lt;2 min</div>
                        <div className="text-slate-400">Average Resolution Time</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
