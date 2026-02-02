"use client"

import { Check, Star, Zap, Building2, HelpCircle, Loader2 } from "lucide-react"
import Header from "@/app/components/Header"
import PricingTable from "@/components/pricing/PricingTable"
import ContactSalesDialog from "@/components/pricing/ContactSalesDialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function PricingPage() {
    const router = useRouter()
    const [loadingProduct, setLoadingProduct] = useState<string | null>(null)

    const handleCheckout = async (productId: string) => {
        setLoadingProduct(productId)

        // Save intended plan for immediate activation on return
        const planMap: Record<string, string> = {
            'pdt_0NX38bnP007wsa0DDEwb6': 'Pro',
            'pdt_0NX38hVNQLfyPmhCBbvfB': 'Squad'
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
            <Header />

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

            {/* Config & Tiers */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Starter */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 relative hover:border-indigo-500/30 transition-colors group flex flex-col">
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Star className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                            <p className="text-sm text-slate-400 h-10">Solo Tutors starting out.</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$9</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <p className="text-xs text-indigo-300 mt-1 font-medium">1 Tutor Seat</p>
                        </div>

                        <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>5 AI-Scribe Reports / mo</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Basic Focus Orbit Stats</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>24/7 AI Helper Support</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>Unlimited 1-on-1 classes</span>
                            </li>
                        </ul>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleCheckout('pdt_starter')} // Placeholder ID
                                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                            >
                                Start Trial
                            </button>
                        </div>
                    </div>

                    {/* Pro */}
                    <div className="rounded-2xl border border-indigo-500/50 bg-[#16182e] p-8 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/20 flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white">
                            MOST POPULAR
                        </div>
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-sm text-slate-400 h-10">Small-to-Mid Tutoring Agencies.</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$79</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <p className="text-xs text-indigo-300 mt-1 font-medium">Up to 5 Tutors ($15.80/seat)</p>
                        </div>

                        <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span><strong className="text-white">Unlimited</strong> AI Scribe Reports</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span><strong className="text-white">Deep Analytics</strong> Dashboard</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>AI Helper + Email Tech Support</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>Unlimited Class History</span>
                            </li>
                        </ul>

                        <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20 mb-8">
                            <p className="text-xs text-indigo-200 leading-relaxed italic">
                                "The sweet spot for growing agencies. Manage your team and get deep insights."
                            </p>
                        </div>

                        <button
                            onClick={() => handleCheckout('pdt_0NX38bnP007wsa0DDEwb6')}
                            disabled={loadingProduct === 'pdt_0NX38bnP007wsa0DDEwb6'}
                            className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {loadingProduct === 'pdt_0NX38bnP007wsa0DDEwb6' && <Loader2 className="w-4 h-4 animate-spin" />}
                            Start Free Trial
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 relative hover:border-indigo-500/30 transition-colors group flex flex-col">
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                            <p className="text-sm text-slate-400 h-10">Large Education Providers.</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">Custom</span>
                            </div>
                            <p className="text-xs text-purple-300 mt-1 font-medium">Contact Sales</p>
                        </div>

                        <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>Unlimited + Custom Templates</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>Unlimited / Custom Seats</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>Historical Performance Audits</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>Dedicated Account Manager</span>
                            </li>
                            <li className="flex gap-3">
                                <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                <span>Custom Integration & SSO</span>
                            </li>
                        </ul>

                        <ContactSalesDialog>
                            <button className="w-full mt-auto py-3 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold transition-colors">
                                Contact Sales
                            </button>
                        </ContactSalesDialog>
                    </div>
                </div>

                <PricingTable />

                {/* Nudge Strategy Box */}
                <div className="mt-12 p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20">
                    <div className="bg-[#0B0C15] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="p-4 bg-amber-500/10 rounded-full text-amber-500 shrink-0">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-white mb-2">The "Orbital Scarcity" Nudge</h4>
                            <p className="text-slate-400 italic">
                                "Your AI Scribe is taking a break. You've saved 3 hours this month with automated reports—upgrade to Pro to keep the admin off your plate."
                            </p>
                            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Triggered after 4th class/month for Free users</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
