"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, LogOut, Settings, User as UserIcon, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useUser"

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Students", href: "/dashboard/students", icon: Users },
]

export default function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, signOut } = useUser()

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <div className="flex h-full w-72 flex-col bg-black border-r border-neutral-800/50">
            {/* Logo / Brand */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-2 mb-8 group">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full group-hover:border-indigo-500/50 transition-colors" />
                        <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin [animation-duration:3s]" />
                        <span className="font-bold text-white text-lg relative z-10">S</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">SessionOrbit</span>
                </div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-2">
                    Menu
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-neutral-900 text-white shadow-sm"
                                    : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-neutral-800/50 bg-neutral-900/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                        <UserIcon className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {profile?.full_name || 'Loading...'}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                            Account Settings
                        </p>
                    </div>
                </div>

                <div className="grid gap-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-900/50 h-9 px-2"
                        onClick={() => router.push('/dashboard/settings')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 h-9 px-2"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    )
}
