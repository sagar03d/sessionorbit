import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, Eye, MousePointer2, Users } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "Best Whiteboard for Student Engagement Tracking | SessionOrbit",
    description: "Track student attention and participation in real-time. SessionOrbit is the only whiteboard that gives you analytics on student engagement during online classes.",
};

export default function EngagementTrackingPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-sm text-pink-400 font-medium mb-8">
                        <Activity size={14} />
                        <span>Real-Time Analytics</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Know Exactly When <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">
                            Your Students Are Engaging
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Don't teach to a blank screen. SessionOrbit tracks cursor movement, participation, and focus in real-time, giving you superpowers to keep students on track.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-rose-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Track Engagement Free
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {[
                        {
                            title: "Real-Time Attention Score",
                            desc: "Get a live pulse on your class. See an aggregate engagement score that updates as students interact with the board.",
                            icon: Activity
                        },
                        {
                            title: "Focus Tracking",
                            desc: "Know when students switch tabs or minimize the window. Gently nudge them back to the lesson without awkward confrontations.",
                            icon: Eye
                        },
                        {
                            title: "Participation Heatmaps",
                            desc: "See exactly where students are clicking and hovering. Identify who is participating and who is falling behind.",
                            icon: MousePointer2
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <feature.icon size={120} />
                            </div>
                            <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6 text-rose-400">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Social Proof / Stats */}
                <div className="border-t border-white/10 pt-24 mb-24">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">35%</div>
                            <div className="text-slate-400">Increase in student retention</div>
                        </div>
                        <div>
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">2.5x</div>
                            <div className="text-slate-400">More interactions per hour</div>
                        </div>
                        <div>
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
                            <div className="text-slate-400">Visibility into student focus</div>
                        </div>
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
