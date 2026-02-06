"use client";

import React, { Fragment } from "react";
import { Check, Minus, HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const features = [
    {
        category: "Teaching Limits",
        items: [
            { name: "Classroom Hours", free: "2 Hours / mo", starter: "20 Hours / mo", pro: "80 Hours / mo", tip: "Total duration of hosted sessions per month." },
            { name: "AI Scribe Reports", free: "2 Reports / mo", starter: "20 Reports / mo", pro: "80 Reports / mo", tip: "Automated lesson summaries and analytics." },
            { name: "Overage Fee", free: "N/A (Upgrade)", starter: "$1.25 / hour", pro: "$1.10 / hour", tip: "Cost per additional hour after limit is reached." },
            { name: "Monthly Reset", free: "Every 30 days", starter: "Every 30 days", pro: "Every 30 days", tip: "Usage counters reset at the start of your billing cycle." },
        ]
    },
    {
        category: "Features",
        items: [
            { name: "Interactive Whiteboard", free: true, starter: true, pro: true, tip: "Real-time collaborative canvas." },
            { name: "Cloud Recording", free: false, starter: "Included", pro: "Included", tip: "Save sessions to the cloud." },
            { name: "AI Tech Support", free: "Basic", starter: "Full AI Support", pro: "Priority AI Support", tip: "Access to our AI helper for technical issues." },
        ]
    },
    {
        category: "Growth",
        items: [
            { name: "Custom Branding", free: false, starter: false, pro: true, tip: "Add your logo to the classroom." },
            { name: "Agency Dashboard", free: false, starter: false, pro: true, tip: "Manage multiple tutors and students." },
        ]
    }
];

export default function PricingTable() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white">Compare Plans</h2>
                <p className="mt-4 text-slate-400">Find the right teaching power for your needs.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-4 sm:p-6 text-sm font-semibold text-white w-1/3">Feature</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-indigo-300 text-center w-1/5">Free (Basic)</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-amber-300 text-center w-1/5">Starter ($19)</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-purple-300 text-center w-1/5">Pro ($79)</th>
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
                                            <td className="p-4 text-primary text-center bg-indigo-500/5">
                                                <CellContent value={feature.starter} checkColor="text-amber-400" />
                                            </td>

                                            {/* Pro */}
                                            <td className="p-4 text-center bg-purple-500/5">
                                                <CellContent value={feature.pro} checkColor="text-purple-400" />
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
