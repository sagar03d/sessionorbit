"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, LogOut, Settings, User as UserIcon, Calendar, Gift } from "lucide-react"
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
    { name: "Referrals", href: "/dashboard/referrals", icon: Gift },
]

export default function DashboardSidebar({ onSidebarClose }: { onSidebarClose?: () => void }) {
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
                <div className="flex items-center gap-3 mb-8 group">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="orbit-container">
                            <div className="orbiting-dot" />
                        </div>
                        <img
                            src="/logo.png"
                            alt="SessionOrbit Logo"
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-deep-indigo to-orbit-cyan bg-clip-text text-transparent tracking-tight">
                        SessionOrbit
                    </span>
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
                            onClick={onSidebarClose}
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
                {/* Team Link for Admins / Pro Users */}
                {(profile?.role === 'admin' || profile?.role === 'owner' || profile?.plan === 'Pro' || profile?.plan === 'pro') && (
                    <Link
                        href="/teams"
                        onClick={onSidebarClose}
                        className={cn(
                            "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                            pathname === "/teams"
                                ? "bg-neutral-900 text-white shadow-sm"
                                : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
                        )}
                    >
                        <Users
                            className={cn(
                                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                pathname === "/teams" ? "text-white" : "text-neutral-500 group-hover:text-white"
                            )}
                        />
                        Team
                    </Link>
                )}
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
                        onClick={() => {
                            router.push('/dashboard/settings')
                            onSidebarClose?.()
                        }}
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
