import { Bot, Cpu, Headphones, Zap } from "lucide-react";

const advantages = [
  {
    icon: Bot,
    title: "AI Scribe",
    subtitle: "Instant Lesson Reports for Parents",
    description:
      "After every class, our AI Scribe automatically generates a detailed, easy-to-read lesson report — what was covered, your child's progress, and personalized next steps. Parents stay fully informed without lifting a finger.",
    color: "#00f2ff",
    stat: "Reports in < 60 sec",
  },
  {
    icon: Cpu,
    title: "Zero-Lag Whiteboard",
    subtitle: "Built for Complex Physics Equations",
    description:
      "Our proprietary collaborative whiteboard is engineered for the demands of rocket science and astrophysics. Render high-fidelity orbital diagrams, LaTeX equations, and 3D models with zero lag on any device.",
    color: "#7b2ff7",
    stat: "< 10ms render time",
  },
  {
    icon: Headphones,
    title: "AI Help Desk",
    subtitle: "24/7 Technical Assistance for Students",
    description:
      "Stuck on a rocket propulsion problem at midnight? Commander Nova and our AI Help Desk are always on. Students get instant, curriculum-aware answers at any hour — so learning never has to wait.",
    color: "#f7c948",
    stat: "Available 24 / 7 / 365",
  },
  {
    icon: Zap,
    title: "Adaptive Learning Engine",
    subtitle: "AI That Learns How Your Child Learns",
    description:
      "Our engine continuously models each student's pace, strengths, and gaps — automatically adjusting lesson difficulty and pacing to keep them in the optimal learning zone. No child is left behind or held back.",
    color: "#ff6b35",
    stat: "Personalized per session",
  },
];

export default function AdvantageSection() {
  return (
    <section
      id="advantage"
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#2d1b69]/15 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="orbit-badge mb-4 mx-auto inline-flex">
            <Zap className="w-3 h-3" />
            The SessionOrbit Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Technology That{" "}
            <span className="orbit-gradient-text">Powers Discovery</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Purpose-built tools for space education — because kids deserve
            technology as ambitious as their dreams.
          </p>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div key={adv.title} className="glass-card p-8 flex gap-6 group">
                {/* Icon */}
                <div
                  className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${adv.color}22, ${adv.color}10)`,
                    border: `1px solid ${adv.color}40`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: adv.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-white">
                      {adv.title}
                    </h3>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: `${adv.color}18`,
                        color: adv.color,
                        border: `1px solid ${adv.color}30`,
                      }}
                    >
                      {adv.stat}
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: adv.color }}
                  >
                    {adv.subtitle}
                  </p>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom graphic callout */}
        <div className="mt-14 glass-card p-8 text-center">
          <p className="text-white/40 text-sm uppercase tracking-widest font-semibold mb-2">
            Trusted by forward-thinking families in
          </p>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {["🇺🇸 USA", "🇬🇧 UK", "🇮🇳 India", "🇦🇺 Australia", "🇩🇪 Germany", "🇨🇦 Canada"].map(
              (country) => (
                <span key={country} className="text-white/60 font-medium text-sm">
                  {country}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
