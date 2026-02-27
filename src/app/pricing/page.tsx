"use client"

import { Building2 } from "lucide-react"
import PricingTable from "@/components/pricing/PricingTable"
import ContactSalesDialog from "@/components/pricing/ContactSalesDialog"
import PricingCards from "@/components/pricing/PricingCards"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white selection:bg-indigo-500/30">

            <div className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 font-medium backdrop-blur-sm mb-6">
                        <span>SessionOrbit Pricing Model</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Plan for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Maximum Impact</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Whether you are a solo tutor or running a full galaxy of academies, we have a plan that scales with your ambition.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="mb-24 mt-8">
                    <PricingCards />
                </div>

                {/* Enterprise Section */}
                <div className="mb-24 relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                            <Building2 className="w-6 h-6 text-purple-400" />
                            Enterprise
                        </h3>
                        <p className="text-slate-400 max-w-xl">
                            For large education providers needing unlimited seats, custom integrations, SSO, and dedicated support.
                        </p>
                    </div>
                    <ContactSalesDialog>
                        <button className="px-8 py-4 rounded-xl font-semibold bg-white text-black hover:bg-slate-200 transition-colors whitespace-nowrap">
                            Contact Sales
                        </button>
                    </ContactSalesDialog>
                </div>

                <PricingTable />
            </div>
        </div>
    )
}
