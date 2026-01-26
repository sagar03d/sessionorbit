import Hero from "@/components/landing/Hero";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <Stats />
        <FeaturesGrid />
        <Testimonials />
        <PricingPreview />
        <FAQ />
        <CTA />

        {/* Footer */}
        <footer className="w-full py-12 text-center border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="text-left">
                <h3 className="text-white font-semibold mb-3">Product</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="/features/ai-lesson-scribe" className="hover:text-white transition-colors">AI Lesson Scribe</a></li>
                  <li><a href="/features/ai-help-desk" className="hover:text-white transition-colors">AI Help Desk</a></li>
                  <li><a href="/features/smooth-stream" className="hover:text-white transition-colors">Smooth-Stream</a></li>
                  <li><a href="/features/focus-orbit" className="hover:text-white transition-colors">Focus Orbit</a></li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5">
              <p className="text-slate-500 text-sm">© 2024 SessionOrbit. The future of teaching.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
