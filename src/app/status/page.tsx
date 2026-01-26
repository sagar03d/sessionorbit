import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

export default function StatusPage() {
    const systems = [
        { name: "API", status: "operational" },
        { name: "Dashboard", status: "operational" },
        { name: "Live Classroom (Video/Audio)", status: "operational" },
        { name: "Whiteboard Engine", status: "operational" },
        { name: "Authentication Services", status: "operational" },
        { name: "Payment Processing", status: "operational" },
        { name: "Third-party Integrations", status: "degraded", message: "Minor latency with OpenAI API" },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational": return "text-emerald-400"
            case "degraded": return "text-amber-400"
            case "outage": return "text-red-400"
            default: return "text-slate-400"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational": return CheckCircle2
            case "degraded": return AlertCircle
            case "outage": return XCircle
            default: return CheckCircle2
        }
    }

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        All Systems Operational
                    </div>
                    <h1 className="text-4xl font-bold mb-4">System Status</h1>
                    <p className="text-slate-400">Current real-time status of SessionOrbit services.</p>
                </div>

                {/* Systems List */}
                <div className="space-y-4">
                    {systems.map((system, index) => {
                        const Icon = getStatusIcon(system.status)
                        const colorClass = getStatusColor(system.status)
                        return (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                <span className="font-medium">{system.name}</span>
                                <div className="flex items-center gap-3">
                                    {system.message && (
                                        <span className="hidden sm:inline-block text-xs text-slate-500">
                                            {system.message}
                                        </span>
                                    )}
                                    <div className={`flex items-center gap-2 ${colorClass}`}>
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium capitalize">{system.status}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* History Section Helper */}
                <div className="mt-12 pt-12 border-t border-white/10">
                    <h2 className="text-xl font-semibold mb-6">Past Incidents</h2>
                    <div className="space-y-8">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Jan 24, 2024</div>
                            <h3 className="font-medium text-amber-400 mb-2">Partial Degradation - Video Processing</h3>
                            <p className="text-sm text-slate-400">
                                We experienced slower than usual video processing times for approximately 45 minutes.
                                The issue has been identified and resolved.
                            </p>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Jan 10, 2024</div>
                            <h3 className="font-medium text-emerald-400 mb-2">Scheduled Maintenance</h3>
                            <p className="text-sm text-slate-400">
                                Completed scheduled database upgrades. No downtime occurred.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
