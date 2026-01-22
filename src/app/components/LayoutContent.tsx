"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHomePage = pathname === "/"

    if (!isHomePage) {
        return (
            <main className="flex-1">
                {children}
            </main>
        )
    }

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
