"use client";

import { useState } from "react";
import { Wifi, WifiOff, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BandwidthToggle() {
    const [lowBandwidth, setLowBandwidth] = useState(false);

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "p-3 rounded-2xl transition-all duration-300",
                            lowBandwidth ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                        )}>
                            {lowBandwidth ? <WifiOff size={24} /> : <Wifi size={24} />}
                        </div>

                        <button
                            onClick={() => setLowBandwidth(!lowBandwidth)}
                            className="relative h-8 w-14 rounded-full bg-slate-800 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <div className={cn(
                                "absolute left-1 top-1 h-6 w-6 rounded-full transition-transform duration-300 shadow-lg",
                                lowBandwidth ? "translate-x-6 bg-amber-400" : "translate-x-0 bg-emerald-400"
                            )} />
                        </button>
                    </div>

                    <h3 className="text-xl font-medium text-white mb-2">Low Bandwidth Mode</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Perfect classes on 3G. Because teaching shouldn't depend on a Fiber connection.
                    </p>
                </div>

                {/* Visualizer */}
                <div className="h-24 w-full bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden relative flex items-center justify-center">
                    {lowBandwidth ? (
                        <div className="flex items-center gap-3 text-amber-500/80 font-mono text-sm">
                            <Signal className="animate-pulse" />
                            <span>AUDIO_ONLY_OPTIMIZED</span>
                        </div>
                    ) : (
                        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-50">
                            <div className="bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                            <div className="bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                            <div className="bg-emerald-500/20 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}

                    {!lowBandwidth && (
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-medium text-sm tracking-widest">
                            HD VIDEO 4K
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
