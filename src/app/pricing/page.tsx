"use client"

import { Check, Star, Zap, Building2, HelpCircle, Loader2, Sparkles, Rocket, Crown } from "lucide-react"
import PricingTable from "@/components/pricing/PricingTable"
import ContactSalesDialog from "@/components/pricing/ContactSalesDialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

import { CLIENT_PAYMENT_CONFIG } from "@/lib/client-payment-config"

export default function PricingPage() {
    const router = useRouter()
    const [loadingProduct, setLoadingProduct] = useState<string | null>(null)

    const handleCheckout = async (productId: string) => {
        setLoadingProduct(productId)

        // Save intended plan for immediate activation on return
        const planMap: Record<string, string> = {
            [CLIENT_PAYMENT_CONFIG.productIds.pro!]: 'Pro',
            [CLIENT_PAYMENT_CONFIG.productIds.squad!]: 'Squad'
        };
        const planName = planMap[productId] || 'Free';
        localStorage.setItem('intended_plan', planName);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_cart: [{ product_id: productId, quantity: 1 }],
                    customer: session?.user ? {
                        name: session.user.user_metadata?.full_name || session.user.email,
                        email: session.user.email,
                    } : undefined,
                    metadata: {
                        userId: session?.user?.id
                    }
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON:", text);
                // If it starts with "Invalid checkout", it's likely a library error message
                throw new Error(text);
            }

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error('No checkout URL returned', data);
                alert("Error: " + (data.message || "Could not create checkout session"));
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert("Checkout error. Please check console.");
        } finally {
            setLoadingProduct(null)
        }
    }

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Free Plan */}
                    <div className="relative group">
                        <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Free</h3>
                                    <p className="text-sm text-slate-400">For casual tutors.</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-slate-400">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {[
                                    "2 Hours / month",
                                    "2 AI Reports / month",
                                    "Basic Tech Support",
                                    "Standard Whiteboard"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => router.push('/signup')}
                                className="block w-full text-center py-3 rounded-xl font-semibold transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Starter Plan */}
                    <div className="relative group md:-mt-4">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full z-10">
                            MOST POPULAR
                        </div>
                        <div className="relative bg-slate-900/50 border border-indigo-500/50 rounded-2xl p-8 backdrop-blur-xl hover:border-indigo-500/30 transition-all shadow-2xl shadow-indigo-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <Rocket className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Starter</h3>
                                    <p className="text-sm text-slate-400">Serious tutors scaling up.</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$19</span>
                                <span className="text-slate-400">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {[
                                    "20 Hours / month",
                                    "20 AI Reports / month",
                                    "Overage: $1.25/hr",
                                    "Full AI Tech Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(CLIENT_PAYMENT_CONFIG.productIds.starter!)}
                                disabled={loadingProduct === CLIENT_PAYMENT_CONFIG.productIds.starter}
                                className="w-full text-center py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center justify-center gap-2"
                            >
                                {loadingProduct === CLIENT_PAYMENT_CONFIG.productIds.starter && <Loader2 className="w-4 h-4 animate-spin" />}
                                Start Free Trial
                            </button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative group">
                        <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Crown className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Pro</h3>
                                    <p className="text-sm text-slate-400">Agencies & Power Users.</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$79</span>
                                <span className="text-slate-400">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {[
                                    "80 Hours / month",
                                    "80 AI Reports / month",
                                    "Overage: $1.10/hr",
                                    "Priority AI Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(CLIENT_PAYMENT_CONFIG.productIds.pro!)}
                                disabled={loadingProduct === CLIENT_PAYMENT_CONFIG.productIds.pro}
                                className="w-full text-center py-3 rounded-xl font-semibold transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center gap-2"
                            >
                                {loadingProduct === CLIENT_PAYMENT_CONFIG.productIds.pro && <Loader2 className="w-4 h-4 animate-spin" />}
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enterprise Section */}
                <div className="mt-12 mb-24 relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
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
