"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles, Mic, Wifi, Eye, Menu, X, Rocket, Moon, Globe } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="orbit-container">
                <div className="orbiting-dot" />
              </div>
              <img
                src="/logo.png"
                alt="SessionOrbit Logo"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
            <span className="font-bold bg-gradient-to-r from-deep-indigo to-orbit-cyan bg-clip-text text-transparent text-lg tracking-tight hidden sm:block">
              SessionOrbit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Popover.Root>
              <Popover.Trigger className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-white transition-colors outline-none group data-[state=open]:text-white">
                Features <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition-transform" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="z-50 w-64 p-2 bg-[#0B0C15] border border-white/10 rounded-xl shadow-xl data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade" sideOffset={5}>
                  <div className="grid gap-1">
                    <Link href="/features/ai-lesson-scribe" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                      <div>
                        <div className="text-sm font-medium text-white">AI Lesson Scribe</div>
                        <div className="text-xs text-neutral-500">Automated class summaries</div>
                      </div>
                    </Link>
                    <Link href="/features/ai-help-desk" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <Mic className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <div>
                        <div className="text-sm font-medium text-white">AI Help Desk</div>
                        <div className="text-xs text-neutral-500">Instant audio/video debug</div>
                      </div>
                    </Link>
                    <Link href="/features/smooth-stream" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <Wifi className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                      <div>
                        <div className="text-sm font-medium text-white">Smooth-Stream</div>
                        <div className="text-xs text-neutral-500">Lag-free teaching</div>
                      </div>
                    </Link>
                    <Link href="/features/focus-orbit" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <Eye className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                      <div>
                        <div className="text-sm font-medium text-white">Focus Orbit</div>
                        <div className="text-xs text-neutral-500">Attention tracking</div>
                      </div>
                    </Link>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-white transition-colors outline-none group data-[state=open]:text-white">
                Courses <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition-transform" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="z-50 w-72 p-2 bg-[#0B0C15] border border-white/10 rounded-xl shadow-xl data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade" sideOffset={5}>
                  <div className="grid gap-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">SessionOrbit Academy Missions</div>
                    <Link href="/orbit-academy/courses/lunar-scouts" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                        <Moon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">Lunar Scouts</div>
                        <div className="text-xs text-neutral-500">Ages 10–12 · Orbital Basics</div>
                      </div>
                    </Link>
                    <Link href="/orbit-academy/courses/rocket-architects" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                        <Rocket className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">Rocket Architects</div>
                        <div className="text-xs text-neutral-500">Ages 12–15 · STEM Engineering</div>
                      </div>
                    </Link>
                    <Link href="/orbit-academy/courses/mars-colonist" className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                        <Globe className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">Mars Colonist</div>
                        <div className="text-xs text-neutral-500">Elite · AI-Led Simulations</div>
                      </div>
                    </Link>
                    <div className="h-px bg-white/5 my-1" />
                    <Link href="/orbit-academy" className="px-3 py-2 text-xs text-center font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      View All Academy Tracks
                    </Link>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Link href="/pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/free-whiteboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Free Whiteboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mission Control
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black/95 backdrop-blur-md h-screen">
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Features</div>
              <Link href="/features/ai-lesson-scribe" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white text-sm">AI Lesson Scribe</Link>
              <Link href="/features/ai-help-desk" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white text-sm">AI Help Desk</Link>
              <Link href="/features/smooth-stream" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white text-sm">Smooth-Stream</Link>
              <Link href="/features/focus-orbit" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white text-sm">Focus Orbit</Link>
            </div>

            <div className="h-px bg-neutral-800" />

            <div className="space-y-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Orbit Academy</div>
              <Link href="/orbit-academy/courses/lunar-scouts" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-neutral-300 hover:text-white text-sm">
                <Moon className="w-4 h-4 text-cyan-400" /> Lunar Scouts (Ages 10-12)
              </Link>
              <Link href="/orbit-academy/courses/rocket-architects" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-neutral-300 hover:text-white text-sm">
                <Rocket className="w-4 h-4 text-purple-400" /> Rocket Architects (Ages 12-15)
              </Link>
              <Link href="/orbit-academy/courses/mars-colonist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-neutral-300 hover:text-white text-sm">
                <Globe className="w-4 h-4 text-amber-400" /> Mars Colonist (Elite)
              </Link>
            </div>

            <div className="h-px bg-neutral-800" />

            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white font-medium">Pricing</Link>
            <Link href="/free-whiteboard" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white font-medium">Free Whiteboard</Link>

            <div className="h-px bg-neutral-800" />

            {session ? (
              <div className="space-y-4">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Mission Control
                </Link>
                <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white font-medium">Settings</Link>
                <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} className="block w-full text-left text-red-400 hover:text-red-300 font-medium">Logout</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-center font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
