"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "@/components/Footer"
import CommonHeader from "@/components/Header"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHomePage = pathname === "/"

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
