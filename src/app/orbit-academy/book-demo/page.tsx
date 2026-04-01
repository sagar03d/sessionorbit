import DemoRegistrationForm from "./DemoRegistrationForm";
import "../orbit.css"; // Ensure styles are included

export const metadata = {
  title: "Launch Soon | Orbit Academy",
  description: "The future of space education is launching. Register for a free demo class today!",
};

export default function EarlyAccessPage() {
  return (
    <main className="orbit-root min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background Star field decoration (simplified representation) */}
      <div className="star-field">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2d1b69]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00f2ff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Left Side: Copy */}
          <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="orbit-badge mb-6">Launch Countdown In Progress</div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                The Future of <span className="orbit-gradient-text">Space Education</span> is Launching.
              </h1>
            </div>

            <p className="text-white/60 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Taught by our advanced <span className="text-[#00f2ff] font-semibold">AI Instructor: Nova</span>.
              Prepare your young explorer for a journey beyond the stars with personalized, 1-on-1 immersive curriculum.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-[#00f2ff] font-bold text-2xl">40+</div>
                <div className="text-white/40 text-xs uppercase tracking-tighter">Countries</div>
              </div>
              <div className="space-y-1">
                <div className="text-[#7b2ff7] font-bold text-2xl">100%</div>
                <div className="text-white/40 text-xs uppercase tracking-tighter">AI-Powered</div>
              </div>
              <div className="hidden sm:block space-y-1">
                <div className="text-[#ff6ef7] font-bold text-2xl">24/7</div>
                <div className="text-white/40 text-xs uppercase tracking-tighter">Mentorship</div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Container */}
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 delay-200">
            <DemoRegistrationForm />
          </div>
        </div>

        {/* AI Instructor & Video Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 border-t border-white/5">
          <div className="glass-card p-2 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0612] via-transparent to-transparent opacity-60 z-10" />
            <img
              src="/academy/nova.jpg"
              alt="Nova AI Instructor"
              className="w-full aspect-[4/5] object-cover rounded-[1rem] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="orbit-badge bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/30 mb-2">Lead AI Instructor</div>
              <h3 className="text-3xl font-bold text-white">Meet Nova</h3>
              <p className="text-white/60 text-sm mt-2">
                A state-of-the-art AI mission specialist designed to guide students through the complexities of Mars colonization and rocket architecture.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-white">Experience a <span className="orbit-gradient-text">Sample Lesson</span></h2>
              <p className="text-white/55 text-lg leading-relaxed">
                Watch how our AI instructors create immersive, interactive environments that adapt to every student's learning pace.
              </p>
            </div>

            <div className="glass-card overflow-hidden bg-black/40 border-[#00f2ff]/20">
              <div className="aspect-video w-full">
                <iframe
                  src="https://player.vimeo.com/video/1173595198"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  title="commandar-nova-sample"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 bg-white/5">
                <div className="text-[#00f2ff] mb-2">⚡️ Adaptive Speed</div>
                <p className="text-white/40 text-xs">AI adjusts difficulty in real-time based on student response.</p>
              </div>
              <div className="glass-card p-6 bg-white/5">
                <div className="text-[#7b2ff7] mb-2">🌍 3D Simulations</div>
                <p className="text-white/40 text-xs">Interactive Martian landscapes rendered on the fly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="relative z-10 py-12 w-full text-center border-t border-white/5 mt-auto">
        <p className="text-white/20 text-sm">
          &copy; 2026 SessionOrbit - Orbit Academy. All rights reserved across the galaxy.
        </p>
      </footer>
    </main>
  );
}
