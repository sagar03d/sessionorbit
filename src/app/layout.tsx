import type { Metadata } from "next";
import { Inter, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import LayoutContent from "./components/LayoutContent";
import NewsletterPopup from "@/components/marketing/NewsletterPopup";
import { PostHogProvider } from "@/providers/PostHogProvider";
import Script from "next/script";

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

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SessionOrbit",
  description: "Advanced Educational Platform - Powered by SessionOrbit",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${caveat.variable}`}>
      <body className="bg-black text-white selection:bg-white selection:text-black antialiased min-h-screen flex flex-col">
        {/* Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-87YJTS669R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-87YJTS669R');
          `}
        </Script>
        <LayoutContent>
          <PostHogProvider>
            {children}
            <NewsletterPopup />
          </PostHogProvider>
        </LayoutContent>
      </body>
    </html>
  );
}
