"use client"

import { Check, Mic } from "lucide-react"

export default function AIHelpDesk() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
                            <div className="relative z-10 w-48 h-48 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <Mic className="w-16 h-16 text-indigo-400" />
                                <div className="absolute -right-4 -top-4 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">Active</div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 font-medium mb-6">
                            <span>Tech Support Solved</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            AI Help Desk
                        </h1>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                            No more "Can you hear me?" stress. The AI speaks to the student to fix tech issues instantly.
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-blue-400" />
                                    For the Tutor
                                </h3>
                                <p className="text-slate-400">
                                    "Start class on time. Don't waste the first 10 minutes debugging audio settings."
                                </p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-400" />
                                    For the Parent / Agency
                                </h3>
                                <p className="text-slate-400">
                                    "Children can solve their own tech issues without interrupting the lesson."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
