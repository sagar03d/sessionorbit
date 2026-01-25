"use client"

import { Check, Wifi } from "lucide-react"

export default function SmoothStream() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300 font-medium mb-6">
                            <span>Reliability Core</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Smooth-Stream
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Teaches flawlessly on any connection. No more laggy video calls or frozen screens.
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Wifi className="w-5 h-5 text-emerald-400" />
                                    For the Tutor
                                </h3>
                                <p className="text-slate-400">
                                    "Focus on teaching, not waiting for the video to buffer."
                                </p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-emerald-400" />
                                    For the Parent / Agency
                                </h3>
                                <p className="text-slate-400">
                                    "No wasted money on blurry, frozen, or cancelled lessons due to bad internet."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-3xl bg-neutral-900 border border-white/10 p-1 flex items-center justify-center relative overflow-hidden">
                            {/* Simulation of low bandwidth mode */}
                            <div className="w-full h-full bg-black rounded-2xl flex flex-col items-center justify-center gap-4 relative">
                                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Optimized
                                </div>
                                <Wifi className="w-20 h-20 text-emerald-500 opacity-50" />
                                <p className="text-slate-500 text-sm">Signal Stabilized</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
