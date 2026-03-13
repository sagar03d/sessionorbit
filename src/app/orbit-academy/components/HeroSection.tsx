import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-16 overflow-hidden">
      {/* Cosmic bg orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#2d1b69]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-16 right-0 w-[400px] h-[400px] rounded-full bg-[#00f2ff]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#7b2ff7]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="orbit-badge">
            <Sparkles className="w-3 h-3" />
            AI-Powered Space Education · Ages 10–15
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto">
          Launch Your Future.{" "}
          <span className="orbit-gradient-text">
            Become the Multi-Planetary Generation.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
          AI-powered astronomy courses that bridge the gap between imagination and
          engineering. Designed for curious kids — trusted by parents worldwide.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/orbit-academy#pricing">
            <button className="orbit-btn-primary flex items-center gap-2 text-base">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button className="orbit-btn-secondary flex items-center gap-2 text-base">
            <Play className="w-4 h-4 fill-[#00f2ff]" />
            Watch a Live Class
          </button>
        </div>

        {/* Hero visual — cinematic space scene placeholder */}
        <div className="relative mx-auto max-w-5xl">
          <div className="relative rounded-2xl overflow-hidden border border-[#00f2ff]/20 shadow-[0_0_80px_rgba(0,242,255,0.1)]">
            {/* Gradient scene */}
            <div className="aspect-[16/7] bg-gradient-to-b from-[#0a0612] via-[#1a0a3a] to-[#0a0612] flex items-center justify-center relative overflow-hidden">
              {/* Planet */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#7b2ff7] via-[#2d1b69] to-[#0a0612] shadow-[0_0_120px_rgba(123,47,247,0.5)] orbit-planet-glow" />
              </div>
              {/* Orbital ring */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 translate-y-1/3">
                <div
                  className="w-96 h-96 rounded-full border border-[#00f2ff]/20 orbit-ring-spin"
                  style={{ borderStyle: "dashed" }}
                />
              </div>
              {/* Stars pattern overlay */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }} />
              {/* Kids lifestyle placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10 relative pb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#00f2ff]/40 flex items-center justify-center bg-[#00f2ff]/10">
                    <Play className="w-7 h-7 text-[#00f2ff] fill-[#00f2ff]" />
                  </div>
                  <p className="text-white/50 text-sm font-medium">
                    Golden Hour · Kids Learning Space Science
                  </p>
                  <p className="text-white/25 text-xs mt-1">Cinematic space visual placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute -left-4 top-8 glass-card px-4 py-3 shadow-xl hidden md:block">
            <div className="text-2xl font-bold text-[#00f2ff]">12,000+</div>
            <div className="text-xs text-white/50">Young Astronauts</div>
          </div>
          <div className="absolute -right-4 top-8 glass-card px-4 py-3 shadow-xl hidden md:block">
            <div className="text-2xl font-bold text-[#00f2ff]">4.9★</div>
            <div className="text-xs text-white/50">Parent Rating</div>
          </div>
          <div className="absolute -right-4 bottom-8 glass-card px-4 py-3 shadow-xl hidden lg:block">
            <div className="text-2xl font-bold text-white">96%</div>
            <div className="text-xs text-white/50">Completion Rate</div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap gap-6 justify-center items-center">
          {["STEM Certified", "COPPA Compliant", "Parent-Approved", "NASA Curriculum Partner"].map(
            (badge) => (
              <span key={badge} className="text-xs text-white/35 uppercase tracking-widest font-semibold">
                ✦ {badge}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
