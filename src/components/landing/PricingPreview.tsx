"use client"

import { Check, Sparkles, Rocket, Crown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { CLIENT_PAYMENT_CONFIG } from "@/lib/client-payment-config"
import { usePricing } from "@/contexts/PricingContext"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

import PricingCards from "@/components/pricing/PricingCards"

export default function PricingPreview() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Choose the plan that fits your growth.
                </p>
            </div>

            <PricingCards />

            <p className="text-center text-slate-500 text-sm mt-8">
                All plans include 7-day free trial.
            </p>
        </section>
    )
}
