"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "@/components/Footer"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Auth/App routes that should NOT have the global header/footer
    // Note: /courses is likely under /dashboard/courses, so dashboard check covers it.
    // If /courses exists as top level, add it here.
    const isAppRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/teams") ||
        pathname.startsWith("/room") ||
        pathname.startsWith("/free-whiteboard")

    if (isAppRoute) {
        return (
            <main className="flex-1">
                {children}
            </main>
        )
    }

    // Default Layout (Homepage Header + Content + Footer)
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
