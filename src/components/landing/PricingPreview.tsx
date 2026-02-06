"use client"

import { Check, Sparkles, Rocket, Crown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { CLIENT_PAYMENT_CONFIG } from "@/lib/client-payment-config"

export default function PricingPreview() {
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

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            description: "For casual tutors.",
            icon: Sparkles,
            features: [
                "2 Hours / month",
                "2 AI Reports / month",
                "Basic Tech Support",
                "Standard Whiteboard"
            ],
            cta: "Get Started",
            popular: false,
            action: () => router.push('/signup'),
            productId: null
        },
        {
            name: "Starter",
            price: "$19",
            period: "/month",
            description: "Serious tutors scaling up.",
            icon: Rocket,
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: $1.25/hr",
                "Full AI Tech Support"
            ],
            cta: "Start Free Trial",
            popular: true,
            productId: CLIENT_PAYMENT_CONFIG.productIds.starter
        },
        {
            name: "Pro",
            price: "$79",
            period: "/month",
            description: "Agencies & Power Users.",
            icon: Crown,
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: $1.10/hr",
                "Priority AI Support"
            ],
            cta: "Start Free Trial",
            popular: false,
            productId: CLIENT_PAYMENT_CONFIG.productIds.pro
        }
    ]

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const Icon = plan.icon
                    const isLoading = loadingProduct !== null && loadingProduct === plan.productId;

                    return (
                        <div key={index} className={`relative group ${plan.popular ? 'md:-mt-4' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className={`relative bg-slate-900/50 border ${plan.popular ? 'border-indigo-500/50' : 'border-white/10'} rounded-2xl p-8 backdrop-blur-xl hover:border-indigo-500/30 transition-all ${plan.popular ? 'shadow-2xl shadow-indigo-500/20' : ''}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${plan.popular ? 'bg-indigo-500/10' : 'bg-white/5'} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${plan.popular ? 'text-indigo-400' : 'text-slate-400'}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-sm text-slate-400">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-400">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                            <span className="text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => {
                                        if (plan.productId) {
                                            handleCheckout(plan.productId);
                                        } else if (plan.action) {
                                            plan.action();
                                        }
                                    }}
                                    disabled={isLoading}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {plan.cta}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <p className="text-center text-slate-500 text-sm mt-8">
                All plans include 7-day free trial.
            </p>
        </section>
    )
}
