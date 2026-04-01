"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, addMonths, startOfDay } from "date-fns";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export default function DemoRegistrationForm() {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    childName: "",
    childAge: "",
    date: "",
    time: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  const minDateString = useMemo(() => {
    const date = addMonths(startOfDay(new Date()), 1);
    return format(date, "yyyy-MM-dd");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return;
    
    setStatus("loading");
    
    try {
      // 1. Initial Registration (Status: Pending)
      const regResponse = await fetch("/api/orbit-academy/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!regResponse.ok) {
        throw new Error("Failed to register");
      }

      const { registrationId } = await regResponse.json();

      // 2. Initiate Payment Checkout
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_cart: [
            {
              product_id: PAYMENT_CONFIG.productIds.demo || "pdt_demo_class",
              quantity: 1,
            },
          ],
          customer: {
            name: formData.parentName,
            email: formData.email,
          },
          metadata: {
            registration_id: registrationId,
            child_name: formData.childName,
            child_age: formData.childAge,
            preferred_date: formData.date,
            preferred_time: formData.time,
          }
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to initiate checkout");
      }

      const { checkout_url } = await checkoutResponse.json();
      if (checkout_url) {
        router.push(checkout_url);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-card p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/30 to-[#00f2ff]/5 rounded-[1.25rem]" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#00f2ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Registration Successful!</h2>
          <p className="text-white/55 text-lg mb-8">
            Get ready for an interstellar experience. We'll send the demo class details to your email shortly.
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="orbit-btn-secondary"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="glass-card p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 rounded-[1.25rem]" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Launch Aborted</h2>
          <p className="text-white/55 text-lg mb-8">
            Something went wrong during registration. Please try again.
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="orbit-btn-secondary border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 sm:p-12 relative overflow-hidden group">
      {/* Bg glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/30 to-[#00f2ff]/5 rounded-[1.25rem]" />
      
      <div className="relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">Reserve Your Seat</h3>
          <p className="text-white/40 text-sm italic">Limited slots available for the next launch window.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#00f2ff]/70 ml-1">Parent Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Neil Armstrong"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#00f2ff]/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2ff]/40 transition-all font-sans text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#00f2ff]/70 ml-1">Email</label>
              <input
                required
                type="email"
                placeholder="cmdr@spaceorbit.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#00f2ff]/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2ff]/40 transition-all font-sans text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7b2ff7]/70 ml-1">Child's Name</label>
              <input
                required
                type="text"
                placeholder="Future Explorer"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#7b2ff7]/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7b2ff7]/40 transition-all font-sans text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7b2ff7]/70 ml-1">Age</label>
              <input
                required
                type="number"
                min="5"
                max="18"
                placeholder="Age"
                value={formData.childAge}
                onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#7b2ff7]/20 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7b2ff7]/40 transition-all font-sans text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ff6ef7]/70 ml-1">Flight Date</label>
              <input
                required
                type="date"
                min={minDateString}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#ff6ef7]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6ef7]/40 transition-all font-sans [color-scheme:dark] text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ff6ef7]/70 ml-1">Flight Time</label>
              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#0a0612]/60 border border-[#ff6ef7]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6ef7]/40 transition-all font-sans [color-scheme:dark] text-sm"
              />
            </div>
          </div>

          <button
            disabled={status === "loading" || !formData.date || !formData.time}
            type="submit"
            className="orbit-btn-primary w-full text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.01] transform transition-transform"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Book Demo for $1 🚀"
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-[10px] mt-6 px-4">
          By registering, you agree to receive communications regarding Orbit Academy. 
          Zero gravity registration.
        </p>
      </div>
    </div>
  );
}
