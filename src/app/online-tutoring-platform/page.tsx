import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Rocket, Globe, Clock } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "All-in-One Online Tutoring Platform | SessionOrbit",
    description: "Launch your tutoring business with SessionOrbit's comprehensive online tutoring platform. Schedule, teach, and get paid in one place.",
};

export default function OnlineTutoringPlatformPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400 font-medium mb-8">
                        <Rocket size={14} />
                        <span>Grow Your Tutoring Business</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        The Ultimate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            Online Tutoring Platform
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        SessionOrbit gives you everything you need to run a successful tutoring business.
                        From scheduling and payments to a world-class virtual classroom.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-purple-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Start for Free
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Platform Features */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">More Than Just Video Calls</h2>
                        <p className="text-slate-400">A complete operating system for your tutoring business.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-colors">
                            <Globe className="text-purple-400 mb-6" size={32} />
                            <h3 className="text-2xl font-bold text-white mb-4">Teach from Anywhere</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Connect with students globally. Our platform handles timezone conversions, automated reminders, and seamless connection stability.
                            </p>
                            <ul className="space-y-3">
                                {["Global Server Network", "Smart Scheduling", "Automated Reminders"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300">
                                        <Check size={16} className="text-purple-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 transition-colors">
                            <Clock className="text-pink-400 mb-6" size={32} />
                            <h3 className="text-2xl font-bold text-white mb-4">Save 5+ Hours/Week</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Automate your admin work. SessionOrbit generates lesson reports, tracks attendance, and handles billing so you can focus on teaching.
                            </p>
                            <ul className="space-y-3">
                                {["AI Lesson Summaries", "Auto-Billing", "Attendance Tracking"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300">
                                        <Check size={16} className="text-pink-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Why SessionOrbit? */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Built for Growth
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Whether you're a solo tutor or running an agency, SessionOrbit scales with you. Add more tutors, manage multiple students, and keep everything organized in one dashboard.
                            </p>
                            <Link href="/signup" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors">
                                Get Started Today
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Uptime", value: "99.9%" },
                                { label: "Active Tutors", value: "2,000+" },
                                { label: "Classes Hosted", value: "50k+" },
                                { label: "Satisfaction", value: "4.9/5" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-6 text-center border border-white/5">
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-slate-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
