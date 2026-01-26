import { Shield, Lock, Server, FileCheck, Eye, RefreshCw } from "lucide-react"

export default function SecurityPage() {
    const features = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "All data in transit and at rest is encrypted using industry-standard protocols (AES-256)."
        },
        {
            icon: Shield,
            title: "SOC 2 Type II Compliant",
            description: "We successfully complete annual SOC 2 Type II audits to ensure your data is secure."
        },
        {
            icon: Server,
            title: "Secure Infrastructure",
            description: "Hosted on AWS with multi-region redundancy and breakdown protection."
        },
        {
            icon: FileCheck,
            title: "GDPR & CCPA Ready",
            description: "Fully compliant with global privacy regulations giving you control over your data."
        },
        {
            icon: Eye,
            title: "24/7 Monitoring",
            description: "Continuous automated security scanning and real-time threat detection."
        },
        {
            icon: RefreshCw,
            title: "Regular Backups",
            description: "Automatic hourly backups with 30-day retention for instant disaster recovery."
        }
    ]

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                        Enterprise-Grade Security
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Your data security is our top priority. We use banking-grade encryption and
                        adhere to the strictest compliance standards.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Have specific security questions?</h2>
                    <p className="text-slate-400 mb-6">
                        Our security team is here to help with any compliance questionnaires or audits.
                    </p>
                    <a
                        href="mailto:security@sessionorbit.com"
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                    >
                        Contact Security Team
                    </a>
                </div>
            </div>
        </div>
    )
}
