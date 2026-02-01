"use client"

import { Users, Target, Globe, Award, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
    const stats = [
        { label: "Active Teachers", value: "10K+", icon: Users },
        { label: "Hours Taught", value: "500K+", icon: ClockIcon },
        { label: "Countries", value: "50+", icon: Globe },
        { label: "Satisfaction", value: "99%", icon: Award },
    ]

    const team = [
        { name: "Sarah Chen", role: "CEO & Co-founder", image: "/avatars/1.png" }, // Placeholders
        { name: "Marcus Rodriguez", role: "CTO", image: "/avatars/2.png" },
        { name: "Emma Wilson", role: "Head of Product", image: "/avatars/3.png" },
    ]

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="relative max-w-7xl mx-auto px-6 text-center lg:px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>Our Story</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
                        Reimagining the Future of <br className="hidden sm:block" />
                        <span className="text-indigo-400">Online Education</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
                        We're on a mission to empower educators with tools that feel like magic, making virtual classrooms as engaging and effective as physical ones.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Built for Teachers, by Teachers</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-6">
                                SessionOrbit wasn't born in a boardroom. It started in a classroom where we realized the existing tools just weren't cutting it. We needed a platform that didn't just connect video, but actually facilitated learning.
                            </p>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Today, thousands of educators use our platform to deliver world-class learning experiences, backed by AI that handles the boring stuff so they can focus on teaching.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <Card key={index} className="bg-slate-800/50 border-white/10 backdrop-blur">
                                    <CardContent className="p-6 text-center">
                                        <div className="mx-auto w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                                            <stat.icon className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-slate-400">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-16">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Students First", desc: "Every feature we build starts with one question: Does this help students learn better?" },
                            { title: "Simplicity", desc: "Technology should be invisible. We design for flow, not friction." },
                            { title: "Global Access", desc: "Education knows no borders. We engineer for low latency everywhere." }
                        ].map((value, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors">
                                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                                <p className="text-slate-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
