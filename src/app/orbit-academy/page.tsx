import HeroSection from "./components/HeroSection";
import CourseGrid from "./components/CourseGrid";
import AdvantageSection from "./components/AdvantageSection";
import PricingSection from "./components/PricingSection";

export default function OrbitAcademyPage() {
  return (
    <>
      <HeroSection />
      <CourseGrid />
      <AdvantageSection />
      <PricingSection />

      {/* Final CTA band */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="glass-card p-12 relative overflow-hidden"
            style={{ borderColor: "rgba(0, 242, 255, 0.25)" }}
          >
            {/* Bg glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/30 to-[#00f2ff]/5 rounded-[1.25rem]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Launch Your Child&apos;s{" "}
                <span className="orbit-gradient-text">Space Career?</span>
              </h2>
              <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto">
                Join 12,000+ young astronauts from 40+ countries. First lesson
                is completely free — no credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#pricing">
                  <button className="orbit-btn-primary text-base px-8">
                    Start Free Today 🚀
                  </button>
                </a>
                <a href="/orbit-academy#courses">
                  <button className="orbit-btn-secondary text-base px-8">
                    Browse All Courses
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
