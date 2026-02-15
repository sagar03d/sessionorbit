import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Briefcase, BarChart, Users } from "lucide-react";
import CTA from "@/components/landing/CTA";

export const metadata: Metadata = {
    title: "Best Tutor Management System Software | SessionOrbit",
    description: "Streamline your tutoring agency with SessionOrbit's tutor management system. Manage tutors, students, scheduling, and billing in one powerful dashboard.",
};

export default function TutorManagementPage() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 font-medium mb-8">
                        <Briefcase size={14} />
                        <span>For Agencies & Solo Tutors</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Effortless <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                            Tutor Management System
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop juggling spreadsheets. SessionOrbit provides a central hub to manage your tutors, students, lessons, and finances with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-blue-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            Get Organized Free
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Core Management Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {[
                        {
                            title: "Student CRM",
                            desc: "Keep detailed records of every student, including lesson history, progress reports, and payment status.",
                            icon: <Users className="text-blue-400" />
                        },
                        {
                            title: "Scheduling Engine",
                            desc: "Drag-and-drop calendar for easy scheduling. Handle recurring lessons and timezone conflicts automatically.",
                            icon: <Briefcase className="text-cyan-400" />
                        },
                        {
                            title: "Performance Analytics",
                            desc: "Track tutor performance, student retention, and revenue growth with intuitive charts and reports.",
                            icon: <BarChart className="text-indigo-400" />
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Dashboard Preview Section (Conceptual) */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-1 overflow-hidden relative mb-24">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    <div className="p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Your Business Control Center</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                            Everything you need to manage your education business is just one click away. From automated invoicing to lesson quality control.
                        </p>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
                            {[
                                "Automated Invoicing",
                                "Tutor Payroll",
                                "Lesson Recording Archive",
                                "Parent Portal",
                                "White-label Options",
                                "Email Notifications",
                                "Calendar Sync",
                                "Role-based Access"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <Check size={16} className="text-blue-400 shrink-0" />
                                    <span className="text-sm text-slate-300">{feature}</span>
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
