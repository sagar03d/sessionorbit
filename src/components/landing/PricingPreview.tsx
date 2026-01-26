"use client"

import { Check, Sparkles, Rocket, Crown } from "lucide-react"
import Link from "next/link"

export default function PricingPreview() {
    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for individual tutors",
            icon: Sparkles,
            features: [
                "Up to 50 hours/month",
                "AI Lesson Scribe",
                "Basic analytics",
                "Email support"
            ],
            cta: "Start Free Trial",
            popular: false
        },
        {
            name: "Professional",
            price: "$79",
            period: "/month",
            description: "For serious educators",
            icon: Rocket,
            features: [
                "Unlimited hours",
                "All AI features",
                "Advanced analytics",
                "Priority support",
                "Custom branding"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Agency",
            price: "Custom",
            period: "",
            description: "For tutoring agencies",
            icon: Crown,
            features: [
                "Everything in Pro",
                "Multi-tutor management",
                "White-label option",
                "Dedicated account manager",
                "Custom integrations"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ]

    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Start free, upgrade when you're ready. No hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const Icon = plan.icon
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

                                <Link href="/signup" className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            <p className="text-center text-slate-500 text-sm mt-8">
                All plans include 14-day free trial. No credit card required.
            </p>
        </section>
    )
}
