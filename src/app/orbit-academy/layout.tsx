import type { Metadata } from "next";
import StarField from "./components/StarField";
import "./orbit.css";

export const metadata: Metadata = {
  title: "The SessionOrbit Academy — Rocket Science & Astronomy for Kids",
  description:
    "AI-powered astronomy and rocket science courses for kids aged 10-15. Launch your future with Lunar Scouts, Rocket Architects, and Mars Colonist programs.",
};

export default function OrbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="orbit-root min-h-screen relative">
      <StarField />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
