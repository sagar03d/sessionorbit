import DashboardSidebar from "./components/DashboardSidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <DashboardSidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-black">
                    <div className="flex items-center gap-2">
                        <div className="orbit-container w-6 h-6">
                            <div className="orbiting-dot" />
                        </div>
                        <span className="font-bold text-white">SessionOrbit</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r border-neutral-800 bg-black w-72">
                            <DashboardSidebar />
                        </SheetContent>
                    </Sheet>
                </div>

                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-black text-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
