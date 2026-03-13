import { Check, Zap } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    id: "explorer",
    name: "Explorer",
    price: 5,
    period: "/mo",
    tagline: "Perfect to get started",
    description: "Ideal for curious beginners who want to test the cosmos before committing.",
    color: "#00f2ff",
    features: [
      "Access to Lunar Scouts (Ages 10–12)",
      "4 live lessons per month",
      "AI Help Desk (business hours)",
      "Parent progress dashboard",
      "Course completion certificate",
    ],
    cta: "Start Exploring",
    href: "/orbit-academy#start",
  },
  {
    id: "commander",
    name: "Commander",
    price: 19,
    period: "/mo",
    tagline: "Best value for serious learners",
    description: "Our most popular plan — unlimited access, AI Scribe, and advanced courses.",
    color: "#7b2ff7",
    popular: true,
    features: [
      "All Explorer features",
      "Unlimited live lessons",
      "Access to Rocket Architects (Ages 12–15)",
      "AI Scribe lesson reports",
      "Zero-Lag Whiteboard sessions",
      "24/7 AI Help Desk",
      "Competition eligibility",
      "Priority parent support",
    ],
    cta: "Become a Commander",
    href: "/orbit-academy#start",
  },
  {
    id: "agency",
    name: "Agency",
    price: 79,
    period: "/mo",
    tagline: "For academies & multi-child families",
    description: "Multi-seat licenses for tutoring companies, schools, or families with 3+ kids.",
    color: "#f7c948",
    features: [
      "Everything in Commander",
      "Up to 10 student seats",
      "Mars Colonist elite access",
      "1-on-1 with Commander Nova AI",
      "Dedicated account manager",
      "Custom curriculum options",
      "School / tutor branding",
      "Monthly strategy calls",
    ],
    cta: "Launch Your Team",
    href: "/orbit-academy#start",
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7b2ff7]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="orbit-badge mb-4 mx-auto inline-flex">
            <Zap className="w-3 h-3" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Choose Your{" "}
            <span className="orbit-gradient-text">Mission Rank</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            No hidden fees. Cancel anytime. Start free — no credit card required.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`glass-card p-8 flex flex-col h-full ${tier.popular ? "pricing-popular md:scale-105" : ""}`}
            >
              {/* Name + tagline */}
              <div className="mb-6">
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: tier.color }}
                >
                  {tier.tagline}
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-7">
                <span className="text-5xl font-extrabold text-white">
                  ${tier.price}
                </span>
                <span className="text-white/40 text-lg mb-1">{tier.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: tier.color }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={tier.href}>
                <button
                  className="w-full py-3.5 px-5 rounded-full font-bold text-sm transition-all duration-200"
                  style={
                    tier.popular
                      ? {
                          background: `linear-gradient(135deg, ${tier.color}, #00f2ff)`,
                          color: "#0a0612",
                          boxShadow: `0 0 24px ${tier.color}55`,
                        }
                      : {
                          background: `${tier.color}18`,
                          color: tier.color,
                          border: `1.5px solid ${tier.color}55`,
                        }
                  }
                >
                  {tier.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-white/35 text-sm">
            🛡&nbsp; <strong className="text-white/60">30-day money-back guarantee</strong> · No contracts ·{" "}
            <strong className="text-white/60">Free 7-day trial</strong> on all plans
          </p>
        </div>
      </div>
    </section>
  );
}
