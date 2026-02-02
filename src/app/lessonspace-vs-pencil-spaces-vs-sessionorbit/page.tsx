import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "SessionOrbit vs Lessonspace vs Pencil Spaces | The Best Tutoring Platform",
    description: "Compare SessionOrbit, Lessonspace, and Pencil Spaces. See why SessionOrbit is the best choice for modern tutors with AI reporting, engagement tracking, and superior reliability.",
};

export default function ComparisonPage() {
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
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8">
                        SessionOrbit vs Lessonspace vs Pencil Spaces: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                            The Definitive Comparison
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Choosing the right whiteboard is critical for your tutoring business. Here is how the top contenders stack up.
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto mb-20">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-slate-400 font-normal">Feature</th>
                                <th className="p-4 text-white font-bold text-xl bg-indigo-500/10 rounded-t-xl border-t border-x border-indigo-500/20 min-w-[200px]">SessionOrbit</th>
                                <th className="p-4 text-slate-300 font-semibold min-w-[180px]">Pencil Spaces</th>
                                <th className="p-4 text-slate-300 font-semibold min-w-[180px]">Lessonspace</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="p-4 text-slate-300">AI Lesson Reports</td>
                                <td className="p-4 bg-indigo-500/5 border-x border-indigo-500/10 text-emerald-400 font-medium"><Check size={20} className="inline mr-2" /> Yes, Automatic</td>
                                <td className="p-4 text-slate-500"><X size={20} className="inline mr-2" /> No</td>
                                <td className="p-4 text-slate-500"><X size={20} className="inline mr-2" /> No</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">Engagement Tracking</td>
                                <td className="p-4 bg-indigo-500/5 border-x border-indigo-500/10 text-emerald-400 font-medium"><Check size={20} className="inline mr-2" /> Real-time Score</td>
                                <td className="p-4 text-slate-400"><Minus size={20} className="inline mr-2" /> Basic</td>
                                <td className="p-4 text-slate-500"><X size={20} className="inline mr-2" /> No</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">Free Tier</td>
                                <td className="p-4 bg-indigo-500/5 border-x border-indigo-500/10 text-emerald-400 font-medium"><Check size={20} className="inline mr-2" /> Generous</td>
                                <td className="p-4 text-slate-400"><Check size={20} className="inline mr-2" /> Limited</td>
                                <td className="p-4 text-slate-300"><Check size={20} className="inline mr-2" /> Trial Only</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">Video Quality</td>
                                <td className="p-4 bg-indigo-500/5 border-x border-indigo-500/10 text-white">Full HD (1080p)</td>
                                <td className="p-4 text-slate-400">HD (720p)</td>
                                <td className="p-4 text-slate-400">SD (480p)</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">Interactive Tools</td>
                                <td className="p-4 bg-indigo-500/5 border-x border-indigo-500/10 text-white">Advanced + AI</td>
                                <td className="p-4 text-slate-400">Standard</td>
                                <td className="p-4 text-slate-400">Standard</td>
                            </tr>
                            {/* Bottom Row Rounded */}
                            <tr>
                                <td className="p-4"></td>
                                <td className="p-4 bg-indigo-500/5 border-b border-x border-indigo-500/10 rounded-b-xl"></td>
                                <td className="p-4"></td>
                                <td className="p-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Verdict Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-24">
                    <h2 className="text-3xl font-bold text-white mb-6">The Verdict</h2>
                    <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                        <p>
                            While <strong>Lessonspace</strong> is a solid legacy option and <strong>Pencil Spaces</strong> offers good basic tools, <strong>SessionOrbit</strong> is built for the future of education.
                        </p>
                        <p>
                            Only SessionOrbit leverages AI to handle the administrative burden of tutoring—automating reports, tracking engagement, and providing deep insights into student performance. If you want to just "teach", use the others. If you want to <strong>grow your business and save time</strong>, choose SessionOrbit.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors">
                            Switch to SessionOrbit
                        </Link>
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
