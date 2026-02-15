import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, PenTool, Layout, Image as ImageIcon } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "Best Interactive Whiteboard for Online Teaching | SessionOrbit",
    description: "Engage students with SessionOrbit's interactive whiteboard for teaching. Infinite canvas, real-time collaboration, and education-first tools.",
};

export default function InteractiveWhiteboardPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 font-medium mb-8">
                        <PenTool size={14} />
                        <span>Designed for Education</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        The Ultimate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            Interactive Whiteboard
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Go beyond simple drawing. SessionOrbit's whiteboard is a powerful canvas for interactive lessons, collaborative problem solving, and engaging visual learning.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-orange-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Start Drawing Free
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Tool Showcase */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {[
                        {
                            icon: <Layout className="text-orange-400" />,
                            title: "Infinite Canvas",
                            desc: "Never run out of space. Pan and zoom infinitely to organize complex topics and lesson plans."
                        },
                        {
                            icon: <PenTool className="text-red-400" />,
                            title: "Smart Pens & Shapes",
                            desc: "Pressure-sensitive digital ink, perfect shapes every time, and a variety of highlighters and markers."
                        },
                        {
                            icon: <ImageIcon className="text-yellow-400" />,
                            title: "Media Rich",
                            desc: "Upload PDFs, images, and documents directly onto the board. Annotate over anything instantly."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-all hover:-translate-y-1">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Collaboration Focus */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 md:p-16 mb-24 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Real-Time Collaboration</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
                        See your students cursor in real-time. Whether you are teaching math, coding, or languages, work together on the same board without lag.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            "Multi-user Editing",
                            "Cursor Highlighting",
                            "Follow-me Mode",
                            "Permissions Control",
                            "Version History",
                            "Export to PDF"
                        ].map((item, i) => (
                            <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-2">
                                <Check size={14} className="text-orange-400" /> {item}
                            </div>
                        ))}
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
