"use client"

import { Book, Code, GraduationCap, PlayCircle, Search, Shield, Zap } from "lucide-react"

export default function DocumentationPage() {
    const categories = [
        {
            title: "Getting Started",
            icon: PlayCircle,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            links: ["Introduction to SessionOrbit", "System Requirements", "Quick Start Guide", "Account Setup"]
        },
        {
            title: "For Teachers",
            icon: GraduationCap,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            links: ["Creating Your First Class", "Managing Students", "Using the Whiteboard", "Recording Sessions"]
        },
        {
            title: "API Reference",
            icon: Code,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            links: ["Authentication", "Room Management", "Webhooks", "SDK Documentation"]
        },
        {
            title: "Security & Privacy",
            icon: Shield,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            links: ["Data Protection", "GDPR Compliance", "Access Control", "Audit Logs"]
        }
    ]

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                        Documentation
                    </h1>
                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                            placeholder="Search docs..."
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {categories.map((category, index) => (
                        <div key={index} className="rounded-2xl bg-slate-900/50 border border-white/10 p-8 hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center`}>
                                    <category.icon className={`w-6 h-6 ${category.color}`} />
                                </div>
                                <h2 className="text-2xl font-bold">{category.title}</h2>
                            </div>
                            <ul className="space-y-3">
                                {category.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors group">
                                            <Book className="w-4 h-4 mr-3 opacity-50 group-hover:opacity-100" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center">
                                    View all guides <Zap className="w-3 h-3 ml-1" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help Bar */}
                <div className="mt-16 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 border border-white/10 text-center">
                    <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
                    <p className="text-slate-400 mb-6">Our support team is just a click away.</p>
                    <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    )
}
