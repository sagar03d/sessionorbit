import DashboardSidebar from "./components/DashboardSidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Sidebar - Hidden on mobile, handled via Sheet later if needed */}
            <div className="hidden md:flex md:flex-shrink-0">
                <DashboardSidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-black text-white">
                    {children}
                </main>
            </div>
        </div>
    )
}
