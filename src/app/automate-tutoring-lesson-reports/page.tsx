import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, FileText, Sparkles } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "Automate Tutoring Lesson Reports | SessionOrbit",
    description: "Stop spending hours on manual write-ups. SessionOrbit's AI generates professional lesson reports in seconds, tracking student progress and engagement automatically.",
};

export default function AutomateReportsPage() {
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
                        <Sparkles size={14} />
                        <span>AI-Powered Reporting</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Automate Your Tutoring <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Lesson Reports in Seconds
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop spending your evenings writing summaries. Our AI analyzes every lesson to generate detailed, professional reports for parents and students automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-indigo-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Start Automating Reports
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/#demo" className="h-14 px-8 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm text-lg font-medium">
                            View Sample Report
                        </Link>
                    </div>
                </div>

                {/* Problem vs Solution Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
                    {/* The Old Way */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Clock className="text-red-500 w-24 h-24 opacity-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-200 mb-6">The Old Way</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-red-200/80">
                                <span className="text-red-500 text-xl">×</span>
                                <span>Spending 10-15 minutes post-lesson writing notes</span>
                            </li>
                            <li className="flex items-start gap-3 text-red-200/80">
                                <span className="text-red-500 text-xl">×</span>
                                <span>Forgetting key details 24 hours later</span>
                            </li>
                            <li className="flex items-start gap-3 text-red-200/80">
                                <span className="text-red-500 text-xl">×</span>
                                <span>Inconsistent formatting confuses parents</span>
                            </li>
                            <li className="flex items-start gap-3 text-red-200/80">
                                <span className="text-red-500 text-xl">×</span>
                                <span>Unpaid administrative time</span>
                            </li>
                        </ul>
                    </div>

                    {/* The SessionOrbit Way */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 relative overflow-hidden ring-1 ring-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)]">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Sparkles className="text-emerald-500 w-24 h-24 opacity-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-200 mb-6">The SessionOrbit Way</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-emerald-200/80">
                                <Check className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                                <span>Instant summary generated as class ends</span>
                            </li>
                            <li className="flex items-start gap-3 text-emerald-200/80">
                                <Check className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                                <span>Captures student engagement & key concepts covered</span>
                            </li>
                            <li className="flex items-start gap-3 text-emerald-200/80">
                                <Check className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                                <span>Professional, consistent format every time</span>
                            </li>
                            <li className="flex items-start gap-3 text-emerald-200/80">
                                <Check className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                                <span>100% focused on teaching, 0% on admin</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What's Included in the Report?</h2>
                        <p className="text-slate-400">More than just "Good job today".</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Topics Covered",
                                desc: "A bulleted list of every concept explaining during the session.",
                                icon: FileText
                            },
                            {
                                title: "Student Engagement",
                                desc: "AI analysis of how active and attentive the student was during class.",
                                icon: Sparkles
                            },
                            {
                                title: "Homework Assigned",
                                desc: "Automatically extracted action items and due dates for the next lesson.",
                                icon: Check
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
