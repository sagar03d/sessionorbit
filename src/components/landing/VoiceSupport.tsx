"use client";

import { Mic, Headphones, Activity } from "lucide-react";

export default function VoiceSupport() {
    return (
        <div className="relative group overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300">
                        <Headphones size={24} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">AI AGENT ACTIVE</span>
                    </div>
                </div>

                <h3 className="text-xl font-medium text-white mb-2">Self-Healing Sessions</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    If a student drifts out of sync, our AI voice assistant brings them back.
                </p>

                {/* Waveform Animation */}
                <div className="relative h-16 bg-slate-950/60 rounded-xl border border-white/5 flex items-center justify-center gap-1 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-pulse"
                            style={{
                                height: `${Math.random() * 80 + 20}%`,
                                animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                                animationDelay: `${Math.random() * 0.2}s`
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
