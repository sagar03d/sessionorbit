import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Video, Monitor, Users } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "Best Virtual Classroom Software for Online Teaching | SessionOrbit",
    description: "Experience the ultimate virtual classroom software with HD video, interactive whiteboard, and AI-powered lesson reports. Start teaching online for free.",
};

export default function VirtualClassroomPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-400 font-medium mb-8">
                        <Video size={14} />
                        <span>#1 Rated Virtual Classroom Software</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Teach Like You're <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                            In The Same Room
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        SessionOrbit is the virtual classroom software that makes online teaching feel natural. HD video, crystal-clear audio, and a whiteboard that actually works.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-indigo-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Try It Free
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Teach Online</h2>
                        <p className="text-slate-400">Built specifically for educators, not for board meetings.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Video className="text-indigo-400" size={24} />,
                                title: "HD Video & Audio",
                                description: "Low-latency video conferencing designed for education. See every student expression clearly."
                            },
                            {
                                icon: <Monitor className="text-purple-400" size={24} />,
                                title: "Interactive Whiteboard",
                                description: "Draw, type, and collaborate in real-time on an infinite canvas. Upload PDFs and images instantly."
                            },
                            {
                                icon: <Users className="text-emerald-400" size={24} />,
                                title: "Student Engagement",
                                description: "Track attention and participation automatically with our AI-powered engagement metrics."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits List */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Why Choose SessionOrbit as Your <span className="text-indigo-400">Virtual Classroom</span>?
                        </h2>
                        <div className="space-y-4">
                            {[
                                "No downloads required – works in browser",
                                "Secure, encrypted lesson spaces",
                                "Automatic lesson recording and summaries",
                                "Screen sharing with annotation tools",
                                "Breakout rooms for group activities"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-indigo-400" />
                                    </div>
                                    <span className="text-lg text-slate-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-2">
                                Start your free class <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative h-[400px] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                        {/* Placeholder for an image or illustration */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                            {/* You can replace this with an actual image or a complex CSS illustration */}
                            <div className="text-center">
                                <Video size={64} className="mx-auto mb-4 opacity-50" />
                                <p>High-Quality Classroom Interface</p>
                            </div>
                        </div>
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
