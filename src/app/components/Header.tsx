"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles, Mic, Wifi, Eye } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

export default function Header() {
  const [session, setSession] = useState<any>(null);
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
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full group-hover:border-indigo-500/50 transition-colors" />
              <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin [animation-duration:3s]" />
              <span className="font-bold text-white text-lg relative z-10">S</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
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

            <Link href="/pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Mission Control
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
      </div>
    </header>
  );
}
