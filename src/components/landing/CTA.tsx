"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTA() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 md:p-16 text-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Teaching?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of educators who've already upgraded to SessionOrbit. Start your free trial today—no credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20">
                            View Pricing
                        </Link>
                    </div>

                    <p className="text-sm text-indigo-200 mt-6">
                        ✓ 14-day free trial &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    )
}
