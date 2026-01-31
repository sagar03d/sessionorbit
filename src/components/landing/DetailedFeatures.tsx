import Image from "next/image";
import {
    Layout,
    Zap,
    ShieldCheck,
    Globe,
    Palette,
    BarChart3
} from "lucide-react";

const features = [
    {
        icon: Layout,
        title: "Interactive Whiteboard",
        description: "An infinite canvas for you and your students. Draw, type, and collaborate in real-time with zero lag.",
        gradient: "from-blue-500/20 to-cyan-500/20",
        image: "/feature-demos/whiteboard.png"
    },
    {
        icon: Zap,
        title: "AI-Powered Summaries",
        description: "Never miss a beat. Our AI automatically generates concise class notes, action items, and highlight reels.",
        gradient: "from-amber-500/20 to-orange-500/20",
        image: "/feature-demos/ai-summary.png"
    },
    {
        icon: BarChart3,
        title: "Student Analytics",
        description: "Gain deep insights into potential bottlenecks. Track engagement, attendance, and participation trends.",
        gradient: "from-emerald-500/20 to-green-500/20",
        image: "/feature-demos/analytics.png"
    },
    {
        icon: ShieldCheck,
        title: "Link-Layer Security",
        description: "Enterprise-grade protection for your virtual classrooms. End-to-end encryption ensures your data stays private.",
        gradient: "from-violet-500/20 to-purple-500/20",
        image: "/feature-demos/security.svg"
    },
    {
        icon: Palette,
        title: "Custom Branding",
        description: "Make it yours. Customize the interface with your school's logo, colors, and domain for a seamless experience.",
        gradient: "from-pink-500/20 to-rose-500/20",
        image: "/feature-demos/branding.svg"
    },
    {
        icon: Globe,
        title: "Global Low Latency",
        description: "Teach from anywhere, to anyone. Our edge network ensures crystal clear audio and video regardless of location.",
        gradient: "from-indigo-500/20 to-blue-500/20",
        image: "/feature-demos/latency.svg"
    }
];

export default function DetailedFeatures() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-16 text-center">
                <span className="text-sm font-semibold text-orbit-cyan uppercase tracking-wider">
                    Powerful Capabilities
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
                    Built for modern education
                </h2>
                <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                    Every tool you need to deliver world-class learning experiences, engineered for reliability and ease of use.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group relative bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-slate-900/60 hover:border-white/20 hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity blur-xl z-0`} />

                        {/* Image Container */}
                        <div className="relative h-48 w-full bg-slate-950/50 border-b border-white/5 group-hover:border-white/10 transition-colors z-10">
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>

                        {/* Content Container */}
                        <div className="relative p-6 z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 mb-4 group-hover:scale-110 transition-transform text-white">
                                <feature.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
