"use client"

import { Check, ClipboardList, Sparkles, Clock, FileText, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function AILessonScribe() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Documentation</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                            AI Lesson Scribe
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Transform your teaching sessions into professional, detailed reports automatically. No more typing after work—finished the second the class ends.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Auto-generated summaries</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Homework tracking</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Progress insights</span>
                            </div>
                        </div>

                        <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                            Start Free Trial
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                            <div className="z-10 bg-[#0B0C15] rounded-xl p-6 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <ClipboardList className="w-5 h-5 text-indigo-400" />
                                    <div className="h-4 w-32 bg-indigo-500/20 rounded" />
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-purple-400" />
                                    <div className="h-4 w-24 bg-purple-500/20 rounded" />
                                </div>
                                <div className="h-16 w-full bg-white/5 rounded border border-white/5" />
                            </div>
                            <div className="absolute bottom-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                Auto-Generated
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                            <ClipboardList className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Tutors
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "No more typing reports after work. Use your free time for yourself."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Automatically capture key topics, student questions, and learning moments</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Extract homework assignments and deadlines without manual entry</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Track student progress and areas needing improvement</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Save 30+ minutes per session on administrative work</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Parents & Agencies
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Instant, professional updates on exactly what was learned today. Feel connected to progress."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Receive detailed lesson summaries immediately after each session</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Track learning outcomes and skill development over time</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Stay informed about homework and upcoming assessments</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Verify value and quality of tutoring sessions</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Teach Naturally</h3>
                            <p className="text-slate-400">Our AI listens and transcribes your entire lesson in real-time</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Analyzes</h3>
                            <p className="text-slate-400">Smart algorithms identify key topics, homework, and learning moments</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-emerald-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Instant Report</h3>
                            <p className="text-slate-400">Professional summary delivered the moment your class ends</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-indigo-400 mb-2">30+</div>
                        <div className="text-slate-400">Minutes Saved Per Session</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
                        <div className="text-slate-400">Accurate Transcription</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                        <div className="text-slate-400">Automatic Processing</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
