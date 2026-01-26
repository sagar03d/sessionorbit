"use client"

import { TrendingUp, Users, Clock, Zap } from "lucide-react"

export default function Stats() {
    const stats = [
        {
            icon: Users,
            value: "10,000+",
            label: "Active Teachers",
            color: "indigo"
        },
        {
            icon: Clock,
            value: "500K+",
            label: "Hours Taught",
            color: "purple"
        },
        {
            icon: TrendingUp,
            value: "98%",
            label: "Satisfaction Rate",
            color: "emerald"
        },
        {
            icon: Zap,
            value: "45min",
            label: "Avg. Time Saved",
            color: "amber"
        }
    ]

    const colorClasses = {
        indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
        purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400",
        emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
        amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400"
    }

    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const colorClass = colorClasses[stat.color as keyof typeof colorClasses]

                    return (
                        <div key={index} className={`relative group bg-gradient-to-br ${colorClass} border rounded-2xl p-6 backdrop-blur-xl transition-all hover:scale-105`}>
                            <Icon className="w-8 h-8 mb-4 opacity-50" />
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
