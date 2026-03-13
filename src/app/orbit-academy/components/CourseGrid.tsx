"use client";

import Link from "next/link";
import { Moon, Rocket, Globe, ArrowRight, Star } from "lucide-react";

const courses = [
  {
    id: "lunar-scouts",
    icon: Moon,
    badge: "Ages 10–12",
    badgeColor: "from-[#00f2ff] to-[#0099aa]",
    title: "Lunar Scouts",
    tagline: "Where Every Mission Starts",
    description:
      "Begin your space journey with the Moon! Students explore lunar geology, orbital mechanics, and the engineering challenges of living on another world.",
    highlights: [
      "Moon exploration & surface mapping",
      "Orbital physics made fun",
      "Build a digital lunar base",
      "Learn from real mission data",
    ],
    tags: ["Beginner Friendly", "12 Live Lessons", "Certificate"],
    accentColor: "#00f2ff",
    href: "/orbit-academy/courses/lunar-scouts",
  },
  {
    id: "rocket-architects",
    icon: Rocket,
    badge: "Ages 12–15",
    badgeColor: "from-[#7b2ff7] to-[#00f2ff]",
    title: "Rocket Architects",
    tagline: "Science Meets Engineering",
    description:
      "Dive deep into propulsion, STEM physics, and advanced mathematics. Design virtual rockets, run simulations, and understand the forces that conquer gravity.",
    highlights: [
      "Newton's laws & propulsion physics",
      "Rocket design simulations",
      "Advanced math for builders",
      "Team mission challenges",
    ],
    tags: ["STEM Intensive", "16 Live Lessons", "Competition Eligible"],
    accentColor: "#a855f7",
    featured: true,
    href: "/orbit-academy/courses/rocket-architects",
  },
  {
    id: "mars-colonist",
    icon: Globe,
    badge: "Elite",
    badgeColor: "from-[#ff6b35] to-[#f7c948]",
    title: "Mars Colonist",
    tagline: "1-on-1 with Commander Nova",
    description:
      "Our most advanced program. Elite students work 1-on-1 with Commander Nova, an AI specialized in Mars mission planning, terraforming strategy, and interplanetary logistics.",
    highlights: [
      "Personal AI mentor: Commander Nova",
      "Real Mars mission simulations",
      "Terraforming & life support design",
      "Industry expert guest sessions",
    ],
    tags: ["Elite Program", "Unlimited Sessions", "Priority Support"],
    accentColor: "#f7c948",
    href: "/orbit-academy/courses/mars-colonist",
  },
];

export default function CourseGrid() {
  return (
    <section id="courses" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="orbit-badge mb-4 mx-auto inline-flex">
            <Star className="w-3 h-3" />
            Choose Your Mission
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Your Path to the{" "}
            <span className="orbit-gradient-text">Stars Starts Here</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Three expertly crafted tracks for young explorers at every level of
            their space journey.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className={`glass-card p-7 flex flex-col relative ${course.featured ? "md:scale-105" : ""}`}
              >
                {course.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7b2ff7] to-[#00f2ff] text-[#0a0612] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                    Most Popular
                  </div>
                )}

                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${course.accentColor}22, ${course.accentColor}11)`,
                      border: `1px solid ${course.accentColor}44`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: course.accentColor }} />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${course.badgeColor} text-[#0a0612]`}
                  >
                    {course.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-white mb-1">
                  {course.title}
                </h3>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: course.accentColor }}
                >
                  {course.tagline}
                </p>
                <p className="text-sm text-white/55 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6 flex-1">
                  {course.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-white/70">
                      <span style={{ color: course.accentColor }} className="mt-0.5 shrink-0">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link href={course.href} className="mt-auto">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full font-semibold text-sm transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${course.accentColor}22, ${course.accentColor}11)`,
                      border: `1.5px solid ${course.accentColor}55`,
                      color: course.accentColor,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${course.accentColor}40, ${course.accentColor}20)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${course.accentColor}22, ${course.accentColor}11)`;
                    }}
                  >
                    Explore {course.title}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
