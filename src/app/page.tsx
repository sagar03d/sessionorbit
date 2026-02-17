import Hero from "@/components/landing/Hero";
import FeatureTabs from "@/components/landing/FeatureTabs";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import DetailedFeatures from "@/components/landing/DetailedFeatures";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import WhiteboardDemo from "@/components/landing/WhiteboardDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">

      {/* Modern Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Purple Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-[100%] blur-[120px] opacity-50 mix-blend-screen" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <div className="pt-12 sm:pt-20"> {/* Adjusted padding since Hero is big */}
          <FeatureTabs />
        </div>

        {/* Existing Content styled to match */}
        <div className="space-y-20 pb-20">
          <Stats />
          <FeaturesGrid />
          <section id="whiteboard">
            <WhiteboardDemo variant="demo" />
          </section>
          <DetailedFeatures />
          <Testimonials />
          <PricingPreview />
        </div>
        <FAQ />
        <div className="pb-20">
          <CTA />
        </div>
      </div>
    </main>
  );
}
