import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import LayoutContent from "./components/LayoutContent";
import NewsletterPopup from "@/components/marketing/NewsletterPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SessionOrbit",
  description: "Advanced Educational Platform - Powered by SessionOrbit",
};

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="bg-black text-white selection:bg-white selection:text-black antialiased min-h-screen flex flex-col">
        <LayoutContent>
          {children}
          <NewsletterPopup />
          <Analytics />
          <SpeedInsights />
        </LayoutContent>
      </body>
    </html>
  );
}
