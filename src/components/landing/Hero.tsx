"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { OrbitGraphic } from "../illustrations/OrbitGraphic";

export default function Hero() {
    return (
        <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B0C15]">
            {/* Starfield / Deep Navy Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0B0C15] to-[#0B0C15]" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] max-w-7xl opacity-40 pointer-events-none overflow-hidden">
                <OrbitGraphic className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] text-orbit-cyan/20 animate-spin-slow" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orbit-cyan/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-deep-indigo/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
            </div>

            <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Copy */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-orbit-cyan font-medium backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orbit-cyan/75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orbit-cyan"></span>
                        </span>
                        SessionOrbit 2.0 is Live
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        Sync Every Lesson. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-indigo via-orbit-cyan to-growth-lime animate-gradient-x">
                            Scale Every Orbit.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        The ultimate AI-powered platform for seamless online teaching and student engagement. Everything in one orbit.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href="/signup" className="h-12 px-8 rounded-full bg-white text-deep-indigo font-bold hover:bg-stellar-white transition-colors flex items-center gap-2 group">
                            Start a Free Class
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/#features" className="h-12 px-8 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
                            <Play size={18} className="fill-current" />
                            Watch Demo
                        </Link>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="flex-1 w-full max-w-xl lg:max-w-none relative perspective-1000">
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
                        <Image
                            src="/dashboard-preview.png"
                            alt="SessionOrbit Dashboard"
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                        {/* Floating UI Badges - Decorative */}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-slate-950/80 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2 shadow-lg animate-float">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            SYSTEM ONLINE
                        </div>
                    </div>

                    {/* Reflection/Shadow */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-orbit-cyan/20 blur-xl rounded-[100%]" />
                </div>
            </div>
        </div>
    );
}
