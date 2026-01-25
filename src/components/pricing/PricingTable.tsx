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
        category: "Teaching & Classroom",
        items: [
            { name: "Live One-on-One Classes", free: true, pro: true, squad: true, tip: "Video, Audio, and Screen Sharing with ultra-low latency." },
            { name: "Interactive Whiteboard", free: true, pro: true, squad: true, tip: "Real-time collaborative canvas with pen, shapes, and media tools." },
            { name: "Group Classes (3+ students)", free: "40 min limit", pro: "Unlimited", squad: "Unlimited", tip: "Host larger classes. Free tier is capped at 40 minutes." },
            { name: "Cloud Recording", free: false, pro: true, squad: true, tip: "Automatically record and save sessions to the cloud for playback." },
            { name: "Custom Board Branding", free: false, pro: true, squad: true, tip: "Add your logo to the whiteboard and interface." },
        ]
    },
    {
        category: "AI & Automation",
        items: [
            { name: "AI Lesson Scribe Reports", free: "3 / mo", pro: "30 / mo", squad: "150 / mo (Pooled)", tip: "Automated summaries and insights generated after each class." },
            { name: "AI Tech Support Calls", free: "2 / mo", pro: "10 / mo", squad: "Unlimited", tip: "Instant AI troubleshooting for audio/video issues." },
            { name: "Smart Attendance Tracking", free: true, pro: true, squad: true, tip: "Automated logs of who joined and when." },
        ]
    },
    {
        category: "Management & Admin",
        items: [
            { name: "Tutor Accounts (Seats)", free: "1", pro: "1", squad: "5 Included", tip: "Number of teacher logins allowed." },
            { name: "Agency Dashboard", free: false, pro: false, squad: true, tip: "Centralized view of all tutors, schedules, and billing." },
            { name: "SSO & API Access", free: false, pro: false, squad: "Add-on", tip: "Connect with your existing LMS or Auth provider." },
        ]
    }
];

export default function PricingTable() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white">Compare Features</h2>
                <p className="mt-4 text-slate-400">Detailed breakdown of what is included in each orbit.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-4 sm:p-6 text-sm font-semibold text-white w-1/3">Feature</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-indigo-300 text-center w-1/5">Solo Navigator (Free)</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-amber-300 text-center w-1/5">Pro ($29)</th>
                            <th className="p-4 sm:p-6 text-sm font-bold text-purple-300 text-center w-1/5">Squad Orbit ($99)</th>
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

                                            {/* Pro */}
                                            <td className="p-4 text-primary text-center bg-indigo-500/5">
                                                <CellContent value={feature.pro} checkColor="text-amber-400" />
                                            </td>

                                            {/* Squad */}
                                            <td className="p-4 text-center bg-purple-500/5">
                                                <CellContent value={feature.squad} checkColor="text-purple-400" />
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
