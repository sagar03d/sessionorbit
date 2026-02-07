"use client";

import Link from "next/link";
import { ArrowRight, Play, Check } from "lucide-react";

export default function ModernHero() {
    return (
        <div className="relative w-full pt-32 pb-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/50 to-slate-950 pointer-events-none" />

            {/* Hiring Badge */}
            <Link
                href="#"
                className="relative z-10 mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
            >
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: AI-Powered Lesson Reports
                <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Main Heading */}
            <h1 className="relative z-10 max-w-5xl text-center text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
                Stop Managing. Start Teaching. 🚀 <br />
                {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">
                    feedback platform
                </span> */}
            </h1>

            {/* Subheading */}
            <p className="relative z-10 text-lg sm:text-xl text-slate-400 text-center max-w-2xl mb-10 leading-relaxed">
                SessionOrbit automates the "admin grind" with AI-generated reports and real-time student engagement tracking. Reclaim 5+ hours a week and grow your tutoring business on autopilot.
            </p>

            {/* CTAs */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
                <Link
                    href="/signup"
                    className="h-12 px-8 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                    Get started - free
                </Link>
                <Link
                    href="/demo"
                    className="h-12 px-8 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 justify-center backdrop-blur-sm"
                >
                    Watch a demo
                </Link>
            </div>
        </div >
    );
}
