"use client";

import { FileText, Wand2, CheckCircle2 } from "lucide-react";

export default function ScribeDemo() {
    return (
        <div className="relative col-span-1 lg:col-span-2 group overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                            <Wand2 size={20} />
                        </div>
                        <span className="text-purple-300 font-medium tracking-wide text-sm">ORBITAL INTELLIGENCE</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-medium text-white mb-3">
                        Your post-lesson reports, auto-generated.
                    </h3>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Your post-lesson reports, auto-generated and delivered before you even log off.
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span>Instant Delivery</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span>Parent Approved</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Visual */}
                <div className="relative h-64 w-full rounded-xl bg-slate-950/80 border border-white/10 overflow-hidden shadow-2xl">
                    {/* Left Side: Whiteboard Mock */}
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 p-4 border-r border-white/5 opacity-60">
                        <div className="w-full h-full flex flex-col gap-2">
                            <div className="h-2 w-20 bg-slate-700 rounded-full mb-2" />
                            <svg className="w-full h-full text-slate-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 20 Q 25 10, 40 20 T 70 20" />
                                <path d="M10 40 L 40 70 M 40 40 L 10 70" className="opacity-50" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Side: Report Mock */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-slate-900 px-4 py-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={14} className="text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-500">REPORT GENERATED</span>
                        </div>
                        <div className="h-1.5 w-3/4 bg-slate-700/50 rounded-full" />
                        <div className="h-1.5 w-full bg-slate-700/50 rounded-full" />
                        <div className="h-1.5 w-5/6 bg-slate-700/50 rounded-full" />
                        <div className="h-1.5 w-2/3 bg-slate-700/50 rounded-full" />

                        <div className="mt-auto p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-emerald-400 font-mono">SENT TO: PARENTS</span>
                                <CheckCircle2 size={10} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    {/* Central AI Processor Effect */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-8 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm animate-pulse" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-slate-950 rounded-full border border-indigo-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] z-20">
                        <Wand2 size={20} className="text-indigo-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
