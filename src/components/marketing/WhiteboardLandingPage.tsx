import Link from "next/link";
import { ArrowRight, Check, Zap, Globe, Lock } from "lucide-react";
import CTA from "@/components/landing/CTA";
import { translations, Language } from "@/lib/translations/whiteboard";

interface WhiteboardLandingPageProps {
    lang?: Language;
}

export default function WhiteboardLandingPage({ lang = 'en' }: WhiteboardLandingPageProps) {
    const t = translations[lang]?.marketing || translations.en.marketing;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium mb-8">
                        <Zap size={14} />
                        <span>{t.badge}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        {t.h1_main} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                            {t.h1_span}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t.p_hero}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Link href="/signup" className="h-14 px-8 rounded-full bg-white text-emerald-950 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 group text-lg">
                            {t.get_started}
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* What You Get For Free */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">{t.why_free_h2}</h2>
                        <p className="text-slate-400">{t.why_free_p}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {t.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Check size={16} className="text-emerald-400" />
                                </div>
                                <span className="text-lg text-slate-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Free? Section */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/20 rounded-3xl p-8 md:p-12 mb-24 text-center">
                    <div className="inline-block p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
                        <Globe size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6">{t.why_give_away_h2}</h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        {t.why_give_away_p}
                    </p>
                    <div className="flex justify-center gap-8 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Lock size={16} />
                            <span>{t.no_ads}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock size={16} />
                            <span>{t.no_data_selling}</span>
                        </div>
                    </div>
                </div>

                <CTA />
            </div>
        </main>
    );
}
