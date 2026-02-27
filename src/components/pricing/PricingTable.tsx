"use client";

import React, { Fragment } from "react";
import { Check, Minus, HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePricing } from "@/contexts/PricingContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const features = [
    {
        category: "Teaching Limits",
        items: [
            { name: "Classroom Hours", free: "2 Hours / mo", starter: "25 Hours / mo", pro: "100 Hours / mo", agency: "400 Hours / mo", tip: "Total duration of hosted sessions per month." },
            { name: "AI Scribe Reports", free: "2 Reports / mo", starter: "25 Reports / mo", pro: "100 Reports / mo", agency: "400 Reports / mo", tip: "Automated lesson summaries and analytics." },
            { name: "Overage Fee", free: "N/A (Upgrade)", starter: "$0.80 / hour", pro: "$1.25 / hour", agency: "$1.10 / hour", tip: "Cost per additional hour after limit is reached." },
            { name: "Monthly Reset", free: "Every 30 days", starter: "Every 30 days", pro: "Every 30 days", agency: "Every 30 days", tip: "Usage counters reset at the start of your billing cycle." },
        ]
    },
    {
        category: "Features",
        items: [
            { name: "Interactive Whiteboard", free: true, starter: true, pro: true, agency: true, tip: "Real-time collaborative canvas." },
            { name: "Cloud Recording", free: false, starter: "Included", pro: "Included", agency: "Included", tip: "Save sessions to the cloud." },
            { name: "AI Tech Support", free: "Basic", starter: "Standard", pro: "Full AI Support", agency: "Priority AI Support", tip: "Access to our AI helper for technical issues." },
        ]
    },
    {
        category: "Growth",
        items: [
            { name: "Custom Branding", free: false, starter: false, pro: true, agency: true, tip: "Add your logo to the classroom." },
            { name: "Agency Dashboard", free: false, starter: false, pro: false, agency: true, tip: "Manage multiple tutors and students." },
        ]
    }
];

// Helper to get dynamic value
const getFeatureValue = (feature: any, tier: 'free' | 'starter' | 'pro' | 'agency', prices: any, currency: any) => {
    if (feature.name === "Overage Fee" && tier !== 'free') {
        return prices.overage[tier];
    }
    return feature[tier];
}

export default function PricingTable() {
    const { currency, prices, format } = usePricing();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12 relative">
                <h2 className="text-3xl font-bold text-white">Compare Plans</h2>
                <p className="mt-4 text-slate-400">Find the right teaching power for your needs.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-4 sm:p-6 text-sm font-semibold text-white w-1/4">Feature</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-indigo-300 text-center w-3/16">Discovery (Free)</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-emerald-300 text-center w-3/16">Starter ({format(prices.starter.price)})</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-amber-300 text-center w-3/16">Professional ({format(prices.pro.price)})</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-purple-300 text-center w-3/16">Agency ({format(prices.agency.price)})</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#0B0C15]">
                        <TooltipProvider delayDuration={0}>
                            {features.map((category, catIdx) => (
                                <Fragment key={category.category}>
                                    <tr key={category.category} className="bg-white/5">
                                        <td colSpan={4} className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            {category.category}
                                        </td>
                                    </tr>
                                    {category.items.map((feature, featIdx) => (
                                        <tr key={feature.name} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 sm:p-6 text-sm text-slate-300 flex items-center gap-2">
                                                {feature.name}
                                                {feature.tip && (
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border border-white/10 text-slate-200">
                                                            <p className="max-w-xs">{feature.tip}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </td>

                                            {/* Free */}
                                            <td className="p-4 text-center">
                                                <CellContent value={feature.free} />
                                            </td>

                                            {/* Starter */}
                                            <td className="p-4 text-center bg-emerald-500/5">
                                                <CellContent value={getFeatureValue(feature, 'starter', prices, currency)} checkColor="text-emerald-400" />
                                            </td>

                                            {/* Professional */}
                                            <td className="p-4 text-primary text-center bg-indigo-500/5">
                                                <CellContent value={getFeatureValue(feature, 'pro', prices, currency)} checkColor="text-amber-400" />
                                            </td>

                                            {/* Agency */}
                                            <td className="p-4 text-center bg-purple-500/5">
                                                <CellContent value={getFeatureValue(feature, 'agency', prices, currency)} checkColor="text-purple-400" />
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </TooltipProvider>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CellContent({ value, checkColor = "text-indigo-400" }: { value: string | boolean | undefined, checkColor?: string }) {
    if (value === true) {
        return (
            <div className="flex justify-center">
                <Check className={`w-5 h-5 ${checkColor}`} />
            </div>
        );
    }
    if (value === false) {
        return (
            <div className="flex justify-center">
                <Minus className="w-5 h-5 text-slate-700" />
            </div>
        );
    }
    return <span className="text-sm font-medium text-slate-200">{value}</span>;
}
