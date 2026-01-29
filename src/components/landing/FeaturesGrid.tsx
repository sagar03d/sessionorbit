"use client";

import ScribeDemo from "./ScribeDemo";
import VoiceSupport from "./VoiceSupport";
import BandwidthToggle from "./BandwidthToggle";

export default function FeaturesGrid() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Everything you need to teach. <br className="hidden sm:block" />
                    <span className="text-orbit-cyan">Nothing you don't.</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    We stripped away the complexity of Zoom and Teams to build a dedicated OS for education.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
                {/* Large Feature - Scribe */}
                <ScribeDemo />

                {/* Medium Feature - Voice Support */}
                <VoiceSupport />

                {/* Medium Feature - Bandwidth */}
                <BandwidthToggle />

                {/* Feature 4 - Placeholder/Decor (Optional) */}
                <div className="relative group overflow-hidden rounded-3xl bg-slate-900/50 border border-white/10 p-6 backdrop-blur-xl transition-all hover:border-orbit-cyan/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo/5 to-orbit-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-white mb-1">Instant Replay</h3>
                            <p className="text-sm text-slate-400">Classes recorded in HD, searchable by transcript.</p>
                        </div>
                        <div className="mt-4 flex gap-1 items-end h-12 opacity-50">
                            <div className="w-2 bg-deep-indigo h-[60%] rounded-t-sm" />
                            <div className="w-2 bg-deep-indigo h-[40%] rounded-t-sm" />
                            <div className="w-2 bg-deep-indigo h-[80%] rounded-t-sm" />
                            <div className="w-2 bg-deep-indigo h-[30%] rounded-t-sm" />
                            <div className="w-2 bg-deep-indigo h-[50%] rounded-t-sm" />
                        </div>
                    </div>
                </div>

                {/* Feature 5 - CTA */}
                <div className="md:col-span-2 lg:col-span-1 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-deep-indigo to-orbit-cyan p-6 flex flex-col justify-center items-center text-center transition-transform hover:scale-[1.02]">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to upgrade?</h3>
                    <p className="text-white/80 mb-6 text-sm">Join 10,000+ teachers on SessionOrbit today.</p>
                    <button className="px-6 py-2 bg-white text-deep-indigo rounded-full font-bold text-sm hover:bg-stellar-white transition-colors">
                        Get Started Free
                    </button>
                </div>
            </div>
        </section>
    );
}
