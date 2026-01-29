"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "@/components/Footer"
import CommonHeader from "@/components/Header"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHomePage = pathname === "/"
    const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/room")

    if (isHomePage) {
        return (
            <>
                <Header />
                <main className="grow pt-16">
                    {children}
                </main>
                <Footer />
            </>
        )
    }

    if (isDashboard) {
        return (
            <main className="flex-1">
                {children}
            </main>
        )
    }

    return (
        <>
            <CommonHeader />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    )
}
