"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { CollaborationGraphic } from "../illustrations/CollaborationGraphic"

export default function CTA() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-deep-indigo to-orbit-cyan p-12 md:p-16 text-center shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                {/* Decorative Graphics - using opacity and blend modes for visibility */}
                <div className="absolute -top-10 -right-10 w-[300px] h-[300px] opacity-10 pointer-events-none rotate-12 mix-blend-overlay">
                    <CollaborationGraphic />
                </div>
                <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] opacity-5 pointer-events-none -rotate-12 scale-x-[-1] mix-blend-overlay">
                    <CollaborationGraphic />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Teaching?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
                        Join thousands of educators who've already upgraded to SessionOrbit. Start your free trial today—no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-deep-indigo rounded-full font-bold hover:bg-stellar-white transition-all transform hover:scale-105 shadow-xl"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                        >
                            View Pricing
                        </Link>
                    </div>

                    <p className="text-sm text-white/70 mt-6 font-medium">
                        ✓ 7-day free trial • ✓ Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    )
}