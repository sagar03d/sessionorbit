"use client";

import { useState } from "react";
import { Wifi, WifiOff, Signal, Mic, Video, VideoOff, User } from "lucide-react";
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
                            className="relative h-8 w-14 rounded-full bg-slate-800 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            aria-label="Toggle Bandwidth Mode"
                        >
                            <div className={cn(
                                "absolute left-1 top-1 h-6 w-6 rounded-full transition-transform duration-300 shadow-lg flex items-center justify-center",
                                lowBandwidth ? "translate-x-6 bg-amber-400" : "translate-x-0 bg-emerald-400"
                            )}>
                                {lowBandwidth ? <Signal size={12} className="text-amber-900" /> : <Wifi size={12} className="text-emerald-900" />}
                            </div>
                        </button>
                    </div>

                    <h3 className="text-xl font-medium text-white mb-2">Low Bandwidth Mode</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Perfect classes on 3G. Because teaching shouldn't depend on a Fiber connection.
                    </p>
                </div>

                {/* Interactive Video Simulation */}
                <div className="h-40 w-full bg-slate-950 rounded-xl border border-white/5 overflow-hidden relative group/video">

                    {/* Simulated Rate Limiting / Blur Effect */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-slate-800 transition-all duration-700",
                        lowBandwidth ? "blur-sm grayscale-[0.5]" : ""
                    )}>
                        {/* Avatar / Person Placeholder */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500/30 text-indigo-300">
                                <User size={40} />
                            </div>
                            {/* Speaking Indicator */}
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full border-2 border-slate-900">
                                <Mic size={12} className="text-slate-900" />
                            </div>
                        </div>
                    </div>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        {/* Status Badge */}
                        <div className="flex justify-end">
                            <div className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md transition-colors duration-300",
                                lowBandwidth
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            )}>
                                {lowBandwidth ? (
                                    <>
                                        <Signal size={10} className="animate-pulse" /> 3G MODE
                                    </>
                                ) : (
                                    <>
                                        <Wifi size={10} /> HD VIDEO
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Low Bandwidth Intervention Message */}
                        <div className={cn(
                            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300 transform",
                            lowBandwidth ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        )}>
                            <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
                                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                                    <Mic size={16} className="fill-emerald-400/20" />
                                    <span className="font-bold text-sm">Audio Priority Active</span>
                                </div>
                                <p className="text-[10px] text-slate-400 whitespace-nowrap">Video optimized. Voice remains crystal clear.</p>
                            </div>
                        </div>

                        {/* Name Label */}
                        <div className="self-start">
                            <span className="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                Sarah Jenkins
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
