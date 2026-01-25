"use client"

import { Check, ClipboardList } from "lucide-react"

export default function AILessonScribe() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 font-medium mb-6">
                            <span>Feature Spotlight</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            AI Lesson Scribe
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            No more typing reports after work. Finished the second the class ends.
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-indigo-400" />
                                    For the Tutor
                                </h3>
                                <p className="text-slate-400 mb-4">
                                    "No more typing reports after work. Use your free time for yourself."
                                </p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> Auto-generated class summaries</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> Homework tracking extraction</li>
                                </ul>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-purple-400" />
                                    For the Parent / Agency
                                </h3>
                                <p className="text-slate-400">
                                    "Instant, professional updates on exactly what was learned today. Feel connected to progress."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Visual Placeholder - Could be a screenshot of a report */}
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                            <div className="z-10 bg-[#0B0C15] rounded-xl p-6 border border-white/10 shadow-2xl">
                                <div className="h-4 w-32 bg-indigo-500/20 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                                </div>
                                <div className="mt-6 h-4 w-24 bg-purple-500/20 rounded mb-2" />
                                <div className="h-16 w-full bg-white/5 rounded border border-white/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
