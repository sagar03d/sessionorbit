"use client";

import { useState } from "react";
import { FileText, Wand2, CheckCircle2, Clock, Calendar, BarChart3, BrainCircuit, Sparkles, ChevronRight, Download, X } from "lucide-react";

export default function ScribeDemo() {
    const [showReport, setShowReport] = useState(false);

    return (
        <div className="relative col-span-1 lg:col-span-2 group overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 p-1 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 w-full h-full bg-slate-950/50 rounded-[20px] overflow-hidden flex flex-col min-h-[400px]">

                {/* TEASER VIEW */}
                {!showReport && (
                    <div className="relative h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>Instant Delivery</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span>Parent Approved</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowReport(true)}
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 group/btn"
                            >
                                Show Sample Report
                                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Interactive Visual Preview */}
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
                )}

                {/* FULL REPORT VIEW */}
                {showReport && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">Advanced Calculus: Derivatives</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">COMPLETED</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> Oct 24, 2024</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                                        <span className="flex items-center gap-1"><Clock size={12} /> 45 mins</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                                        <span>Student: Sarah Jenkins</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors flex items-center gap-2 border border-white/5">
                                    <Download size={14} />
                                    PDF
                                </button>
                                <button
                                    onClick={() => setShowReport(false)}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-medium transition-colors flex items-center gap-2 border border-indigo-500/20"
                                >
                                    <X size={14} /> Close Preview
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                            {/* Metrics Column */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Performance Metrics</h4>

                                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><BrainCircuit size={14} className="text-purple-400" /> Focus Score</span>
                                        <span className="text-white font-semibold">94%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[94%]" />
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Understanding</span>
                                        <span className="text-white font-semibold">High</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[85%]" />
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm flex items-center gap-2"><BarChart3 size={14} className="text-blue-400" /> Participation</span>
                                        <span className="text-white font-semibold">Active</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[90%]" />
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary Column */}
                            <div className="md:col-span-2 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded bg-indigo-500/10 text-indigo-400">
                                        <Wand2 size={14} />
                                    </div>
                                    <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Executive Summary</h4>
                                </div>

                                <div className="flex-1 p-4 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 leading-relaxed relative overflow-hidden group/summary">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/summary:opacity-100 transition-opacity">
                                        <Sparkles size={16} className="text-indigo-400" />
                                    </div>
                                    <p className="mb-3">
                                        <span className="text-white font-medium">Session Highlights:</span> Sarah demonstrated an excellent grasp of the Chain Rule concepts introduced today. We successfully solved 5 complex derivative problems, with her leading the solution process for the last two.
                                    </p>
                                    <p className="mb-3">
                                        <span className="text-white font-medium">Areas for Improvement:</span> She initially struggled with identifying nested functions in trigonometric compositions but corrected this after we reviewed the "onion peeling" method.
                                    </p>
                                    <div className="mt-4 pt-3 border-t border-white/5">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Recommended Next Steps</span>
                                        <ul className="space-y-1">
                                            <li className="flex items-start gap-2 text-xs text-slate-400">
                                                <div className="min-w-[4px] h-[4px] rounded-full bg-indigo-500 mt-1.5" />
                                                Complete practice set #4 (Questions 1-10) focusing on trig derivatives.
                                            </li>
                                            <li className="flex items-start gap-2 text-xs text-slate-400">
                                                <div className="min-w-[4px] h-[4px] rounded-full bg-indigo-500 mt-1.5" />
                                                Review the recording of today's session, specifically minutes 25-35.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
