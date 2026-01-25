"use client"

import { Check, Eye } from "lucide-react"

export default function FocusOrbit() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="w-full h-full rounded-2xl border border-amber-500/20 bg-black/50 backdrop-blur-sm relative flex items-center justify-center">
                                <Eye className="w-24 h-24 text-amber-500/50" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-500/10 to-transparent" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 font-medium mb-6">
                            <span>New Feature</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Focus Orbit
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            Know exactly when a student is drifting off without being a "nagger."
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-amber-400" />
                                    For the Tutor
                                </h3>
                                <p className="text-slate-400">
                                    "Subtle alerts let you re-engage the student naturally before you lose them completely."
                                </p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-orange-400" />
                                    For the Parent / Agency
                                </h3>
                                <p className="text-slate-400">
                                    "Peace of mind that your child is actually learning, not just staring blankly at a screen."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
