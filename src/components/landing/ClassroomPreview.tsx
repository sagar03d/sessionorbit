"use client";

import Image from "next/image";
import { Zap, Users, Layout } from "lucide-react";

export default function ClassroomPreview() {
    return (
        <section className="relative py-24 bg-[#0B0C15] overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        A Classroom That <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Feel Alive</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                        Experience low-latency whiteboard collaboration, crystal-clear video, and AI-powered tools that keep students engaged.
                    </p>
                </div>

                {/* Screenshot Container */}
                <div className="relative rounded-2xl border border-white/10 shadow-2xl bg-neutral-900/50 backdrop-blur-xl overflow-hidden group">
                    {/* Browser UI Header */}
                    <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="ml-4 px-3 py-1 rounded-md bg-black/20 text-xs text-slate-500 font-mono flex-1 text-center truncate max-w-sm mx-auto">
                            https://sessionorbit.com/room/sampleRoom
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                        <Image
                            src="/classroom-preview.png"
                            alt="Live Classroom Interface"
                            fill
                            className="object-cover transform group-hover:scale-[1.01] transition-transform duration-700"
                        />

                        {/* Overlay Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Floating Feature Highlights */}
                    <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none">
                        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Real-time Sync</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                            <Layout className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="hidden sm:inline">Infinite Canvas</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Multi-User</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
