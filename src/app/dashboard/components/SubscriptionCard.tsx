"use client"

import { Button } from "@/components/ui/button"
import { Zap, Clock, ShieldCheck, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface SubscriptionCardProps {
    plan: string
    expiry?: string
    usage: number
    maxUsage: number
}

export default function SubscriptionCard({ plan, expiry, hoursUsed, maxHours, reportsUsed, maxReports }: {
    plan: string
    expiry?: string
    hoursUsed: number
    maxHours: number
    reportsUsed: number
    maxReports: number
}) {
    const router = useRouter()

    // Percentage Calcs
    const hoursPercent = Math.min((hoursUsed / maxHours) * 100, 100)
    const reportsPercent = Math.min((reportsUsed / maxReports) * 100, 100)

    // Overage Checks
    const isHoursOverage = hoursUsed > maxHours
    const isReportsOverage = reportsUsed > maxReports

    const colors = {
        Free: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
        Starter: "from-amber-500/20 to-orange-500/20 border-amber-500/30", // Replaced Pro with Starter colors
        Pro: "from-purple-500/20 to-indigo-500/20 border-purple-500/30" // Replaced Squad with Pro colors
    }

    const currentColors = colors[plan as keyof typeof colors] || colors.Free

    return (
        <div className={`rounded-3xl border ${currentColors} bg-gradient-to-br p-6 space-y-6 backdrop-blur-sm self-stretch flex flex-col justify-between`}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white/10">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400 font-medium">Active Plan</p>
                            <h3 className="text-xl font-bold text-white">{plan}</h3>
                        </div>
                    </div>
                    {plan === "Free" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 gap-1 rounded-full px-4"
                            onClick={() => router.push('/pricing')}
                        >
                            Upgrade <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Hours Usage */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Classroom Hours</span>
                        <span className={`font-medium ${isHoursOverage ? 'text-amber-400' : 'text-white'}`}>
                            {hoursUsed.toFixed(1)} / {maxHours} Hours
                        </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <div
                            className={`h-full transition-all duration-500 ${isHoursOverage ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${hoursPercent}%` }}
                        />
                    </div>
                    {isHoursOverage && (
                        <p className="text-xs text-amber-400 text-right">Overage Active: ${(hoursUsed - maxHours).toFixed(1)} billed</p>
                    )}
                </div>

                {/* Reports Usage */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">AI Scribe Reports</span>
                        <span className={`font-medium ${isReportsOverage ? 'text-amber-400' : 'text-white'}`}>
                            {reportsUsed} / {maxReports} Reports
                        </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <div
                            className={`h-full transition-all duration-500 ${isReportsOverage ? 'bg-amber-500' : 'bg-purple-500'}`}
                            style={{ width: `${reportsPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span>{expiry ? `Renews on ${new Date(expiry).toLocaleDateString()}` : "Lifetime Access"}</span>
                </div>
                {plan !== "Free" && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Active</span>
                    </div>
                )}
            </div>
        </div>
    )
}
