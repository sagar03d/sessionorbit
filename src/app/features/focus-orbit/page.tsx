"use client"

import { Check, Eye, Brain, Target, TrendingUp, AlertCircle, Zap, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function FocusOrbit() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full h-full rounded-2xl border-2 border-amber-500/20 bg-black/50 backdrop-blur-sm relative flex items-center justify-center">
                                <Eye className="w-32 h-32 text-amber-500/50" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-500/10 to-transparent" />

                                {/* Attention Indicators */}
                                <div className="absolute top-8 right-8 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Focused
                                </div>
                                <div className="absolute bottom-8 left-8 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" />
                                    Alert Ready
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 font-medium mb-6">
                            <Brain className="w-4 h-4" />
                            <span>Attention Analytics</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                            Focus Orbit
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Know exactly when a student is drifting off without being a "nagger." Subtle, AI-powered attention tracking helps you re-engage students naturally before you lose them completely.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Real-time attention tracking</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Subtle alerts</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-400">
                                <Check className="w-5 h-5" />
                                <span>Privacy-first design</span>
                            </div>
                        </div>

                        <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                            Enhance Engagement
                        </Link>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Tutors
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Subtle alerts let you re-engage the student naturally before you lose them completely."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Get gentle notifications when student attention starts to wander</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Re-engage students with questions or activities at the right moment</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Track engagement patterns to optimize your teaching style</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Maintain student focus without constant interruptions or nagging</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                            <BarChart3 className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            For Parents & Agencies
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                            "Peace of mind that your child is actually learning, not just staring blankly at a screen."
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Verify active participation and engagement during lessons</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Receive engagement reports showing attention levels over time</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Ensure quality learning experiences worth the investment</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Identify optimal learning times and conditions for your child</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Attention Indicators */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Smart Attention Indicators</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-emerald-400">Highly Engaged</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Student is actively participating and focused on the lesson</p>
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span>No action needed</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-amber-400">Attention Drifting</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Student showing signs of distraction or reduced focus</p>
                            <div className="flex items-center gap-2 text-xs text-amber-400">
                                <Zap className="w-3 h-3" />
                                <span>Gentle alert sent</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-red-400">Disengaged</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">Student appears to be off-task or not paying attention</p>
                            <div className="flex items-center gap-2 text-xs text-red-400">
                                <AlertCircle className="w-3 h-3" />
                                <span>Re-engagement suggested</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-amber-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Monitor Engagement</h3>
                            <p className="text-sm text-slate-400">AI analyzes visual cues and interaction patterns</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Detect Changes</h3>
                            <p className="text-sm text-slate-400">Identify when attention starts to wander</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-yellow-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Subtle Alert</h3>
                            <p className="text-sm text-slate-400">Notify tutor with gentle, non-intrusive signal</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-emerald-400">4</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Re-engage</h3>
                            <p className="text-sm text-slate-400">Tutor naturally brings student back to focus</p>
                        </div>
                    </div>
                </div>

                {/* Privacy Note */}
                <div className="mb-24 p-8 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Privacy-First Design</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Focus Orbit uses advanced AI to analyze engagement patterns without recording or storing video. All processing happens in real-time, and no personal data is retained. Students' privacy is our top priority.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-amber-400 mb-2">40%</div>
                        <div className="text-slate-400">Increase in Student Engagement</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">85%</div>
                        <div className="text-slate-400">Tutor Satisfaction Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                        <div className="text-slate-400">Privacy Protected</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
